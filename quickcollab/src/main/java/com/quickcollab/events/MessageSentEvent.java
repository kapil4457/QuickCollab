package com.quickcollab.events;

import com.quickcollab.dtos.response.conversation.MessageDetailResponse;
import com.quickcollab.dtos.response.conversation.MessageResponseDTO;
import org.springframework.context.ApplicationEvent;

public class MessageSentEvent extends ApplicationEvent {
    private final Long conversationId;
    private final MessageDetailResponse message;

    public MessageSentEvent(Object source, Long conversationId, MessageDetailResponse message) {
        super(source);
        this.conversationId = conversationId;
        this.message = message;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public MessageDetailResponse getMessage() {
        return message;
    }
}
