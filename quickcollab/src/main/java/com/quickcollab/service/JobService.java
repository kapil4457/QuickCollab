package com.quickcollab.service;

import com.quickcollab.dtos.request.JobRequestDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.dtos.response.job.contentCreator.ContentCreatorJobDetailDTO;
import com.quickcollab.dtos.response.job.contentCreator.ContentCreatorJobResponseDTO;
import com.quickcollab.dtos.response.job.jobSeeker.JobDetailPostedByUserDTO;
import com.quickcollab.dtos.response.job.jobSeeker.JobSeekerJobDetailDTO;
import com.quickcollab.dtos.response.job.jobSeeker.JobSeekerJobResponseDTO;
import com.quickcollab.enums.JobStatus;
import com.quickcollab.enums.UserRole;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.model.Job;
import com.quickcollab.model.User;
import com.quickcollab.repository.JobRepository;
import com.quickcollab.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@AllArgsConstructor
public class JobService {
    private final UserService userService;
    private final JobRepository jobRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    public ContentCreatorJobResponseDTO getUserListedJobs(String authUserId, String userRole) {
               // get all listed jobs and return
                String userId = Objects.equals(userRole, "ROLE_"+UserRole.CONTENT_CREATOR.toString()) ? authUserId : userRepository.getReportingUserByUserId(authUserId);
                List<Job> userListedJobs= jobRepository.getJobByPostedByUserId(userId);
                List<ContentCreatorJobDetailDTO> contentCreatorJobDetailDTOList = userListedJobs.stream().map(userListedJob -> modelMapper.map(userListedJob , ContentCreatorJobDetailDTO.class)).toList();
                return new ContentCreatorJobResponseDTO(contentCreatorJobDetailDTOList,"Job List fetched successfully",true);
    }

    public ContentCreatorJobResponseDTO createNewJob(JobRequestDTO jobRequestDTO, String userRole, String authUserId) {
            String userId = Objects.equals(userRole, "ROLE_"+UserRole.CONTENT_CREATOR.toString()) ? authUserId : userRepository.getReportingUserByUserId(authUserId);
            User user = userRepository.getReferenceById(userId);
            Job job = modelMapper.map(jobRequestDTO, Job.class);
            job.setPostedBy(user);
            job.setPostedOn(new Date());
            job.setUpdatedBy(user);
            job.setUpdatedOn(new Date());
            jobRepository.save(job);
            List<Job> userListedJobs= jobRepository.getJobByPostedByUserId(user.getUserId());
            List<ContentCreatorJobDetailDTO> contentCreatorJobDetailDTOList = userListedJobs.stream().map(userListedJob -> modelMapper.map(userListedJob , ContentCreatorJobDetailDTO.class)).toList();
            return new ContentCreatorJobResponseDTO(contentCreatorJobDetailDTOList,"Job created successfully !!",true);

        }

    public ContentCreatorJobResponseDTO updateJob(JobRequestDTO jobRequestDTO, Long jobId, String userRole, String authUserId) {
        Optional<Job>optionalJob = jobRepository.findById(jobId);
            if(optionalJob.isPresent()) {
            String userId = Objects.equals(userRole, "ROLE_"+UserRole.CONTENT_CREATOR.toString()) ? authUserId : userRepository.getReportingUserByUserId(authUserId);
            Job currentJob = optionalJob.get();
            modelMapper.map(jobRequestDTO, currentJob);
            User jobUpdator = userRepository.getReferenceById(authUserId);
            if(userId.equals(authUserId) || jobUpdator.getReportsTo().getUserId().equals(userId)){

            currentJob.setUpdatedBy(jobUpdator);
            currentJob.setUpdatedOn(new Date());
            jobRepository.save(currentJob);
            List<Job> userListedJobs= jobRepository.getJobByPostedByUserId(userId);
            List<ContentCreatorJobDetailDTO> contentCreatorJobDetailDTOList = userListedJobs.stream().map(userListedJob -> modelMapper.map(userListedJob , ContentCreatorJobDetailDTO.class)).toList();
            return new ContentCreatorJobResponseDTO(contentCreatorJobDetailDTOList,"Job updated successfully !!",true);
            }else{
                throw new GenericError("You do not have the required permissions to update this Job");
            }
            }else{
                throw new ResourceNotFoundException("Job","jobId",jobId.toString());
            }

        }

    public JobSeekerJobResponseDTO getAllJobs(){
        List<Job> allJobs = jobRepository.getJobByJobStatus(JobStatus.ACTIVE);
        List<JobSeekerJobDetailDTO> jobSeekerJobDetailDTOs = allJobs.stream().map(job -> {
            JobSeekerJobDetailDTO jobSeekerJobDetailDTO =  modelMapper.map(job , JobSeekerJobDetailDTO.class);
            JobDetailPostedByUserDTO jobDetailPostedByUserDTO = modelMapper.map(job.getPostedBy() , JobDetailPostedByUserDTO.class);
            jobSeekerJobDetailDTO.setPostedBy(jobDetailPostedByUserDTO);
            return jobSeekerJobDetailDTO;
        }).toList();
        return new JobSeekerJobResponseDTO(jobSeekerJobDetailDTOs,"Job updated successfully !!",true);

    }

    public ResponseDTO applyToJob(String userId, Long jobId) {
        User user = userRepository.getReferenceById(userId);
        Job job = jobRepository.getReferenceById(jobId);
        if(job.getApplicants().contains(user)) {
            throw new GenericError("You have already applied for this Job");
        }
        job.getApplicants().add(user);
        user.getAppliedJobs().add(job);
        jobRepository.save(job);
        userRepository.save(user);
        return  new ResponseDTO("Application sent successfully!!",true);
    }


}
