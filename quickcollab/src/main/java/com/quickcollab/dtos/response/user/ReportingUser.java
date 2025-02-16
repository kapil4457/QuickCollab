package com.quickcollab.dtos.response.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportingUser {
    private String userId;
    private String firstName;
    private String lastName;
}
