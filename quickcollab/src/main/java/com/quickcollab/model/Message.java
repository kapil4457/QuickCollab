package com.quickcollab.model;

import com.quickcollab.converter.PlatformConverter;
import com.quickcollab.converter.UploadTypeMappingConverter;
import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.MessageType;
import com.quickcollab.enums.Platform;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String messageId;

    @ManyToOne
    private Conversation conversation;

    @Column(length = 10000)
    private String message="";

    @Column(length = 10000)
    private String fileUrl="";

    @Column(length = 10000)
    private String description="";
    private MessageType messageType;
    @ManyToOne
    private User author;
    private Date sentOn;
    private Boolean isUploadRequest;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<Platform> uploadTo;


    @Convert(converter = UploadTypeMappingConverter.class)
    private Map<Platform, ContentType> uploadTypeMapping;

    public Message(Conversation conversation , String message, String fileUrl, String description, MessageType messageType, User user, Date currDate, Boolean isUploadRequest, List<Platform> uploadTo, Map<Platform, ContentType> uploadTypeMapping) {
        this.conversation = conversation;
        this.message = message;
        this.fileUrl = fileUrl;
        this.description = description;
        this.messageType = messageType;
        this.author = user;
        this.sentOn = currDate;
        this.isUploadRequest = isUploadRequest;
        this.uploadTo = uploadTo;
        this.uploadTypeMapping = uploadTypeMapping;
    }
}

