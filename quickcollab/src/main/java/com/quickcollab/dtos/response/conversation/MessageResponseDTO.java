package com.quickcollab.dtos.response.conversation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO {
    private String message;
    private boolean success;
    private MessageDetailResponse messageDetail;
    private Date lastMessage;
}
