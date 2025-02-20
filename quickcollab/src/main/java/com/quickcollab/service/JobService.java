package com.quickcollab.service;

import com.quickcollab.dtos.request.JobRequestDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.dtos.response.job.contentCreator.ContentCreatorJobDetailDTO;
import com.quickcollab.dtos.response.job.contentCreator.ContentCreatorJobResponseDTO;
import com.quickcollab.dtos.response.job.jobSeeker.JobDetailPostedByUserDTO;
import com.quickcollab.dtos.response.job.jobSeeker.JobSeekerJobDetailDTO;
import com.quickcollab.dtos.response.job.jobSeeker.JobSeekerJobResponseDTO;
import com.quickcollab.dtos.response.user.ReportingUser;
import com.quickcollab.dtos.response.user.UpdatedByUser;
import com.quickcollab.enums.JobStatus;
import com.quickcollab.enums.OfferStatus;
import com.quickcollab.enums.UserRole;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.model.Job;
import com.quickcollab.model.User;
import com.quickcollab.pojo.OfferDetail;
import com.quickcollab.repository.JobRepository;
import com.quickcollab.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class JobService {
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
            String contentCreatorUserId = Objects.equals(userRole, "ROLE_"+UserRole.CONTENT_CREATOR.toString()) ? authUserId : userRepository.getReportingUserByUserId(authUserId);
            User user = userRepository.getReferenceById(contentCreatorUserId);
            Job job = modelMapper.map(jobRequestDTO, Job.class);
            job.setPostedBy(user);
            job.setPostedOn(new Date());
            job.setUpdatedBy(user);
            job.setUpdatedOn(new Date());
            Job savedJob = jobRepository.save(job);
            user.getJobsPosted().add(savedJob);
            userRepository.save(user);
            List<Job> userListedJobs= jobRepository.getJobByPostedByUserId(user.getUserId());
            List<ContentCreatorJobDetailDTO> contentCreatorJobDetailDTOList = userListedJobs.stream().map(userListedJob -> {
                ContentCreatorJobDetailDTO contentCreatorJobDetailDTO  = modelMapper.map(userListedJob , ContentCreatorJobDetailDTO.class);
                UpdatedByUser updatedByUser = new UpdatedByUser();
                updatedByUser.setFirstName(user.getFirstName());
                updatedByUser.setLastName(user.getLastName());
                updatedByUser.setUserId(user.getUserId());
                contentCreatorJobDetailDTO.setUpdatedBy(updatedByUser);
                return contentCreatorJobDetailDTO;
            }).toList();
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
            List<ContentCreatorJobDetailDTO> contentCreatorJobDetailDTOList = userListedJobs.stream().map(userListedJob ->  {
                    ContentCreatorJobDetailDTO contentCreatorJobDetailDTO  = modelMapper.map(userListedJob , ContentCreatorJobDetailDTO.class);
                    UpdatedByUser updatedByUser = new UpdatedByUser();
                    updatedByUser.setFirstName(jobUpdator.getFirstName());
                    updatedByUser.setLastName(jobUpdator.getLastName());
                    updatedByUser.setUserId(jobUpdator.getUserId());
                    contentCreatorJobDetailDTO.setUpdatedBy(updatedByUser);
                    return contentCreatorJobDetailDTO;
                }).toList();
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
        return new JobSeekerJobResponseDTO(jobSeekerJobDetailDTOs,"Job fetched successfully !",true);

    }

    public ResponseDTO applyToJob(String userId, Long jobId) {
        User user = userRepository.getReferenceById(userId);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "jobId", jobId.toString()));
        if(job.getApplicants().contains(user) ){
            throw new GenericError("You  already applied to this job.");
        }
        if(job.getOfferedTo().stream().map(OfferDetail::getUserId).toList().contains(userId)){
            throw new GenericError("You already received an offer wrt this job.");
        }

        job.getApplicants().add(user);
        user.getAppliedJobs().add(job);
        jobRepository.save(job);
        userRepository.save(user);
        return  new ResponseDTO("Application sent successfully!!",true);
    }

    public ResponseDTO sendOffer(String authUserId , String applicantUserId, Long jobId , String userRole ,  OfferDetail offerDetail) {
        String contentCreatorId = Objects.equals(userRole, "ROLE_"+UserRole.CONTENT_CREATOR.toString()) ? authUserId : userRepository.getReportingUserByUserId(authUserId);
        User applicant = userRepository.findById(applicantUserId).orElseThrow(()->new ResourceNotFoundException("Applicant","applicantUserId",applicantUserId.toString()));
        Job job = jobRepository.findById(jobId).orElseThrow(()->new ResourceNotFoundException("Job", "jobId", jobId.toString()));

        if(!job.getPostedBy().getUserId().equals(contentCreatorId)){
            throw new GenericError("You are not allowed to perform this operation.");
        }
        if(!job.getApplicants().contains(applicant)) {
                throw new GenericError("User "+applicant.getFirstName()+" "+applicant.getLastName()+" have not applied to this job.");
        }
        ReportingUser reportingUser = applicant.getReportsTo();
        if(reportingUser!=null && reportingUser.getUserId().equals(contentCreatorId)) {
            throw new GenericError("User "+applicant.getFirstName()+" "+applicant.getLastName()+" already reports to you.");
        }

        applicant.getOffersReceived().add(offerDetail);
        job.getOfferedTo().add(offerDetail);
        userRepository.save(applicant);
        jobRepository.save(job);

        return new ResponseDTO("Offer sent successfully!!",true);

    }

    public ResponseDTO updateOfferStatus(String applicantId,Long jobId ,String offerStatus){
        User applicant = userRepository.getReferenceById(applicantId);
        Job job = jobRepository.getReferenceById(jobId);

        User contentCreator = job.getPostedBy();
        OfferDetail offerDetail = applicant.getOffersReceived().stream().filter(offer->offer.jobId.equals(job.getJobId())).toList().getFirst();
        String contentCreatorId = contentCreator.getUserId();

        if(!job.getApplicants().contains(applicant)){
            throw new GenericError("You are not allowed to perform this operation.");
        }

        if(offerDetail.getOfferStatus().equals(OfferStatus.ACCEPTED) || offerDetail.getOfferStatus().equals(OfferStatus.DECLINED) ){
        throw new GenericError("Can not update the offer status as you have already "+offerDetail.offerStatus.toString().toLowerCase()+" this offer");
        }
        if(offerDetail.getValidTill().before(new Date())){
            job.getOfferedTo().stream().filter(offer -> offer.getUserId().equals(applicantId)).forEach(offer->offer.setOfferStatus(OfferStatus.EXPIRED));
            applicant.getOffersReceived().stream().filter(offer -> offer.getUserId().equals(applicantId)).forEach(offer->offer.setOfferStatus(OfferStatus.EXPIRED));
            userRepository.save(applicant);
            jobRepository.save(job);
            throw new GenericError("Offer expired already !!");
        }

        // update the offer status in job details
        job.getOfferedTo().stream().filter(offer -> offer.getUserId().equals(applicantId)).forEach(offer->offer.setOfferStatus(OfferStatus.valueOf(offerStatus)));


        // Updating the offers status in applicant details
        applicant.getOffersReceived().stream().filter(offer -> offer.getUserId().equals(applicantId)).forEach(offer->offer.setOfferStatus(OfferStatus.valueOf(offerStatus)));

        if(offerStatus.equals(OfferStatus.ACCEPTED.toString())){

         // Update the openings counts and remove the applicant from the applicant list of the job
        Long openingCount = job.getOpeningsCount()-1;
        job.setOpeningsCount(openingCount);
        job.getApplicants().remove(applicant);

        // Update the reporting user for the applicant
        ReportingUser reportingUser = new ReportingUser();
        reportingUser.setUserId(contentCreatorId);
        reportingUser.setFirstName(contentCreator.getFirstName());
        reportingUser.setLastName(contentCreator.getLastName());
        applicant.setReportsTo(reportingUser);

        // Update the userRole for the applicant
        applicant.setUserRole(UserRole.valueOf(String.valueOf(offerDetail.getUserRole())));

        // Add the applicant to the list of employees for the contentCreator
        contentCreator.getEmployees().add(applicant);

        }

        userRepository.save(applicant);
        jobRepository.save(job);
        userRepository.save(contentCreator);

        return new ResponseDTO("Offer updated successfully!!",true);


    }

    public ResponseDTO reviseOffer(String authUserId,String userRole, OfferDetail offerDetail) {
        String contentCreatorUserId = Objects.equals(userRole, "ROLE_"+UserRole.CONTENT_CREATOR.toString()) ? authUserId : userRepository.getReportingUserByUserId(authUserId);
        User contentCreator = userRepository.getReferenceById(contentCreatorUserId);
        Long jobId = offerDetail.getJobId();
        Job job = jobRepository.getReferenceById(jobId);
        User applicant = userRepository.getReferenceById(offerDetail.getUserId());


        if(!job.getPostedBy().equals(contentCreator)) {
            throw new GenericError("You are not allowed to perform this operation");
        }

        OfferDetail currentOfferDetail = applicant.getOffersReceived().stream().filter(offer -> offer.jobId.equals(job.getJobId())).toList().getFirst();
        if(currentOfferDetail.getOfferStatus().equals(OfferStatus.ACCEPTED)){
            throw new GenericError("Applicant has already accepted the offer !");
        }

        applicant.getOffersReceived().stream().filter(offer -> offer.jobId.equals(job.getJobId())).toList().forEach(offer-> {
                    offer.setOfferedOn(new Date());
                    offer.setJobTitle(offerDetail.getJobTitle());
                    offer.setSalary(offerDetail.getSalary());
                    offer.setUserRole(UserRole.valueOf(userRole));
                    offer.setOfferStatus(offerDetail.getOfferStatus());
                    offer.setValidTill(offerDetail.getValidTill());
                    offer.setSalary(offerDetail.getSalary());
                    offer.setOfferedOn(offerDetail.getOfferedOn());
                }
            );

         job.getOfferedTo().stream().filter(offer -> offer.jobId.equals(job.getJobId())).toList().forEach(offer-> {
                        offer.setOfferedOn(new Date());
                        offer.setJobTitle(offerDetail.getJobTitle());
                        offer.setSalary(offerDetail.getSalary());
                        offer.setUserRole(UserRole.valueOf(userRole));
                        offer.setOfferStatus(offerDetail.getOfferStatus());
                        offer.setValidTill(offerDetail.getValidTill());
                        offer.setSalary(offerDetail.getSalary());
                        offer.setOfferedOn(offerDetail.getOfferedOn());
                    }
                );


         userRepository.save(applicant);
         jobRepository.save(job);

         return new ResponseDTO("Offer updated successfully!!",true);


    }


}
