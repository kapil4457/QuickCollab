package com.quickcollab.events;

import org.springframework.context.ApplicationEvent;

public class CustomLogoutSuccessEvent extends ApplicationEvent {
    private final String userId;

    public CustomLogoutSuccessEvent(Object source, String userId) {
        super(source);
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

}
