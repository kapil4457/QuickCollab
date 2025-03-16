package com.quickcollab.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.config.AWSConfig;
import com.quickcollab.dtos.request.UpdateUserProfileRequestDTO;
import com.quickcollab.dtos.request.UserRegisterDTO;
import com.quickcollab.dtos.response.job.contentCreator.ContentCreatorJobPost;
import com.quickcollab.dtos.response.job.jobSeeker.JobSeekerJobApplication;
import com.quickcollab.dtos.response.user.*;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.enums.UserRole;
import com.quickcollab.events.CustomAuthenticationSuccessEvent;
import com.quickcollab.events.CustomLogoutSuccessEvent;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceAlreadyExistsException;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.model.Job;
import com.quickcollab.model.User;
import com.quickcollab.pojo.OfferDetail;
import com.quickcollab.pojo.SocialMediaHandle;
import com.quickcollab.repository.UserRepository;
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


import java.io.IOException;
import java.util.*;

@Service
public class UserService {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final JwtBlacklistService jwtBlacklistService;
    private final ApplicationEventPublisher eventPublisher;
    private final ObjectMapper objectMapper;
    private final AWSService awsService;

    public UserService(ModelMapper modelMapper, UserRepository userRepository, JwtTokenUtil jwtTokenUtil, AWSService awsService, ObjectMapper objectMapper, ApplicationEventPublisher eventPublisher, JwtBlacklistService jwtBlacklistService) {
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.awsService = awsService;
        this.objectMapper = objectMapper;
        this.eventPublisher = eventPublisher;
        this.jwtBlacklistService = jwtBlacklistService;
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
            String userRole = optionalUser.get().getUserRole().toString();
            if(userRole.equals(UserRole.CONTENT_CREATOR.toString())){
                ContentCreatorUserDetails contentCreatorUserDetails = modelMapper.map(user, ContentCreatorUserDetails.class);
                List<ContentCreatorEmployee> employees = user.getEmployees().stream().map(employee -> modelMapper.map(employee , ContentCreatorEmployee.class)).toList();
                List<Job> postedJobs = user.getJobsPosted();
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
                jobSeekerUserDetails.setAppliedJobs(appliedJobs);
                LoginResponseDTO<JobSeekerUserDetails> loginResponseDTO = new LoginResponseDTO<>();
                loginResponseDTO.setUser(jobSeekerUserDetails);
                loginResponseDTO.setSuccess(true);
                loginResponseDTO.setMessage("User details fetched successfully");
                eventPublisher.publishEvent(new CustomAuthenticationSuccessEvent(this,jobSeekerUserDetails.getUserId()));
                return (LoginResponseDTO<JobSeekerUserDetails>) loginResponseDTO;

            }else{
                TeamMemberUserDetails teamMemberUserDetails = modelMapper.map(user, TeamMemberUserDetails.class);
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



    public ResponseDTO updateProfile(String authUserId, @Valid UpdateUserProfileRequestDTO updateUserProfileRequestDTO) throws IOException {
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
}
