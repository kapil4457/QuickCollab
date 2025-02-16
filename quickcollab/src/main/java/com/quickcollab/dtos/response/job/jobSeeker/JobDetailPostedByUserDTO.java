package com.quickcollab.dtos.response.job.jobSeeker;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JobDetailPostedByUserDTO {
    private String userId;
    private String firstName;
    private String lastName;
}
