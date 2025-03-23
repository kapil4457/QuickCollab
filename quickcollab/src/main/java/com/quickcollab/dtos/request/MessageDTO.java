package com.quickcollab.dtos.request;

import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.MessageType;
import com.quickcollab.enums.Platform;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private String message;
    private MultipartFile media;
    private String description;
    private MessageType messageType;
    private Long conversationId;
//    private Boolean isUploadRequest;
//    private List<Platform> uploadTo;
//    private Map<Platform, ContentType> uploadTypeMapping;
}
