package com.quickcollab.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.config.AWSConfig;
import com.quickcollab.dtos.request.ProjectDetailsRequestDTO;
import com.quickcollab.dtos.request.ProjectDetailsRequestStringifiedDTO;
import com.quickcollab.dtos.request.UpdateUserProfileRequestDTO;
import com.quickcollab.dtos.request.UserRegisterDTO;
import com.quickcollab.dtos.response.job.contentCreator.ContentCreatorJobPost;
import com.quickcollab.dtos.response.job.jobSeeker.JobSeekerJobApplication;
import com.quickcollab.dtos.response.user.*;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.enums.MediaType;
import com.quickcollab.enums.Platform;
import com.quickcollab.enums.UserRole;
import com.quickcollab.events.CustomAuthenticationSuccessEvent;
import com.quickcollab.events.CustomLogoutSuccessEvent;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceAlreadyExistsException;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.model.*;
import com.quickcollab.pojo.*;
import com.quickcollab.repository.ConversationRepository;
import com.quickcollab.repository.UserRepository;
import com.quickcollab.repository.WorkRepository;
import com.quickcollab.utils.GeneralConfig;
import com.quickcollab.utils.JwtBlacklistService;
import com.quickcollab.utils.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;


import java.io.IOException;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class UserService {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final JwtBlacklistService jwtBlacklistService;
    private final ApplicationEventPublisher eventPublisher;
    private final ObjectMapper objectMapper;
    private final AWSService awsService;
    private final ConversationRepository conversationRepository;
    private final S3Client s3Client;
    private final WorkRepository workRepository;
    private final GeneralConfig generalConfig;

    public UserService( GeneralConfig generalConfig ,WorkRepository workRepository,ConversationRepository conversationRepository, ModelMapper modelMapper, UserRepository userRepository, JwtTokenUtil jwtTokenUtil, AWSService awsService, ObjectMapper objectMapper, ApplicationEventPublisher eventPublisher, JwtBlacklistService jwtBlacklistService, S3Client s3Client) {
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.awsService = awsService;
        this.objectMapper = objectMapper;
        this.eventPublisher = eventPublisher;
        this.jwtBlacklistService = jwtBlacklistService;
        this.conversationRepository = conversationRepository;
        this.s3Client = s3Client;
        this.workRepository =  workRepository;
        this.generalConfig = generalConfig;
    }

    @Value("${aws.cloudfront.distribution}")
    private String cloudFrontDistribution;


    public LoginResponseDTO<?> registerUser(UserRegisterDTO userRegisterDTO){

        // check if the user already exists
        String emailId = userRegisterDTO.getEmailId();
        Optional<User> existingUser = userRepository.findByEmailId(emailId);
        if(existingUser.isPresent()){
            throw new ResourceAlreadyExistsException("User","email",emailId);
        }

        // convert UserRegisterDTO to User
        User user = modelMapper.map(userRegisterDTO, User.class);
        User savedUser = userRepository.save(user);
        ReportingUser reportingUser = new ReportingUser();
        reportingUser.setLastName(savedUser.getLastName());
        reportingUser.setFirstName(savedUser.getFirstName());
        reportingUser.setUserId(savedUser.getUserId());
        user.setReportsTo(reportingUser);
        savedUser = userRepository.save(user);

        LoginResponseDTO<?> loginResponseDTO = getUserByEmail(userRegisterDTO.getEmailId());
        loginResponseDTO.setMessage("User registered successfully");
        loginResponseDTO.setSuccess(true);

        eventPublisher.publishEvent(new CustomAuthenticationSuccessEvent(this,savedUser.getUserId()));

        return loginResponseDTO;
    }

    public Optional<User> findByEmail(String emailId) {
        Optional<User> optionalUser = userRepository.findByEmailId(emailId);
        if(optionalUser.isPresent()){
            User user = optionalUser.get();
            return Optional.of(user);
        }
        return Optional.empty();
    }

    @Transactional
    public  LoginResponseDTO<?> getUserByEmail(String emailId){
        Optional<User> optionalUser = findByEmail(emailId);
        if(optionalUser.isPresent()){
            User user = optionalUser.get();

            // check if the user has completed his notice period
            if(user.getIsServingNoticePeriod() && user.getNoticePeriodEndDate().before(new Date())){
                user.setUserRole(UserRole.JOB_SEEKER);
                user.setReportsTo(null);
                List<Conversation> userConversations = conversationRepository.findAll().stream().filter(conversation ->{
                    return conversation.getMembers().contains(user);
                }).toList();
                userConversations.forEach(conversation->{
                    if(conversation.getIsTeamMemberConversation()){
                        List<User>members = conversation.getMembers().stream().filter (member->  !member.getUserId().equals(user.getUserId())).toList();
                        conversation.setMembers(members);
                        conversationRepository.save(conversation);
                    }
                });

                if(user.getReportsTo()!=null){

                    userConversations.forEach((conversation)->{
                        AtomicReference<Boolean> check = new AtomicReference<>(true);
                        conversation.getMembers().forEach((member)->{
                            if(!member.getReportsTo().getUserId().equals(user.getReportsTo().getUserId())){
                                check.set(false);
                            }
                        });
                        conversation.setIsTeamMemberConversation(check.get().equals(true));
                        conversationRepository.save(conversation);
                    });
                }
                JobHistory currentJobDetails = user.getCurrentJobDetails();

                if(currentJobDetails!=null){
                    currentJobDetails.setUserRole(user.getUserRole());
                    currentJobDetails.setSalary(user.getCurrentSalary());
                    user.getJobHistory().add(currentJobDetails);
                }

                userRepository.save(user);
            }


            String userRole =user.getUserRole().toString();
            if(userRole.equals(UserRole.CONTENT_CREATOR.toString())){
                ContentCreatorUserDetails contentCreatorUserDetails = modelMapper.map(user, ContentCreatorUserDetails.class);
                List<ContentCreatorEmployee> employees = user.getEmployees().stream().map(employee -> modelMapper.map(employee , ContentCreatorEmployee.class)).toList();
                List<Job> postedJobs = user.getJobsPosted();
                List<UploadRequest> uploadRequests = user.getUploadRequests();
                List<UploadRequestResponseDTO> uploadRequestResponseDTOS = uploadRequests.stream().map(request -> {
                    UploadRequestResponseDTO uploadRequestResponseDTO = new UploadRequestResponseDTO();
                    uploadRequestResponseDTO.setUploadTo(request.getUploadTo());
                    uploadRequestResponseDTO.setRequestId(request.getUploadRequestId());
                    uploadRequestResponseDTO.setTags(request.getTags());
                    uploadRequestResponseDTO.setUploadRequestStatus(request.getUploadRequestStatus());
                    uploadRequestResponseDTO.setUploadTypeMapping(request.getUploadTypeMapping());
                    uploadRequestResponseDTO.setMediaType(request.getMediaType());
                    uploadRequestResponseDTO.setMediaUrl(request.getFileUrl());
                    uploadRequestResponseDTO.setDescription(request.getDescription());
                    uploadRequestResponseDTO.setTitle(request.getTitle());
                    ReportingUser requestBy = new ReportingUser();
                    requestBy.setUserId(request.getRequestedBy().getUserId());
                    requestBy.setFirstName(request.getRequestedBy().getFirstName());
                    requestBy.setLastName(request.getRequestedBy().getLastName());
                    uploadRequestResponseDTO.setRequestBy(requestBy);
                    return uploadRequestResponseDTO;
                }).toList();

                contentCreatorUserDetails.setUploadRequests(uploadRequestResponseDTOS);
                List<ContentCreatorJobPost> jobsPosted = postedJobs.stream().map(jobPost -> {
                    ContentCreatorJobPost contentCreatorJobPost = new ContentCreatorJobPost();
                    contentCreatorJobPost.setJobLocation(jobPost.getJobLocation());
                    contentCreatorJobPost.setJobName(jobPost.getJobName());
                    contentCreatorJobPost.setJobDescription(jobPost.getJobDescription());
                    contentCreatorJobPost.setJobStatus(jobPost.getJobStatus().toString());
                    contentCreatorJobPost.setJobId(jobPost.getJobId());
                    contentCreatorJobPost.setPostedOn(jobPost.getPostedOn());
                    contentCreatorJobPost.setJobLocationType(jobPost.getJobLocationType().toString());
                    contentCreatorJobPost.setOpeningsCount(jobPost.getOpeningsCount());
                    contentCreatorJobPost.setNoticePeriodDays(jobPost.getNoticePeriodDays());
                    List<ContentCreatorEmployee> applicants =jobPost.getApplicants().stream().map((applicant)->{
                                    return modelMapper.map(applicant, ContentCreatorEmployee.class);
                    }).toList();
                    List<OfferDetail>offeredTo = jobPost.getOfferedTo().stream().map(offer ->{
                        return modelMapper.map(offer, OfferDetail.class);
                    }).toList();
                    contentCreatorJobPost.setOfferedTo(offeredTo);
                    contentCreatorJobPost.setApplicants(applicants);
                    return contentCreatorJobPost;
                        }
                ).toList();
                List<ProviderDTO> providers = user.getProviders().stream().map((provider)->{
                        ProviderDTO providerDTO = new ProviderDTO();
                        providerDTO.setProviderName(provider.getName());
                        return providerDTO;
                }).toList();
                contentCreatorUserDetails.setProviders(providers);
                contentCreatorUserDetails.setEmployees(employees);
                contentCreatorUserDetails.setJobsPosted(jobsPosted);
                LoginResponseDTO<ContentCreatorUserDetails> loginResponseDTO = new LoginResponseDTO<>();
                loginResponseDTO.setUser(contentCreatorUserDetails);
                loginResponseDTO.setSuccess(true);
                loginResponseDTO.setMessage("User details fetched successfully");
                eventPublisher.publishEvent(new CustomAuthenticationSuccessEvent(this,contentCreatorUserDetails.getUserId()));
                return (LoginResponseDTO<ContentCreatorUserDetails>) loginResponseDTO;

            }else if(userRole.equals(UserRole.JOB_SEEKER.toString())){
                JobSeekerUserDetails jobSeekerUserDetails = modelMapper.map(user, JobSeekerUserDetails.class);
                List<JobSeekerJobApplication> appliedJobs = user.getAppliedJobs().stream().map(job->{
                    JobSeekerJobApplication appliedJob = new JobSeekerJobApplication();
                    appliedJob.setJobDescription(job.getJobDescription());
                    appliedJob.setJobName(job.getJobName());
                    appliedJob.setJobId(job.getJobId());
                    appliedJob.setJobStatus(job.getJobStatus().toString());
                    appliedJob.setJobLocation(job.getJobLocation());
                    appliedJob.setJobLocationType(job.getJobLocationType().toString());
                    appliedJob.setOpeningsCount(job.getOpeningsCount());
                    appliedJob.setNoticePeriodDays(job.getNoticePeriodDays());

                    return appliedJob;
                }).toList();

                List<PersonalProject> personalProjectList = user.getMyProjects().stream().map(project -> {
                    PersonalProject personalProject = new PersonalProject();
                    personalProject.setDescription(project.getDescription());
                    personalProject.setTitle(project.getTitle());
                    personalProject.setExternalLinks(project.getExternalLinks());
                    personalProject.setMediaFiles(project.getMediaFiles());
                    personalProject.setProjectId(project.getWorkId());
                    personalProject.getMediaFiles().sort(Comparator.comparing(media -> media.getType() == MediaType.IMAGE ? 0 : 1));
                    return personalProject;
                }).toList();
                jobSeekerUserDetails.setPersonalProjects(personalProjectList);
                jobSeekerUserDetails.setAppliedJobs(appliedJobs);
                LoginResponseDTO<JobSeekerUserDetails> loginResponseDTO = new LoginResponseDTO<>();
                loginResponseDTO.setUser(jobSeekerUserDetails);
                loginResponseDTO.setSuccess(true);
                loginResponseDTO.setMessage("User details fetched successfully");
                eventPublisher.publishEvent(new CustomAuthenticationSuccessEvent(this,jobSeekerUserDetails.getUserId()));
                return (LoginResponseDTO<JobSeekerUserDetails>) loginResponseDTO;

            }else{
                TeamMemberUserDetails teamMemberUserDetails = modelMapper.map(user, TeamMemberUserDetails.class);
                User contentCreator = userRepository.findById(teamMemberUserDetails.getReportsTo().getUserId()).orElseThrow(()-> new ResourceNotFoundException("User","id",teamMemberUserDetails.getReportsTo().getUserId()));
                List<Platform> platforms = contentCreator.getProviders().stream().map(Provider::getName).toList();
                teamMemberUserDetails.setAvailablePlatforms(platforms);
                teamMemberUserDetails.setAvailableContentTypes(generalConfig.availableContentTypes());
                List<UploadRequest> uploadRequests = contentCreator.getUploadRequests().stream().filter((request)->{
                   return  request.getRequestedBy().getUserId().equals(teamMemberUserDetails.getUserId());
                }).toList();
                List<UploadRequestResponseDTO> uploadRequestResponseDTOS = uploadRequests.stream().map(request -> {
                    UploadRequestResponseDTO uploadRequestResponseDTO = new UploadRequestResponseDTO();
                    uploadRequestResponseDTO.setUploadTo(request.getUploadTo());
                    uploadRequestResponseDTO.setTags(request.getTags());
                    uploadRequestResponseDTO.setRequestId(request.getUploadRequestId());
                    uploadRequestResponseDTO.setUploadRequestStatus(request.getUploadRequestStatus());
                    uploadRequestResponseDTO.setUploadTypeMapping(request.getUploadTypeMapping());
                    uploadRequestResponseDTO.setMediaType(request.getMediaType());
                    uploadRequestResponseDTO.setMediaUrl(request.getFileUrl());
                    uploadRequestResponseDTO.setDescription(request.getDescription());
                    uploadRequestResponseDTO.setTitle(request.getTitle());
                    return uploadRequestResponseDTO;
                }).toList();

                teamMemberUserDetails.setUploadRequests(uploadRequestResponseDTOS);
                List<JobSeekerJobApplication> appliedJobs = user.getAppliedJobs().stream().map(job->{
                    JobSeekerJobApplication appliedJob = new JobSeekerJobApplication();
                    appliedJob.setJobDescription(job.getJobDescription());
                    appliedJob.setJobName(job.getJobName());
                    appliedJob.setJobId(job.getJobId());
                    appliedJob.setJobStatus(job.getJobStatus().toString());
                    appliedJob.setJobLocation(job.getJobLocation());
                    appliedJob.setJobLocationType(job.getJobLocationType().toString());
                    appliedJob.setOpeningsCount(job.getOpeningsCount());
                    appliedJob.setNoticePeriodDays(job.getNoticePeriodDays());

                    return appliedJob;
                }).toList();

                List<PersonalProject> personalProjectList = user.getMyProjects().stream().map(project -> {
                    PersonalProject personalProject = new PersonalProject();
                    personalProject.setDescription(project.getDescription());
                    personalProject.setTitle(project.getTitle());
                    personalProject.setExternalLinks(project.getExternalLinks());
                    personalProject.setMediaFiles(project.getMediaFiles());
                    personalProject.setProjectId(project.getWorkId());
                    personalProject.getMediaFiles().sort(Comparator.comparing(media -> media.getType() == MediaType.IMAGE ? 0 : 1));
                    return personalProject;
                }).toList();
                teamMemberUserDetails.setPersonalProjects(personalProjectList);

                teamMemberUserDetails.setNoticePeriodEndDate(user.getNoticePeriodEndDate());
                teamMemberUserDetails.setCurrentJobJoinedOn(user.getCurrentJobJoinedOn());
                teamMemberUserDetails.setIsServingNoticePeriod(user.getIsServingNoticePeriod());
                teamMemberUserDetails.setAppliedJobs(appliedJobs);
                teamMemberUserDetails.setCurrentSalary(user.getCurrentSalary());
                teamMemberUserDetails.setCurrentJobDetails(user.getCurrentJobDetails());
                LoginResponseDTO<TeamMemberUserDetails> loginResponseDTO = new LoginResponseDTO<>();
                loginResponseDTO.setUser(teamMemberUserDetails);
                loginResponseDTO.setSuccess(true);
                loginResponseDTO.setMessage("User details fetched successfully");
                eventPublisher.publishEvent(new CustomAuthenticationSuccessEvent(this,teamMemberUserDetails.getUserId()));
                return (LoginResponseDTO<TeamMemberUserDetails>) loginResponseDTO;

            }
        }
        LoginResponseDTO<User> loginResponseDTO = new LoginResponseDTO<>();
        loginResponseDTO.setUser(null);
        loginResponseDTO.setSuccess(false);
        loginResponseDTO.setMessage("Please login in to access this resource");
        return loginResponseDTO;
    }

    public ResponseDTO logoutUser(HttpServletRequest request){

        String jwtToken = request.getHeader("Authorization");

        if (jwtToken != null && !jwtToken.isEmpty()) {
            long tokenExpiration = jwtTokenUtil.getRemainingTime(jwtToken);
            jwtBlacklistService.blacklistToken(jwtToken, tokenExpiration);
            eventPublisher.publishEvent(new CustomLogoutSuccessEvent(this,jwtTokenUtil.getUserId(jwtToken)));
           return new ResponseDTO("Logged out successfully" , true);
        } else {
           return new ResponseDTO("Invalid token" , false);
        }
    }



    public ResponseDTO updateProfile(String authUserId, UpdateUserProfileRequestDTO updateUserProfileRequestDTO) throws IOException {
    User authUser = userRepository.findById(authUserId).orElseThrow(()-> new ResourceNotFoundException("User","id",authUserId));
    if(updateUserProfileRequestDTO.getProfilePicture()!=null) {
        if(!Objects.equals(authUser.getProfilePicture(), "")){
          String key =   awsService.extractKeyFromCloudFrontUrl(authUser.getProfilePicture());
          awsService.s3MediaDelete(key);
        }
        String folderName = "profile-picture";
        String mediaId =   awsService.s3MediaUploader(folderName,authUserId,updateUserProfileRequestDTO.getProfilePicture().getContentType(), updateUserProfileRequestDTO.getProfilePicture());
        String mediaUrl = cloudFrontDistribution+folderName+"/"+mediaId;
        authUser.setProfilePicture(mediaUrl);
    }
    authUser.setFirstName(updateUserProfileRequestDTO.getFirstName());
    authUser.setLastName(updateUserProfileRequestDTO.getLastName());
    authUser.setSelfDescription(updateUserProfileRequestDTO.getSelfDescription());

        List<SocialMediaHandle> socialMediaHandles;
        try {
            socialMediaHandles = objectMapper.readValue(updateUserProfileRequestDTO.getSocialMediaHandles(),
                    new TypeReference<List<SocialMediaHandle>>() {});
        } catch (JsonProcessingException e) {
            throw new GenericError("Invalid socialMediaHandles format");
        }
    authUser.setSocialMediaHandles(socialMediaHandles);
//    authUser.setSocialMediaHandles(updateUserProfileRequestDTO.getSocialMediaHandles());
    userRepository.save(authUser);

    return new ResponseDTO("User profile updated successfully" , true);

    }

    public ResponseDTO addPersonalProject(String authUserId , ProjectDetailsRequestStringifiedDTO projectDetailsRequestStringifiedDTO) throws IOException {
        User user = userRepository.findById(authUserId).orElseThrow(()-> new ResourceNotFoundException("User","id",authUserId));
        Work work = new Work();

        ProjectDetailsRequestDTO projectDetailsRequestDTO = new ProjectDetailsRequestDTO();
        projectDetailsRequestDTO.setDescription(projectDetailsRequestStringifiedDTO.getDescription());
        projectDetailsRequestDTO.setTitle(projectDetailsRequestStringifiedDTO.getTitle());

        try {
            List<ExternalLink> externalLinks = objectMapper.readValue(projectDetailsRequestStringifiedDTO.getExternalLinks(),
                    new TypeReference<List<ExternalLink>>() {});
            projectDetailsRequestDTO.setExternalLinks(externalLinks);
        } catch (JsonProcessingException e) {
            throw new GenericError("Invalid externalLinks format");
        }

        try {
            List<MediaFile> existingMediaFiles = objectMapper.readValue(projectDetailsRequestStringifiedDTO.getExistingMedia(),
                    new TypeReference<List<MediaFile>>() {});
            projectDetailsRequestDTO.setExistingMedia(existingMediaFiles);
        } catch (JsonProcessingException e) {
            throw new GenericError("Invalid existingMediaFiles format");
        }
        projectDetailsRequestDTO.setMediaFiles(projectDetailsRequestStringifiedDTO.getMediaFiles());


        work.setUser(user);
        work.setDescription(projectDetailsRequestDTO.getDescription());
        work.setTitle(projectDetailsRequestDTO.getTitle());
        work.setExternalLinks(projectDetailsRequestDTO.getExternalLinks());
        if(projectDetailsRequestDTO.getMediaFiles()!=null){
        List<MediaFile> mediaFiles = new ArrayList<>();
        for (MultipartFile file : projectDetailsRequestDTO.getMediaFiles()) {
            String folderName = "project-media-files";
            String contentType = file.getContentType();
            MediaType mediaType = (contentType != null && contentType.contains("image")) ? MediaType.IMAGE : MediaType.VIDEO;
            String mediaId = awsService.s3MediaUploader(folderName, authUserId, file.getContentType(), file);
            String mediaUrl = cloudFrontDistribution + folderName + "/" + mediaId;
            MediaFile mediaFile = new MediaFile(mediaUrl, mediaType);
            mediaFiles.add(mediaFile);
        }
        work.setMediaFiles(mediaFiles);
        }else{
            work.setMediaFiles(new ArrayList<>());
        }


    Work savedWork = workRepository.save(work);
    user.getMyProjects().add(savedWork);
    userRepository.save(user);

    return new ResponseDTO("Project added successfully" , true);

    }

    public ResponseDTO updatePersonalProject(String authUserId , Long workId , ProjectDetailsRequestStringifiedDTO projectDetailsRequestStringifiedDTO) throws IOException {
        User user = userRepository.findById(authUserId).orElseThrow(()-> new ResourceNotFoundException("User","id",authUserId));
        Work work = workRepository.findById(workId).orElseThrow(()-> new ResourceNotFoundException("Project","id",workId.toString()));
        if(!work.getUser().equals(user)){
            throw new GenericError("You are not allowed to update this project");
        }

        work.setTitle(projectDetailsRequestStringifiedDTO.getTitle());
        work.setDescription(projectDetailsRequestStringifiedDTO.getDescription());
        ProjectDetailsRequestDTO projectDetailsRequestDTO = new ProjectDetailsRequestDTO();

        try {
            List<ExternalLink> externalLinks = objectMapper.readValue(projectDetailsRequestStringifiedDTO.getExternalLinks(),
                    new TypeReference<List<ExternalLink>>() {});
            work.setExternalLinks(externalLinks);
        } catch (JsonProcessingException e) {
            throw new GenericError("Invalid externalLinks format");
        }

        try {
            List<MediaFile> existingMediaFiles = objectMapper.readValue(projectDetailsRequestStringifiedDTO.getExistingMedia(),
                    new TypeReference<List<MediaFile>>() {});
            projectDetailsRequestDTO.setExistingMedia(existingMediaFiles);
        } catch (JsonProcessingException e) {
            throw new GenericError("Invalid existingMediaFiles format");
        }

        work.setMediaFiles(projectDetailsRequestDTO.getExistingMedia());

        projectDetailsRequestDTO.setMediaFiles(projectDetailsRequestStringifiedDTO.getMediaFiles());


        // delete any removed media from aws
        for(MediaFile mediaFile : work.getMediaFiles()){
            boolean check = false;
            for(MediaFile existingMedia : projectDetailsRequestDTO.getExistingMedia()) {
                if (existingMedia.getUrl().equals(mediaFile.getUrl())) {
                    check = true;
                    break;
                }
            }
            if(!check){
                String mediaId = awsService.extractKeyFromCloudFrontUrl(mediaFile.getUrl());
                awsService.s3MediaDelete(mediaId);
            }
        }


        // Upload any new media files
        if(projectDetailsRequestDTO.getMediaFiles()!=null){
        List<MediaFile> newMediaFiles = new ArrayList<>();
        for (MultipartFile file : projectDetailsRequestDTO.getMediaFiles()) {
            String folderName = "project-media-files";
            String mediaId = awsService.s3MediaUploader(folderName, authUserId, file.getContentType(), file);
            String mediaUrl = cloudFrontDistribution + folderName + "/" + mediaId;
            MediaFile mediaFile = new MediaFile(mediaUrl , Objects.requireNonNull(file.getContentType()).contains("image") ? MediaType.IMAGE : MediaType.VIDEO);
            newMediaFiles.add(mediaFile);
        }
        work.getMediaFiles().addAll(newMediaFiles);
        }



       workRepository.save(work);

        return new ResponseDTO("Project updated successfully" , true);

    }

    public ResponseDTO deletePersonalProject(String authUserId , Long workId )throws IOException{
        User user = userRepository.findById(authUserId).orElseThrow(()-> new ResourceNotFoundException("User","id",authUserId));
        Work work = workRepository.findById(workId).orElseThrow(()-> new ResourceNotFoundException("Project","id",workId.toString()));
        user.getMyProjects().remove(work);
        work.getMediaFiles().forEach((media)->{
            String mediaId = awsService.extractKeyFromCloudFrontUrl(media.getUrl());
            awsService.s3MediaDelete(mediaId);
        });
        workRepository.delete(work);
        userRepository.save(user);
        return new ResponseDTO("Project deleted successfully" , true);
    }
}
