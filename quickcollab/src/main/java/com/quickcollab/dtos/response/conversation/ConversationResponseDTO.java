package com.quickcollab.dtos.response.conversation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ConversationResponseDTO {
    private String message;
    private Boolean success;
    private Long conversationId;
}
