package com.quickcollab.dtos.response.conversation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoggedInUserConversationsDTO {
    private String message;
    private Boolean success;
    private List<UserConversationDetail> conversations;

}
