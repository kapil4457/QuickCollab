package com.quickcollab.pojo;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class MessageDetail {
    private String message;
    private String fileUrl;
    private String description;
    private MessageType messageType;

    @JsonBackReference
    private User author;
    private Date sentOn;
//    private Boolean isUploadRequest;
//    private List<Platform> uploadTo;
//    private Map<Platform, ContentType>  uploadTypeMapping;


}
