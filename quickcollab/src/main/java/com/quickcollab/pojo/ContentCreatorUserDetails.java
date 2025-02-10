package com.quickcollab.pojo;

import com.quickcollab.enums.UserRole;
import com.quickcollab.model.Conversation;
import com.quickcollab.model.Job;
import com.quickcollab.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContentCreatorUserDetails {
    private String firstName;
    private String lastName;
    private String emailId;
    private String profilePicture;
    private String selfDescription;
    private List<Conversation> conversations;
    private List<SocialMediaHandle> socialMediaHandles;
    private List<User> employees;
    private List<Job> jobsPosted;
    private UserRole userRole;


}
