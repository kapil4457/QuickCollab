package com.quickcollab.dtos.response.conversation;

import com.quickcollab.converter.CallLogConverter;
import com.quickcollab.converter.MessageDetailConverter;
import com.quickcollab.model.User;
import com.quickcollab.pojo.CallLog;
import com.quickcollab.pojo.MessageDetail;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserConversationDetail {

    private Long conversationId;
    private List<ConversationUser> members;
    private String groupName;
    private List<MessageDetailResponse> messages = new ArrayList<>();
    private List<CallLog> callLogs = new ArrayList<>();
    private Date lastMessage;
    private Boolean isGroupChat=false;
    private Boolean isTeamMemberConversation=false;
    private ConversationUser admin;
}
