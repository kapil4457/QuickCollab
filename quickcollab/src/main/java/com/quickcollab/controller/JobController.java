package com.quickcollab.controller;

import com.quickcollab.dtos.request.JobRequestDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.dtos.response.job.contentCreator.ContentCreatorJobResponseDTO;
import com.quickcollab.dtos.response.job.jobSeeker.JobSeekerJobResponseDTO;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.service.JobService;
import com.quickcollab.service.UserService;
import lombok.AllArgsConstructor;
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

    @PostMapping("/createJob")
    public ResponseEntity<ContentCreatorJobResponseDTO>createJob(Authentication authentication, @RequestBody JobRequestDTO jobRequestDTO) {
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
    public ResponseEntity<ResponseDTO>applyToJob(Authentication authentication,@RequestParam String jobId) {
        String userId = authentication.getDetails().toString();
        ResponseDTO responseDTO = jobService.applyToJob(userId , jobId);
        return ResponseEntity.status(HttpStatus.OK).body(responseDTO);

    }

}
