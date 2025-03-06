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
import com.quickcollab.pojo.JobHistory;
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

    public JobSeekerJobResponseDTO getAllJobs(String userId){
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User","id",userId));
        List<Job> allJobs = jobRepository.findAll().stream().filter(job->!user.getAppliedJobs().contains(job)).toList();
        List<JobSeekerJobDetailDTO> jobSeekerJobDetailDTOs = allJobs.stream().map(job -> {
            JobSeekerJobDetailDTO jobSeekerJobDetailDTO =  modelMapper.map(job , JobSeekerJobDetailDTO.class);
            JobDetailPostedByUserDTO jobDetailPostedByUserDTO = modelMapper.map(job.getPostedBy() , JobDetailPostedByUserDTO.class);
            jobSeekerJobDetailDTO.setPostedBy(jobDetailPostedByUserDTO);
            return jobSeekerJobDetailDTO;
        }).toList();
        return new JobSeekerJobResponseDTO(jobSeekerJobDetailDTOs,"Job fetched successfully !",true);

    }

    public ResponseDTO applyToJob(String userId, Long jobId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
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
        if(!applicant.getOffersReceived().stream().filter(offersRecieved -> offersRecieved.getJobId().equals(jobId)).toList().isEmpty()){
            throw new GenericError("You have already sent an offer to "+applicant.getFirstName()+" "+applicant.getLastName()+" for this job. Try updating it");
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

        if(job.getJobStatus().equals(JobStatus.FILLED)){
            throw new GenericError("Job openings filled already.");
        }
        if(job.getJobStatus().equals(JobStatus.INACTIVE)){
            throw new GenericError("Job is currently inactive.");
        }
        if(job.getJobStatus().equals(JobStatus.EXPIRED)){
                throw new GenericError("Job expired already.");
        }
        User contentCreator = job.getPostedBy();
        OfferDetail offerDetail = applicant.getOffersReceived().stream().filter(offer->offer.jobId.equals(job.getJobId())).toList().getFirst();

        if(!job.getApplicants().contains(applicant)){
            throw new GenericError("You are not allowed to perform this operation.");
        }

        if(offerDetail.getOfferStatus().equals(OfferStatus.ACCEPTED)){
            throw new GenericError("Can not update the offer status as you have already "+offerDetail.offerStatus.toString().toLowerCase()+" this offer");
        }

        if(offerDetail.getValidTill().before(new Date())){
            job.getOfferedTo().stream().filter(offer -> offer.getUserId().equals(applicantId)).forEach(offer->offer.setOfferStatus(OfferStatus.EXPIRED));
            applicant.getOffersReceived().stream().filter(offer -> offer.getUserId().equals(applicantId)).forEach(offer->offer.setOfferStatus(OfferStatus.EXPIRED));
            userRepository.save(applicant);
            jobRepository.save(job);
            throw new GenericError("Offer expired already !!");
        }
        if(offerStatus.equals(OfferStatus.ACCEPTED.toString())){
            // check if the user is serving notice period
            if(!applicant.getIsServingNoticePeriod() && applicant.getReportsTo()!=null){
                Long noticePeriodLength = applicant.getCurrentJobNoticePeriodDays();
                applicant.setIsServingNoticePeriod(true);
                applicant.setNoticePeriodEndDate(new Date(new Date().getTime() + (noticePeriodLength * 24L * 60 * 60 * 100)));
            }

            // check if the user has accepted any other offer

            if(!applicant.getOffersReceived().stream().filter(offer -> {
                return offer.getOfferStatus().equals(OfferStatus.ACCEPTED);
            }).toList().isEmpty()){
                throw new GenericError("You have already accepted another offer. So you  can not accept this offer.");
            }

            applicant.getOffersReceived().forEach(offer -> {
                if(!offer.getJobId().equals(job.getJobId())){
                        offer.setOfferStatus(OfferStatus.DECLINED);
                }
            } );

            // Update openingsCount

            Long openingCount = job.getOpeningsCount()-1;
            job.setOpeningsCount(openingCount);
            job.getApplicants().remove(applicant);

            if (openingCount == 0) {
            job.setJobStatus(JobStatus.FILLED);
            }

        }
        if(offerDetail.getOfferStatus().equals(OfferStatus.DECLINED)){
            job.setOpeningsCount(job.getOpeningsCount()+1);
        }

        // update the offer status in job details
        job.getOfferedTo().stream().filter(offer -> offer.getUserId().equals(applicantId)).forEach(offer->offer.setOfferStatus(OfferStatus.valueOf(offerStatus)));


        // Updating the offers status in applicant details
        applicant.getOffersReceived().stream().filter(offer -> offer.getUserId().equals(applicantId)).forEach(offer->offer.setOfferStatus(OfferStatus.valueOf(offerStatus)));



        userRepository.save(applicant);
        jobRepository.save(job);
        userRepository.save(contentCreator);

        return new ResponseDTO("Offer updated successfully!!",true);


    }

    public ResponseDTO reviseOffer(String authUserId,String userRole, OfferDetail offerDetail) {
        String contentCreatorUserId = Objects.equals(userRole, "ROLE_"+UserRole.CONTENT_CREATOR.toString()) ? authUserId : userRepository.getReportingUserByUserId(authUserId);
        User contentCreator = userRepository.getReferenceById(contentCreatorUserId);
        Long jobId = offerDetail.getJobId();
        Job job = jobRepository.findById(jobId).orElseThrow(()-> new ResourceNotFoundException("Job","jobId",offerDetail.getJobId().toString()));
        User applicant = userRepository.findById(offerDetail.getUserId()).orElseThrow(()-> new ResourceNotFoundException("Applicant","applicantId",offerDetail.getUserId()));


        if(!job.getPostedBy().equals(contentCreator)) {
            throw new GenericError("You are not allowed to perform this operation");
        }

        OfferDetail currentOfferDetail = applicant.getOffersReceived().stream().filter(offer -> offer.jobId.equals(job.getJobId())).toList().getFirst();
        if(currentOfferDetail.getOfferStatus().equals(OfferStatus.ACCEPTED)){
            throw new GenericError("Applicant has already accepted the offer !");
        }
        List<OfferDetail> updatedOfferDetails = applicant.getOffersReceived().stream().peek(offer ->{
            if (offer.jobId.equals(job.getJobId())){
                offer.setOfferedOn(offerDetail.getOfferedOn());
                offer.setJobTitle(offerDetail.getJobTitle());
                offer.setSalary(offerDetail.getSalary());
                offer.setUserRole(offerDetail.getUserRole());
                offer.setOfferStatus(offerDetail.getOfferStatus());
                offer.setValidTill(offerDetail.getValidTill());
                offer.setSalary(offerDetail.getSalary());
                offer.setOfferedOn(offerDetail.getOfferedOn());
            }
                }
            ).toList();


        applicant.setOffersReceived(updatedOfferDetails);
        List<OfferDetail> jobOfferedTo =  job.getOfferedTo().stream().peek(offer ->
                {
                    if(offer.jobId.equals(job.getJobId()) && offer.getUserId().equals(applicant.getUserId()) ){
                        offer.setOfferedOn(offerDetail.getOfferedOn());
                        offer.setJobTitle(offerDetail.getJobTitle());
                        offer.setSalary(offerDetail.getSalary());
                        offer.setUserRole(offerDetail.getUserRole());
                        offer.setOfferStatus(offerDetail.getOfferStatus());
                        offer.setValidTill(offerDetail.getValidTill());
                        offer.setSalary(offerDetail.getSalary());
                        offer.setOfferedOn(offerDetail.getOfferedOn());
                    }
                }
                ).toList();
        job.setOfferedTo(jobOfferedTo);


         userRepository.save(applicant);
         jobRepository.save(job);

         return new ResponseDTO("Offer updated successfully!!",true);


    }

    public ResponseDTO updateResignationStatus(String authUserId,Boolean status){
    User employee = userRepository.findById(authUserId).orElseThrow(()-> new ResourceNotFoundException("User","userId",authUserId));
    employee.setIsServingNoticePeriod(status);
    Long noticePeriodLength = employee.getCurrentJobNoticePeriodDays();
    if(status){
        employee.setNoticePeriodEndDate(new Date(new Date().getTime() + (noticePeriodLength * 24L * 60 * 60 * 1000)));
    }else{
        employee.setNoticePeriodEndDate(null);
    }
    userRepository.save(employee);
    return new ResponseDTO(status ? "Resignation submitted successfully !!": "Resignation withdrawn successfull!",true);
    }

    public ResponseDTO updateEmployeeSalary(Long newSalary , String employeeId , String authUserId  , String authUserRole){
        String contentCreatorId = Objects.equals(authUserRole, "ROLE_"+UserRole.CONTENT_CREATOR.toString()) ? authUserId : userRepository.getReportingUserByUserId(authUserId);
        User employee = userRepository.findById(employeeId).orElseThrow(()-> new ResourceNotFoundException("User","employeeId",employeeId));
        if(employee.getReportsTo()==null || !employee.getReportsTo().getUserId().equals(contentCreatorId)){
            throw new GenericError("You are not allowed to perform this operation");
        }
        employee.setCurrentSalary(newSalary);
        userRepository.save(employee);
        return new ResponseDTO("Employee salary updated successfully!!",true);
    }

    public ResponseDTO updateEmployeeRole( String employeeId , String authUserId  , String userRole , UserRole newUserRole){
        String contentCreatorId = Objects.equals(userRole, "ROLE_"+UserRole.CONTENT_CREATOR.toString()) ? authUserId : userRepository.getReportingUserByUserId(authUserId);
        User employee = userRepository.findById(employeeId).orElseThrow(()-> new ResourceNotFoundException("User","employeeId",employeeId));
        if(employee.getReportsTo()==null || !employee.getReportsTo().getUserId().equals(contentCreatorId)){
            throw new GenericError("You are not allowed to perform this operation");
        }
        employee.setUserRole(newUserRole);
        userRepository.save(employee);
        return new ResponseDTO("Employee role updated successfully!!",true);
    }

    public ResponseDTO joinCompany(String authUserId , Long jobId){

            User applicant = userRepository.findById(authUserId).orElseThrow(()-> new ResourceNotFoundException("Applicant","applicantId",authUserId));
            Job job = jobRepository.findById(jobId).orElseThrow(()-> new ResourceNotFoundException("Job","jobId",jobId.toString()));
            String contentCreatorId = job.getPostedBy().getUserId();
            User contentCreator = userRepository.findById(contentCreatorId).orElseThrow(()-> new ResourceNotFoundException("Content creator","userId", contentCreatorId));
            if(job.getOfferedTo().stream().filter(offer-> offer.userId.equals(authUserId)).toList().isEmpty()){
                throw new GenericError("You never received an offer for this job.");
            }
            List<OfferDetail> offeredTo = job.getOfferedTo().stream().filter(offer -> offer.userId.equals(applicant.getUserId()) && offer.offerStatus.equals(OfferStatus.ACCEPTED)).toList();
            if(offeredTo.isEmpty()){
                throw new GenericError("You never accepted the offer or the offer had been revoked.");
            }

            if(!applicant.getIsServingNoticePeriod()){
                if(applicant.getReportsTo()!=null){
                    throw new GenericError("You need to resign from the current job to join this one.");
                }
            }else{
                if(applicant.getNoticePeriodEndDate().after( new Date())){
                    throw new GenericError("You can not join this job before the notice period of the current job ends");

                }
            }
            //  PENDING : clear older conversations from older teams.



            //  Add current Job to the JobHistory of the applicant
            OfferDetail offerDetail = applicant.getOffersReceived().stream().filter(offer -> offer.getJobId().equals(jobId)).findFirst().get();
            JobHistory currentJobDetails = applicant.getCurrentJobDetails();

            if(currentJobDetails!=null){
               currentJobDetails.setUserRole(applicant.getUserRole());
                applicant.getJobHistory().add(currentJobDetails);
            }
            JobHistory newJobDetails = new JobHistory();
            newJobDetails.setTitle(offerDetail.getJobTitle());
            newJobDetails.setJobId(jobId);
            newJobDetails.setSalary(offerDetail.getSalary());
            newJobDetails.setLocation(job.getJobLocation());
            newJobDetails.setDescription(job.getJobDescription());
            newJobDetails.setLocationType(job.getJobLocationType());
            newJobDetails.setStartDate(new Date());
            applicant.setCurrentJobDetails(newJobDetails);


            applicant.setUserRole(UserRole.valueOf(String.valueOf(offerDetail.getUserRole())));
            applicant.setCurrentJobNoticePeriodDays(job.getNoticePeriodDays());

            // Add the applicant to the list of employees for the contentCreator
            contentCreator.getEmployees().add(applicant);

            // change the reporting user
            ReportingUser reportingUser = new ReportingUser();
            reportingUser.setUserId(contentCreator.getUserId());
            reportingUser.setFirstName(contentCreator.getFirstName());
            reportingUser.setLastName(contentCreator.getLastName());
            applicant.setReportsTo(reportingUser);


            userRepository.save(applicant);
            userRepository.save(contentCreator);
            return new ResponseDTO("Joined "+contentCreator.getFirstName()+" "+contentCreator.getLastName()+"'s team as "+ offerDetail.getUserRole(),true);
    }
}
