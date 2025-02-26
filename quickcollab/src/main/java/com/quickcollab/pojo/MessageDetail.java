package com.quickcollab.pojo;

import com.quickcollab.enums.MessageType;
import com.quickcollab.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageDetail {
    private String message;
    private MessageType messageType;
    private User author;
    private Date sentOn;
}
