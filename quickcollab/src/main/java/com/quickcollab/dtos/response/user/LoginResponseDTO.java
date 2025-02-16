package com.quickcollab.dtos.response.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO<T> {
        private T user;
        private String message;
        private Boolean success;
}
