package com.quickcollab.service;

import com.quickcollab.dtos.request.UserRegisterDTO;
import com.quickcollab.dtos.response.conversation.ConversationUser;
import com.quickcollab.dtos.response.conversation.UserConversationDetail;
import com.quickcollab.dtos.response.job.contentCreator.ContentCreatorJobPost;
import com.quickcollab.dtos.response.job.jobSeeker.JobSeekerJobApplication;
import com.quickcollab.dtos.response.user.*;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.enums.UserRole;
import com.quickcollab.events.CustomAuthenticationSuccessEvent;
import com.quickcollab.events.CustomLogoutSuccessEvent;
import com.quickcollab.exception.ResourceAlreadyExistsException;
import com.quickcollab.model.Conversation;
import com.quickcollab.model.Job;
import com.quickcollab.model.User;
import com.quickcollab.repository.JobRepository;
import com.quickcollab.repository.UserRepository;
import com.quickcollab.utils.JwtBlacklistService;
import com.quickcollab.utils.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.authentication.event.LogoutSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final JwtBlacklistService jwtBlacklistService;
    private final JobRepository jobRepository;
    private final ApplicationEventPublisher eventPublisher;



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

//    @Transactional
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
                    return appliedJob;
                }).toList();
                jobSeekerUserDetails.setAppliedJobs(appliedJobs);
                LoginResponseDTO<JobSeekerUserDetails> loginResponseDTO = new LoginResponseDTO<>();
                loginResponseDTO.setUser(jobSeekerUserDetails);
                loginResponseDTO.setSuccess(true);
                loginResponseDTO.setMessage("User details fetched successfully");
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
                    return appliedJob;
                }).toList();
                teamMemberUserDetails.setAppliedJobs(appliedJobs);
                LoginResponseDTO<TeamMemberUserDetails> loginResponseDTO = new LoginResponseDTO<>();
                loginResponseDTO.setUser(teamMemberUserDetails);
                loginResponseDTO.setSuccess(true);
                loginResponseDTO.setMessage("User details fetched successfully");
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
}
