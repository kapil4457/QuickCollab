package com.quickcollab.controller;

import com.quickcollab.dtos.request.JobRequestDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.dtos.response.job.contentCreator.ContentCreatorJobResponseDTO;
import com.quickcollab.dtos.response.job.jobSeeker.JobSeekerJobResponseDTO;
import com.quickcollab.enums.UserRole;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.pojo.OfferDetail;
import com.quickcollab.service.JobService;
import com.quickcollab.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@Validated
public class JobController {

    private final JobService jobService;
    private final UserService userService;

    //     [Done]
    @GetMapping("/getUserListedJobs")
    public ResponseEntity<ContentCreatorJobResponseDTO> getUserListedJobs(Authentication authentication) {
        try{
        String userRole = authentication.getAuthorities().stream().findFirst().get().getAuthority();
        String userId = (String) authentication.getDetails();
        ContentCreatorJobResponseDTO contentCreatorJobResponseDTO = jobService.getUserListedJobs(userId,userRole);
        return ResponseEntity.status(HttpStatus.OK).body(contentCreatorJobResponseDTO);
        }catch (ResourceNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ContentCreatorJobResponseDTO(null,e.getMessage(),false));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ContentCreatorJobResponseDTO(null,e.getMessage(),false));
        }

    }

    //     [Done]
    @PostMapping("/createJob")
    public ResponseEntity<ContentCreatorJobResponseDTO>createJob(Authentication authentication, @RequestBody @Valid JobRequestDTO jobRequestDTO) {
        try{
            String userRole = authentication.getAuthorities().stream().findFirst().get().getAuthority();
            String userId = (String) authentication.getDetails();
            ContentCreatorJobResponseDTO contentCreatorJobResponseDTO = jobService.createNewJob(jobRequestDTO,userRole,userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(contentCreatorJobResponseDTO);

        }
        catch (ResourceNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ContentCreatorJobResponseDTO(null,e.getMessage(),false));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ContentCreatorJobResponseDTO(null,e.getMessage(),false));
        }
    }

    //  [Done]
    @PutMapping("/updateJob")
    public ResponseEntity<ContentCreatorJobResponseDTO>updateJobByJobId(Authentication authentication,
                                                                        @RequestBody JobRequestDTO jobRequestDTO,
                                                                        @RequestParam Long jobId) {
        try{
            String userRole = authentication.getAuthorities().stream().findFirst().get().getAuthority();
            String userId = (String) authentication.getDetails();
            ContentCreatorJobResponseDTO contentCreatorJobResponseDTO = jobService.updateJob(jobRequestDTO,jobId,userRole,userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(contentCreatorJobResponseDTO);

        }
        catch (ResourceNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ContentCreatorJobResponseDTO(null,e.getMessage(),false));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ContentCreatorJobResponseDTO(null,e.getMessage(),false));
        }
    }

    @GetMapping("/getAllJobs")
    public ResponseEntity<JobSeekerJobResponseDTO>getAllListedJobs(){
        JobSeekerJobResponseDTO jobSeekerJobResponseDTO = jobService.getAllJobs();
        return ResponseEntity.status(HttpStatus.OK).body(jobSeekerJobResponseDTO);

    }

    @PostMapping("/applyForJob")
    public ResponseEntity<ResponseDTO>applyToJob(Authentication authentication,@RequestParam Long jobId) {
        try{

        String userId = authentication.getDetails().toString();
        ResponseDTO responseDTO = jobService.applyToJob(userId , jobId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage(),false));
        }catch (ResourceNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(e.getMessage(),false));
        }

    }


    // this is for the content creator or manager
    @PutMapping("/sendOffer")
    public ResponseEntity<ResponseDTO>sendOffer(Authentication authentication, @Valid @RequestBody OfferDetail offerDetails) {
        try{
            String userRole = authentication.getAuthorities().stream().findFirst().get().getAuthority();
            String authUserId = (String) authentication.getDetails();
            ResponseDTO responseDTO = jobService.sendOffer(authUserId,offerDetails.getUserId(), offerDetails.getJobId(), userRole,offerDetails);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage(),false));
        }catch (ResourceNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(e.getMessage(),false));
        }
    }

    // This is for the job seeker
    @PutMapping("/updateOfferStatus")
    public ResponseEntity<ResponseDTO>updateOfferStatus(Authentication authentication , @RequestParam Long jobId , @RequestParam String offerStatus ) {
        try{
            String applicantId = (String) authentication.getDetails();
            ResponseDTO responseDTO = jobService.updateOfferStatus(applicantId,jobId , offerStatus);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
        }catch (GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage(),false));

        }
    }

    // this is for content creator or manager
    @PutMapping("/reviseOffer")
    public ResponseEntity<ResponseDTO> reviseOffer(Authentication authentication   , @RequestBody  OfferDetail offerDetails) {
        try{
            String authUserId = (String) authentication.getDetails();
            String userRole = authentication.getAuthorities().stream().findFirst().get().getAuthority();
            ResponseDTO responseDTO = jobService.reviseOffer(authUserId,userRole , offerDetails);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);

        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage(),false));
        }catch(ResourceNotFoundException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(ex.getMessage(),false));
        }
    }

    @PutMapping("/updateResignationStatus")
    public ResponseEntity<ResponseDTO> updateResignationStatus(Authentication authentication , @RequestBody Boolean status){
        try{
            String authUserId = (String) authentication.getDetails();
            ResponseDTO responseDTO = jobService.updateResignationStatus(authUserId , status);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);

        }catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(resourceNotFoundException.getMessage(),false));
        }
    }

    @PutMapping("/updateEmployeeSalary")
    public ResponseEntity<ResponseDTO> updateEmployeeSalary(Authentication authentication , @RequestBody Long salary , @RequestBody String employeeId , @RequestBody String userRole){
        try{
            String authUserId = (String) authentication.getDetails();
            ResponseDTO responseDTO = jobService.updateEmployeeSalary(salary , employeeId , authUserId , userRole);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage(),false));
        }
    }

    @PutMapping("/updateEmployeeRole")
    public ResponseEntity<ResponseDTO> updateEmployeeRole(Authentication authentication , @RequestBody String employeeId , @RequestBody String userRole){
        try{
            String authUserId = (String) authentication.getDetails();
            String authUserRole = (String) authentication.getAuthorities().stream().findFirst().get().getAuthority();
            ResponseDTO responseDTO = jobService.updateEmployeeRole(employeeId , authUserId , authUserRole ,  UserRole.valueOf(userRole));
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage(),false));
        }
    }

    @PutMapping("/joinCompany")
    public ResponseEntity<ResponseDTO> joinCompany(Authentication authentication , @RequestParam Long jobId){
        try{

            String authUserId = (String) authentication.getDetails();
            ResponseDTO responseDTO = jobService.joinCompany(authUserId , jobId);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
        }catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(resourceNotFoundException.getMessage(),false));
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage(),false));
        }
    }







}
