package com.quickcollab.service;

import com.quickcollab.dtos.request.ConversationCreateDTO;
import com.quickcollab.dtos.request.MeetingCreateDTO;
import com.quickcollab.dtos.request.MessageDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.dtos.response.user.ReportingUser;
import com.quickcollab.enums.UserRole;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.model.Conversation;
import com.quickcollab.model.Meeting;
import com.quickcollab.model.User;
import com.quickcollab.pojo.CallLog;
import com.quickcollab.pojo.MessageDetail;
import com.quickcollab.pojo.Pair;
import com.quickcollab.repository.ConversationRepository;
import com.quickcollab.repository.MeetingRepository;
import com.quickcollab.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class ConversationService {

    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final MeetingRepository meetingRepository;
    private final ModelMapper modelMapper;

    public ResponseDTO createConversation(ConversationCreateDTO conversationCreateDTO, String userRole, String authUserId) {
        List<User> members = conversationCreateDTO.getMembersIds().stream().map(memberId -> userRepository.findById(memberId).orElseThrow(() -> new ResourceNotFoundException("User", "userId", memberId))).toList();
        User admin = userRepository.findById(conversationCreateDTO.getAdminId()).orElseThrow(() -> new ResourceNotFoundException("User", "userId", conversationCreateDTO.getAdminId()));
        String contentCreatorId = Objects.equals(userRole, "ROLE_" + UserRole.CONTENT_CREATOR.toString()) ? authUserId : userRepository.getReportingUserByUserId(authUserId);
        if (!Objects.equals(contentCreatorId, admin.getUserId()) && (admin.getReportsTo() != null && !Objects.equals(contentCreatorId, admin.getReportsTo().getUserId()))) {
            throw new GenericError("You are not allowed to perform this operation");
        }

        if (conversationCreateDTO.getIsTeamMemberConversation()) {
            members.forEach(member -> {
                if ((member.getReportsTo() != null && !member.getReportsTo().getUserId().equals(contentCreatorId)) && member.getUserId().equals(contentCreatorId)) {
                    throw new GenericError("Can not create a group with " + member.getFirstName() + " " + member.getLastName() + " as he does not reports to the user as you do.");
                }
            });
        } else {
            if (members.size() <= 2) {
                throw new GenericError("Can not create a group with users who does not work with you.");
            }
        }
        if (members.size() <= 2) {
            throw new GenericError("Can not create a group with just 2 members.");
        }

        Conversation conversation = new Conversation();
        conversation.setMembers(members);
        conversation.setAdmin(admin);
        if (conversationCreateDTO.getIsGroupChat()) {
            conversation.setGroupName(conversationCreateDTO.getGroupName());
        }
        conversation.setIsGroupChat(conversationCreateDTO.getIsGroupChat());


        conversationRepository.save(conversation);

        return new ResponseDTO(conversationCreateDTO.getIsGroupChat() ? "Group" : "Conversation" + " created successfully !", true);

    }

    public ResponseDTO insertMessage(MessageDTO messageDTO, String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
        Long conversationId = messageDTO.getConversationId();
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> new ResourceNotFoundException("Conversation", "id", conversationId.toString()));
        if (!conversation.getMembers().contains(user)) {
            throw new GenericError("Can not send message as you are not a part of this conversation.");
        }
        Date currDate = new Date();
        MessageDetail messageDetail = new MessageDetail(messageDTO.getMessage(), messageDTO.getMessageType(), user, currDate);
        conversation.getMessages().add(messageDetail);
        conversation.setLastMessage(currDate);
        conversationRepository.save(conversation);
        return new ResponseDTO("Message added successfully !", true);
    }

    public ResponseDTO addMember(String authUserId, String memberId, Long conversationId) {
        User newMember = userRepository.findById(memberId).orElseThrow(() -> new ResourceNotFoundException("User", "id", memberId));
        User authUser = userRepository.findById(authUserId).orElseThrow(() -> new ResourceNotFoundException("User", "id", authUserId));
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> new ResourceNotFoundException("Conversation", "id", conversationId.toString()));
        User grpAdmin = conversation.getAdmin();
        ReportingUser authReportingUser = authUser.getReportsTo();
        ReportingUser newMemberReportingUser = newMember.getReportsTo();
        ReportingUser grpAdminReportingUser = grpAdmin.getReportsTo();

        if(!(authReportingUser.getUserId().equals(newMemberReportingUser.getUserId()) && authReportingUser.getUserId().equals(grpAdminReportingUser.getUserId()))){
                throw new GenericError("You can not perform this operation");
        }

        conversation.getMembers().add(newMember);

        conversationRepository.save(conversation);
        return new ResponseDTO("Member added successfully !", true);

    }

    public ResponseDTO removeMember(String authUserId, String memberId, Long conversationId) {
        User newMember = userRepository.findById(memberId).orElseThrow(() -> new ResourceNotFoundException("User", "id", memberId));
        User authUser = userRepository.findById(authUserId).orElseThrow(() -> new ResourceNotFoundException("User", "id", authUserId));
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> new ResourceNotFoundException("Conversation", "id", conversationId.toString()));
        User grpAdmin = conversation.getAdmin();
        ReportingUser authReportingUser = authUser.getReportsTo();
        ReportingUser newMemberReportingUser = newMember.getReportsTo();
        ReportingUser grpAdminReportingUser = grpAdmin.getReportsTo();

        if(!(authReportingUser.getUserId().equals(newMemberReportingUser.getUserId()) && authReportingUser.getUserId().equals(grpAdminReportingUser.getUserId()))){
            throw new GenericError("You can not perform this operation");
        }
        if(!authUser.getUserId().equals(grpAdmin.getUserId())){
            throw new GenericError("You can not perform this operation");
        }
        if(!conversation.getMembers().contains(newMember)){
            throw new GenericError("You can not perform this operation");
        }

        conversation.getMembers().remove(newMember);

        conversationRepository.save(conversation);
        return new ResponseDTO("Member removed successfully !", true);

    }

    public ResponseDTO startCall(String authUserId, Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(()-> new ResourceNotFoundException("Conversation", "id", conversationId.toString()));
        User authUser = userRepository.findById(authUserId).orElseThrow(() -> new ResourceNotFoundException("User", "id", authUserId));
        String callId = UUID.randomUUID().toString();
        if(!conversation.getMembers().contains(authUser)){
            throw new GenericError("You can not perform this operation");
        }
        //  PENDING : Send in notification to all members of the conversation
        CallLog callLog = new CallLog();
        callLog.setCallId(callId);
        callLog.setConversationId(conversationId);
        Date joiningTime = new Date();
        callLog.getMembers().put(authUser , new Pair<>(joiningTime ,joiningTime));
        callLog.setStartedAt(joiningTime);
        conversation.getCallLogs().add(callLog);
        callLog.setInCallMembers(callLog.getInCallMembers()+1);
        conversationRepository.save(conversation);
        return new ResponseDTO("Call started successfully !", true);
    }

    public ResponseDTO joinCall(String authUserId, Long conversationId, String callId) {

        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(()-> new ResourceNotFoundException("Conversation", "id", conversationId.toString()));
        User authUser = userRepository.findById(authUserId).orElseThrow(() -> new ResourceNotFoundException("User", "id", authUserId));
        conversation.getCallLogs().forEach(callLog ->{

            if(callLog.getCallId().equals(callId)){
                if(callLog.getEndedAt().before(new Date())){
                    throw new GenericError("Call has already ended.");
                }
                Date joiningTime = new Date();
                callLog.getMembers().put(authUser , new Pair<>(joiningTime ,joiningTime));
                callLog.setInCallMembers(callLog.getInCallMembers()+1);
            }
        });

        conversationRepository.save(conversation);
        return new ResponseDTO("Call joined successfully !", true);

    }

    public ResponseDTO leaveCall(String authUserId, Long conversationId, String callId) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(()-> new ResourceNotFoundException("Conversation", "id", conversationId.toString()));
        conversation.getCallLogs().forEach(callLog ->{
            if(callLog.getCallId().equals(callId)){
                Long inCallMembers= callLog.getInCallMembers()-1;
                callLog.setInCallMembers(inCallMembers);
                callLog.getMembers().forEach((member , time) -> {
                if(member.getUserId().equals(authUserId)){
                    Date leaveTime = new Date();
                    time.setValue(leaveTime);
                 }
                });

                if(inCallMembers==0){
                    callLog.setEndedAt(new Date());
                }
            }
        });

        conversationRepository.save(conversation);
        return new ResponseDTO("Left call successfully !", true);

    }

    public ResponseDTO scheduleMeet(MeetingCreateDTO meetingCreateDTO) {
        List<User> members = new ArrayList<>();
        String adminId = meetingCreateDTO.getAdminId();
        User admin = userRepository.findById(adminId).orElseThrow(()-> new ResourceNotFoundException("User","id",adminId));

        meetingCreateDTO.getMembers().forEach((memberId)->{
            User member = userRepository.findById(memberId).orElseThrow(()-> new ResourceNotFoundException("User", "id", memberId));
            members.add(member);
        });
        Meeting meeting = modelMapper.map(meetingCreateDTO,Meeting.class);
        meetingRepository.save(meeting);
        return new ResponseDTO("Meeting scheduled successfully !", true);
    }

    public ResponseDTO joinMeet(String userId , String meetId){
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Meeting meeting = meetingRepository.findById(meetId).orElseThrow(() -> new ResourceNotFoundException("Meeting", "id", meetId));
        if(meeting.getEndsOn().after(new Date()) && meeting.getActiveMembers().isEmpty()){
            throw new GenericError("Meeting has already ended.");
        }
        if(meeting.getScheduledFor().before(new Date())){
            throw new GenericError("Meeting has not started yet.");
        }
        if(!meeting.getMembers().contains(user)){
            throw new GenericError("You are not invited to this meet");
        }
        meeting.getActiveMembers().add(user);
        meetingRepository.save(meeting);
        return new ResponseDTO("Meeting joined successfully !", true);
    }

    public ResponseDTO leaveMeet(String userId , String meetId){
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Meeting meeting = meetingRepository.findById(meetId).orElseThrow(() -> new ResourceNotFoundException("Meeting", "id", meetId));

        if(!meeting.getActiveMembers().contains(user)){
            throw new GenericError("You can not leave this meet without joining.");
        }
        if(!meeting.getMembers().contains(user)){
            throw new GenericError("You are not invited to this meet");
        }
        meeting.getActiveMembers().remove(user);
        meetingRepository.save(meeting);
        return new ResponseDTO("Meeting left successfully !", true);
    }

    public ResponseDTO updateMeetInvite(String authUserId, String meetId,MeetingCreateDTO meetingCreateDTO) {
        User user=  userRepository.findById(authUserId).orElseThrow(() -> new ResourceNotFoundException("User", "id", authUserId));
        Meeting meeting = meetingRepository.findById(meetId).orElseThrow(() -> new ResourceNotFoundException("Meeting", "id", meetId));
        if(!meeting.getMembers().contains(user)){
                throw new GenericError("You are not allowed to perform this operation.");
        }
        Meeting finalMeeting =modelMapper.map(meetingCreateDTO,Meeting.class);
        meetingCreateDTO.getMembers().forEach((memberId)->{
            User member = userRepository.findById(memberId).orElseThrow(() -> new ResourceNotFoundException("User", "id", memberId));
            if(!finalMeeting.getMembers().contains(member)){
                finalMeeting.getMembers().add(member);
            }
        });

        finalMeeting.getMembers().forEach(member -> {
            if(!meetingCreateDTO.getMembers().contains(member.getUserId())){
                if(finalMeeting.getActiveMembers().contains(member) || finalMeeting.getAdmin().equals(member)){
                    throw new GenericError("Can not remove "+member.getFirstName()+" "+member.getLastName()+" from this meet.");
                }
            }
        });

        meetingRepository.save(finalMeeting);
        return new ResponseDTO("Meeting updated successfully !", true);



    }
}
