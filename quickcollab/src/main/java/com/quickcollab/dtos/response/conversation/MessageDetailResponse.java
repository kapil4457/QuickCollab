package com.quickcollab.dtos.response.conversation;

import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.MessageType;
import com.quickcollab.enums.Platform;
import com.quickcollab.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageDetailResponse {
    private String message;
    private String fileUrl;
    private String description;
    private MessageType messageType;
    private ConversationUser author;
    private Date sentOn;
    private Boolean isUploadRequest;
    private List<Platform> uploadTo;
    private Map<Platform, ContentType> uploadTypeMapping;
}
