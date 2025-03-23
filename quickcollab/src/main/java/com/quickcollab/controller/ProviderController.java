package com.quickcollab.controller;

import com.quickcollab.dtos.request.AddProviderDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.service.ProviderService;
import lombok.AllArgsConstructor;
import lombok.Generated;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@Validated
public class ProviderController {
    private ProviderService providerService;

    @PutMapping("/api/addProvider")
    public ResponseEntity<ResponseDTO> addProvider(Authentication authentication, @RequestBody AddProviderDTO addProviderDTO){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO response = providerService.addProvider(addProviderDTO,authUserId);
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
