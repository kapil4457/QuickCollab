package com.quickcollab.controller;
import com.quickcollab.dtos.request.UploadRequestStringifiedDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.enums.UploadRequestStatus;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.service.UploadRequestService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Validated
@AllArgsConstructor
public class UploadRequestController {

    private final UploadRequestService uploadRequestService;

//    [DONE]
    @PostMapping(value="/api/createUploadRequest",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDTO> createUploadRequest(Authentication authentication , @ModelAttribute UploadRequestStringifiedDTO uploadRequestStringifiedDTO){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO response = uploadRequestService.createUploadRequest(authUserId,uploadRequestStringifiedDTO);
            return ResponseEntity.status(201).body(response);

        }catch (GenericError genericError){
            return ResponseEntity.status(400).body(new ResponseDTO(genericError.getMessage(),false));
        }catch (ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(404).body(new ResponseDTO(resourceNotFoundException.getMessage(),false));
        }catch(Exception exception){
            return ResponseEntity.status(500).body(new ResponseDTO(exception.getMessage(),false));

        }
    }

//    [DONE]
    @PutMapping("/api/updateUploadRequestStatus")
    public ResponseEntity<ResponseDTO> updateUploadRequestStatus(Authentication authentication , @RequestParam Long requestId , @RequestParam UploadRequestStatus status){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO response = uploadRequestService.updateUploadRequestStatus(authUserId,requestId,status);
            return ResponseEntity.status(200).body(response);

        }catch (GenericError genericError){
            return ResponseEntity.status(400).body(new ResponseDTO(genericError.getMessage(),false));
        }catch (ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(404).body(new ResponseDTO(resourceNotFoundException.getMessage(),false));
        }catch(Exception exception){
            return ResponseEntity.status(500).body(new ResponseDTO(exception.getMessage(),false));

        }
    }


    @PutMapping(value="/api/updateUploadRequest",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseDTO>updateUploadRequest(Authentication authentication ,
                                                          @RequestPart(value = "media",required = false) MultipartFile media ,
                                                          @RequestPart(value = "title") String title ,
                                                          @RequestPart(value = "description") String description ,
                                                          @RequestPart(value = "tags") String tags ,
                                                          @RequestPart(value = "uploadTo") String uploadTo ,
                                                          @RequestPart(value = "uploadRequestStatus") UploadRequestStatus uploadRequestStatus ,
                                                          @RequestPart(value = "uploadTypeMapping") String uploadTypeMapping ,
                                                          @RequestPart(value = "mediaType") String mediaType ,
                                                          @RequestParam(value = "requestId") Long requestId
    ){
        try{
            String authUserId = authentication.getDetails().toString();
            UploadRequestStringifiedDTO uploadRequestStringifiedDTO = new UploadRequestStringifiedDTO();
            uploadRequestStringifiedDTO.setTitle(title);
            uploadRequestStringifiedDTO.setDescription(description);
            uploadRequestStringifiedDTO.setTags(tags);
            uploadRequestStringifiedDTO.setUploadTo(uploadTo);
            uploadRequestStringifiedDTO.setUploadRequestStatus(uploadRequestStatus);
            uploadRequestStringifiedDTO.setUploadTypeMapping(uploadTypeMapping);
            uploadRequestStringifiedDTO.setMediaType(com.quickcollab.enums.MediaType.valueOf(mediaType));
            if(media!=null){
            uploadRequestStringifiedDTO.setMedia(media);
            }
            ResponseDTO response = uploadRequestService.updateUploadRequest(authUserId,uploadRequestStringifiedDTO,requestId);
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
