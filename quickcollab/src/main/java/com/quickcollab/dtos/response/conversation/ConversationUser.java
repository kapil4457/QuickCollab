package com.quickcollab.dtos.response.conversation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConversationUser {
    private String userId;
    private String firstName;
    private String lastName;
}
