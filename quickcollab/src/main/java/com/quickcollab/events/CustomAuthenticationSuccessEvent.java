package com.quickcollab.events;

import com.quickcollab.dtos.response.conversation.MessageDetailResponse;
import org.springframework.context.ApplicationEvent;

public class CustomAuthenticationSuccessEvent  extends ApplicationEvent {
    private final String userId;

    public CustomAuthenticationSuccessEvent(Object source, String userId) {
        super(source);
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

}
