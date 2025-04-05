package com.quickcollab.dtos.response.user;

import com.quickcollab.dtos.response.job.contentCreator.ContentCreatorProfileJobPost;
import com.quickcollab.enums.UserRole;
import com.quickcollab.pojo.SocialMediaHandle;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContentCreatorProfileDTO {
    private String userId;
    private String firstName;
    private String lastName;
    private UserRole userRole;
    private String profilePicture;
    private String selfDescription;
    private List<SocialMediaHandle> socialMediaHandles;
    private Long employeeCount;
    private List<ContentCreatorProfileJobPost> jobsPosted;
}
