package com.quickcollab.service;

import com.quickcollab.dtos.request.ConversationCreateDTO;
import com.quickcollab.dtos.request.MeetingCreateDTO;
import com.quickcollab.dtos.request.MessageDTO;
import com.quickcollab.dtos.response.conversation.*;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.dtos.response.user.ReportingUser;
import com.quickcollab.enums.UserRole;
import com.quickcollab.events.MessageSentEvent;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.model.Conversation;
import com.quickcollab.model.Meeting;
import com.quickcollab.model.Message;
import com.quickcollab.model.User;
import com.quickcollab.pojo.CallLog;
import com.quickcollab.pojo.MessageDetail;
import com.quickcollab.pojo.Pair;
import com.quickcollab.repository.ConversationRepository;
import com.quickcollab.repository.MeetingRepository;
import com.quickcollab.repository.MessageRepository;
import com.quickcollab.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class ConversationService {

    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final MeetingRepository meetingRepository;
    private final ModelMapper modelMapper;
    private final MessageRepository messageRepository;
    private final ApplicationEventPublisher eventPublisher;


    public ConversationResponseDTO createConversation(ConversationCreateDTO conversationCreateDTO, String userRole, String authUserId) {
        List<User> members = new ArrayList<>(conversationCreateDTO.getMembersIds().stream().map(memberId -> userRepository.findById(memberId).orElseThrow(() -> new ResourceNotFoundException("User", "userId", memberId))).toList());
        User admin = userRepository.findById(authUserId).orElseThrow(() -> new ResourceNotFoundException("User", "userId", authUserId));
        members.add(admin);
        List<Conversation> conversations = conversationRepository.findAll().stream().filter(conversation-> conversation.getMembers().equals(members)).toList();
        if(!conversations.isEmpty()){
            throw new GenericError("There already exists a conversation between the chosen members.");
        }
        String contentCreatorId = Objects.equals(userRole, "ROLE_" + UserRole.CONTENT_CREATOR.toString()) ? authUserId : userRepository.getReportingUserByUserId(authUserId);
        if (!Objects.equals(contentCreatorId, admin.getUserId()) && (admin.getReportsTo() != null && !Objects.equals(contentCreatorId, admin.getReportsTo().getUserId()))) {
            throw new GenericError("You are not allowed to perform this operation");
        }
        if(members.size()>2){
            conversationCreateDTO.setIsGroupChat(true);
        }else{
            conversationCreateDTO.setIsGroupChat(false);
        }


            members.forEach(member -> {
                if ((member.getReportsTo() != null && !member.getReportsTo().getUserId().equals(contentCreatorId)) && member.getUserId().equals(contentCreatorId)) {
                    throw new GenericError("Can not create a group with " + member.getFirstName() + " " + member.getLastName() + " as he does not reports to the user as you do.");
                }
            });


        Conversation conversation = new Conversation();
        conversation.setMembers(members);
        conversation.setAdmin(admin);
        if (conversationCreateDTO.getIsGroupChat()) {
            conversation.setGroupName(conversationCreateDTO.getGroupName());
        }

        conversation.setIsGroupChat(conversationCreateDTO.getIsGroupChat());
        conversation.setLastMessage(new Date());
       Conversation newConversation =  conversationRepository.save(conversation);

        newConversation.getMembers()
                .forEach(member -> {
            member.getConversations().add(conversation);
            userRepository.save(member);
        });

        return new ConversationResponseDTO(conversationCreateDTO.getIsGroupChat() ? "Group" : "Conversation" + " created successfully !", true,newConversation.getConversationId());

    }

    public MessageResponseDTO insertMessage(MessageDTO messageDTO, String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
        UserRole userRole = user.getUserRole();
        Long conversationId = messageDTO.getConversationId();
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> new ResourceNotFoundException("Conversation", "id", conversationId.toString()));
        if(messageDTO.getIsUploadRequest()){
            if(userRole.equals(UserRole.JOB_SEEKER)){
                throw new GenericError("You are not allowed to perform this operation");
            }
            if(!conversation.getMembers().contains(user)){
                throw new GenericError("You are not allowed to perform this operation");
            }
        }
        String fileUrl="";
        if(messageDTO.getIsUploadRequest()){
            // upload to cloud storage
            // take that link and save it as message
        }
        if (!conversation.getMembers().contains(user)) {
            throw new GenericError("Can not send message as you are not a part of this conversation.");
        }
        Date currDate = new Date();
        Message message = new Message(conversation,messageDTO.getMessage(),
                fileUrl,
                messageDTO.getDescription(),
                messageDTO.getMessageType(),
                user,
                currDate,
                messageDTO.getIsUploadRequest(),
                messageDTO.getUploadTo(),
                messageDTO.getUploadTypeMapping());
       Message savedMessage =  messageRepository.save(message);
        conversation.getMessages().add(savedMessage);
        conversation.setLastMessage(currDate);
        MessageDetail messageDetail = new MessageDetail(message.getMessage(),message.getFileUrl(),message.getDescription(),message.getMessageType(),message.getAuthor(),message.getSentOn(),message.getIsUploadRequest(),message.getUploadTo(),message.getUploadTypeMapping());

        conversationRepository.save(conversation);
        MessageDetailResponse messageDetailResponse = modelMapper.map(messageDetail, MessageDetailResponse.class);
        ConversationUser conversationUser = new ConversationUser(userId , user.getFirstName(), user.getLastName());
        messageDetailResponse.setAuthor(conversationUser);

        eventPublisher.publishEvent(new MessageSentEvent(this, conversationId, messageDetailResponse));

        return new MessageResponseDTO("Message added successfully !", true,messageDetailResponse,currDate);
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

    public LoggedInUserConversationsDTO getAllConversations(String authUserId) {
        User user = userRepository.findById(authUserId).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));
        List<Conversation> conversations = conversationRepository.findAll().stream().filter(conversation -> {
            return conversation.getMembers().contains(user);
        }).toList();
        List<UserConversationDetail> userConversationDetails = conversations.stream().map((conversation)->{
            UserConversationDetail userConversationsDTO = new UserConversationDetail();
            userConversationsDTO.setConversationId(conversation.getConversationId());
            userConversationsDTO.setIsTeamMemberConversation(conversation.getIsTeamMemberConversation());
            userConversationsDTO.setGroupName(conversation.getGroupName());
            userConversationsDTO.setCallLogs(conversation.getCallLogs());
            List<MessageDetailResponse> messages = conversation.getMessages().stream().map((message)->{
                MessageDetailResponse messageDetailResponse = new MessageDetailResponse();
                messageDetailResponse.setMessage(message.getMessage());
                messageDetailResponse.setDescription(message.getDescription());
                messageDetailResponse.setFileUrl(message.getFileUrl());
                messageDetailResponse.setSentOn(message.getSentOn());
                messageDetailResponse.setUploadTo(message.getUploadTo());
                messageDetailResponse.setIsUploadRequest(message.getIsUploadRequest());
                messageDetailResponse.setMessageType(message.getMessageType());
                messageDetailResponse.setUploadTypeMapping(message.getUploadTypeMapping());
                ConversationUser author = new ConversationUser();
                author.setUserId(message.getAuthor().getUserId());
                author.setFirstName(message.getAuthor().getFirstName());
                author.setLastName(message.getAuthor().getLastName());
                messageDetailResponse.setAuthor(author);
                return messageDetailResponse;
//                 MessageDetail messageDetail =  new MessageDetail(message.getMessage(),message.getFileUrl(),message.getDescription(),message.getMessageType(),message.getSentOn(),message.getIsUploadRequest(),message.getUploadTo(),message.getUploadTypeMapping());
            }).toList().reversed();

            userConversationsDTO.setMessages(messages);
            userConversationsDTO.setIsGroupChat(conversation.getIsGroupChat());
            userConversationsDTO.setLastMessage(conversation.getLastMessage());
            userConversationsDTO.setAdmin(new ConversationUser(conversation.getAdmin().getUserId() , conversation.getAdmin().getFirstName() , conversation.getAdmin().getLastName()));
            userConversationsDTO.setMembers(conversation.getMembers().stream().map((member)->{
                return new ConversationUser(member.getUserId() , member.getFirstName() , member.getLastName());
            }).toList());
            return userConversationsDTO;
        }).toList();
        LoggedInUserConversationsDTO loggedInUserConversationsDTO = new LoggedInUserConversationsDTO();
        loggedInUserConversationsDTO.setMessage("Conversations fetched successfully !");
        loggedInUserConversationsDTO.setSuccess(true);
        loggedInUserConversationsDTO. setConversations(userConversationDetails);
        return loggedInUserConversationsDTO;
    }
}
