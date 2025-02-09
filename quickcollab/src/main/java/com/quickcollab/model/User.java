package com.quickcollab.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.quickcollab.converter.WorkHistoryAttributeConverter;
import com.quickcollab.enums.RegisterationMethod;
import com.quickcollab.enums.UserRole;
import com.quickcollab.pojo.WorkHistory;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.URL;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;


import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true) // Ignore unknown JSON properties
@Table(name = "Participant")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String userId;


    @NotNull
    @Length(min = 2)
    private String firstName;

    @NotNull
    @Length(min = 2)
    private String lastName;

    @NotNull
    @Email
    private String emailId;

    private String password;

    private String selfDescription;

    @Convert(converter = WorkHistoryAttributeConverter.class)
    private List<WorkHistory> workHistory;

    @NotNull
    private RegisterationMethod registerationMethod;

    @NotNull
    private UserRole userRole;

    @NotNull
    @URL
    private String profilePicture;

    @OneToMany
    private List<User> employees;

    @OneToMany
    private List<Conversation> conversations;

    @OneToMany
    private List<Work> works;

    @OneToMany
    private List<Job> appliedJobs;

    @OneToMany
    private List<Job> jobsPosted;


    public User(@NotNull @Email String emailId, String password, List<GrantedAuthority> userRoles) {

    }
}

