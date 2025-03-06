package com.quickcollab.model;

import ch.qos.logback.classic.pattern.MessageConverter;
import com.quickcollab.converter.CallLogConverter;
import com.quickcollab.converter.MessageDetailConverter;
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

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long conversationId;

    @NotNull
    @ManyToMany
    private List<User> members;

    private String groupName;

    @Convert(converter = MessageDetailConverter.class)
    private List<MessageDetail> messages = new ArrayList<>();

    @Convert(converter = CallLogConverter.class)
    private List<CallLog> callLogs = new ArrayList<>();
    private Date lastMessage;

    private Boolean isGroupChat=false;
    private Boolean isTeamMemberConversation=false;

    @ManyToOne
    private User admin;


}
