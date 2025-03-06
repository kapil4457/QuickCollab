package com.quickcollab.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConversationCreateDTO {
    private List<String> membersIds;
    private String groupName;
    private Boolean isGroupChat;
    private Boolean isTeamMemberConversation;
}
