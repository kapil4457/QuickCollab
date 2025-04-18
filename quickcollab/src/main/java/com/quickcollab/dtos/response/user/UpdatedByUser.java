package com.quickcollab.dtos.response.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatedByUser {
    public String userId;
    public String firstName;
    public String lastName;
}
