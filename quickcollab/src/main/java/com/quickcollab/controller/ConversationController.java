package com.quickcollab.controller;

import com.quickcollab.dtos.request.ConversationCreateDTO;
import com.quickcollab.dtos.request.MeetingCreateDTO;
import com.quickcollab.dtos.request.MessageDTO;
import com.quickcollab.dtos.response.conversation.ConversationResponseDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.service.ConversationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@AllArgsConstructor
@Validated
public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping("/createConversation")
    public ResponseEntity<ConversationResponseDTO> createConversation(Authentication authentication , @RequestBody @Valid ConversationCreateDTO conversationCreateDTO) {
        try{
            String userRole = authentication.getAuthorities().stream().findFirst().get().getAuthority();
            String authUserId = authentication.getDetails().toString();
            ConversationResponseDTO responseDTO = conversationService.createConversation(conversationCreateDTO , userRole,authUserId);
            return  ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        }catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ConversationResponseDTO(resourceNotFoundException.getMessage() , false,-1L));
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ConversationResponseDTO(genericError.getMessage() , false,-1L));
        }
    }

    @PutMapping("/insertMessage")
    public ResponseEntity<ResponseDTO> insertMessage(Authentication authentication, @RequestBody MessageDTO messageDetail) {
        try{

        String userId = authentication.getDetails().toString();
        ResponseDTO responseDTO = conversationService.insertMessage(messageDetail,userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        }catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(resourceNotFoundException.getMessage() , false));
        }
    }

    @PutMapping("/addMember")
    public ResponseEntity<ResponseDTO> addMember(Authentication authentication , @RequestParam String memberId,@RequestParam Long conversationId){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO responseDTO = conversationService.addMember(authUserId , memberId,conversationId);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
        }catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(resourceNotFoundException.getMessage() , false));
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage() , false));
        }
    }

    @PutMapping("/removeMember")
    public ResponseEntity<ResponseDTO> removeMember(Authentication authentication , @RequestParam String memberId,@RequestParam Long conversationId){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO responseDTO = conversationService.removeMember(authUserId , memberId,conversationId);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
        }catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(resourceNotFoundException.getMessage() , false));
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage() , false));
        }
    }


    // For team members
    @PutMapping("/startCall")
    public ResponseEntity<ResponseDTO> startCall(Authentication authentication , @RequestParam Long conversationId){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO responseDTO = conversationService.startCall(authUserId , conversationId);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);

        }
        catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(resourceNotFoundException.getMessage() , false));
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage() , false));
        }
    }

    // For team members
    @PutMapping("/joinCall")
    public ResponseEntity<ResponseDTO> joinCall(Authentication authentication , @RequestParam Long conversationId , @RequestParam String callId){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO responseDTO = conversationService.joinCall(authUserId , conversationId,callId);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);

        }
        catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(resourceNotFoundException.getMessage() , false));
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage() , false));
        }
    }

    // For team members
    @PutMapping("/leaveCall")
    public ResponseEntity<ResponseDTO> leaveCall(Authentication authentication , @RequestParam Long conversationId , @RequestParam String callId){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO responseDTO = conversationService.leaveCall(authUserId , conversationId,callId);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);

        }
        catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(resourceNotFoundException.getMessage() , false));
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage() , false));
        }
    }

    // For content creator and managers
    @PostMapping("/scheduleMeet")
    public ResponseEntity<ResponseDTO> scheduleMeet( @RequestBody MeetingCreateDTO meetingCreateDTO){
        try{

    ResponseDTO responseDTO = conversationService.scheduleMeet(meetingCreateDTO);
    return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
        }catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(resourceNotFoundException.getMessage() , false));
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage() , false));
        }
    }

    // For invited members
    @PutMapping("/joinMeeting")
    public ResponseEntity<ResponseDTO>joinMeet(Authentication authentication  , @RequestParam String meetId){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO responseDTO = conversationService.joinMeet(authUserId , meetId);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
        }catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(resourceNotFoundException.getMessage() , false));
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage() , false));
        }
    }

    // For invited members
    @PutMapping("/leaveMeet")
    public ResponseEntity<ResponseDTO> leaveMeet(Authentication authentication , @RequestParam String meetId){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO responseDTO = conversationService.leaveMeet(authUserId , meetId);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
        }catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(resourceNotFoundException.getMessage() , false));
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage() , false));
        }
    }

    // For any invited members
    @PutMapping("/updateMeetInvite")
    public ResponseEntity<ResponseDTO> updateMeetInvite(Authentication authentication , @RequestParam String meetId , @RequestBody MeetingCreateDTO meetingCreateDTO){
        try{
            String authUserId = authentication.getDetails().toString();
            ResponseDTO responseDTO = conversationService.updateMeetInvite(authUserId , meetId,meetingCreateDTO);
            return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
        }catch(ResourceNotFoundException resourceNotFoundException){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseDTO(resourceNotFoundException.getMessage() , false));
        }catch(GenericError genericError){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(genericError.getMessage() , false));
        }
    }

}
