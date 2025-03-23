package com.quickcollab.controller;

import com.quickcollab.dtos.request.UploadRequestDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.service.UploadRequestService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@AllArgsConstructor
public class UploadRequestController {

    private final UploadRequestService uploadRequestService;

    @PostMapping(value="/api/createUploadRequest",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDTO> createUploadRequest(Authentication authentication , @ModelAttribute UploadRequestDTO uploadRequestDTO){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO response = uploadRequestService.createUploadRequest(authUserId,uploadRequestDTO);
            return ResponseEntity.status(201).body(response);

        }catch (GenericError genericError){
            return ResponseEntity.status(400).body(new ResponseDTO(genericError.getMessage(),false));
        }catch (ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(404).body(new ResponseDTO(resourceNotFoundException.getMessage(),false));
        }catch(Exception exception){
            return ResponseEntity.status(500).body(new ResponseDTO(exception.getMessage(),false));

        }
    }

    @PutMapping(value="/api/updateUploadRequest",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDTO>updateUploadRequest(Authentication authentication , @ModelAttribute UploadRequestDTO uploadRequestDTO, @RequestParam Long requestId){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO response = uploadRequestService.updateUploadRequest(authUserId,uploadRequestDTO,requestId);
            return ResponseEntity.status(200).body(response);

        }catch (GenericError genericError){
            return ResponseEntity.status(400).body(new ResponseDTO(genericError.getMessage(),false));
        }catch (ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(404).body(new ResponseDTO(resourceNotFoundException.getMessage(),false));
        }catch(Exception exception){
            return ResponseEntity.status(500).body(new ResponseDTO(exception.getMessage(),false));

        }
    }
    @DeleteMapping("/api/deleteUploadRequest")
    public ResponseEntity<ResponseDTO>deleteUploadRequest(Authentication authentication, @RequestParam Long requestId){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO response = uploadRequestService.deleteUploadRequest(authUserId,requestId);
            return ResponseEntity.status(200).body(response);

        }catch (GenericError genericError){
            return ResponseEntity.status(400).body(new ResponseDTO(genericError.getMessage(),false));
        }catch (ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(404).body(new ResponseDTO(resourceNotFoundException.getMessage(),false));
        }catch(Exception exception){
            return ResponseEntity.status(500).body(new ResponseDTO(exception.getMessage(),false));

        }
    }
}
