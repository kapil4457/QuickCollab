package com.quickcollab.config;

import com.quickcollab.dtos.response.conversation.MessageResponseDTO;
import com.quickcollab.events.CustomAuthenticationSuccessEvent;
import com.quickcollab.events.CustomLogoutSuccessEvent;
import com.quickcollab.events.MessageSentEvent;
import com.quickcollab.service.ConversationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.authentication.event.LogoutSuccessEvent;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final ConversationService conversationService;
    private final SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleLoginEvent(CustomAuthenticationSuccessEvent event) {
        String userId = event.getUserId(); // Get logged-in user's ID
        List<Long> conversationIds = conversationService.getAllConversations(userId).getConversations().stream().map(conversation->{
            return conversation.getConversationId();
        }).toList();

        conversationIds.forEach(conversationId->{
        messagingTemplate.convertAndSend("/room/conversations/online", conversationId);
        });
    }
    @EventListener
    public void handleLogoutEvent(CustomLogoutSuccessEvent event) {
        String userId = event.getUserId(); // Get logged-in user's ID
        List<Long> conversationIds = conversationService.getAllConversations(userId).getConversations().stream().map(conversation->{
            return conversation.getConversationId();
        }).toList();

        conversationIds.forEach(conversationId->{
        messagingTemplate.convertAndSend("/room/conversations/offline", conversationId);
        });
    }


    @EventListener
    public void handleMessageSentEvent(MessageSentEvent event) {
        messagingTemplate.convertAndSend("/room/sendMessage/" + event.getConversationId(), event.getMessage());
    }



}
