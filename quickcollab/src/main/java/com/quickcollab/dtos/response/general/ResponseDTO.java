package com.quickcollab.dtos.response.general;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResponseDTO {
    private String message;
    private Boolean success;
}
