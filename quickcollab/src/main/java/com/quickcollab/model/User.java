package com.quickcollab.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.quickcollab.converter.*;
import com.quickcollab.enums.RegisterationMethod;
import com.quickcollab.enums.UserRole;
import com.quickcollab.dtos.response.user.ReportingUser;
import com.quickcollab.pojo.OfferDetail;
import com.quickcollab.pojo.SocialMediaHandle;
import com.quickcollab.pojo.JobHistory;
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

import java.util.ArrayList;
import java.util.Date;
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

    @JsonIgnore
    private String password;

    private String selfDescription = "";

    @Convert(converter = JobHistoryListConverter.class)
    private List<JobHistory> jobHistory = new ArrayList<>();

    @NotNull
    @Enumerated(EnumType.STRING)
    @JsonIgnore
    private RegisterationMethod registerationMethod;

    @NotNull
    @Enumerated(EnumType.STRING)
    @JsonIgnore
    private UserRole userRole;

    @NotNull
    @URL
    @Column(length = 2000)
    private String profilePicture = "";

    @OneToMany(mappedBy = "postedBy", fetch = FetchType.LAZY)
    private List<Job> jobsPosted = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY)
    private List<User> employees = new ArrayList<>();

    @ManyToMany(mappedBy = "applicants", fetch = FetchType.LAZY)
    private List<Job> appliedJobs = new ArrayList<>();

    @Convert(converter = SocialMediaHandleAttributeConverter.class)
    private List<SocialMediaHandle> socialMediaHandles = new ArrayList<>();

    @Convert(converter = ReportsToAttributeConverter.class)
    private ReportingUser reportsTo;

    @OneToMany(fetch = FetchType.LAZY)
    private List<JobOffer> offersReceived = new ArrayList<>();

    @NotNull
    private Boolean isServingNoticePeriod = Boolean.FALSE;
    private Date noticePeriodEndDate;

    @Convert(converter = JobHistoryConverter.class)
    private JobHistory currentJobDetails;

    private Long currentJobNoticePeriodDays;
    private Date currentJobJoinedOn;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Work> myProjects;

    @NotNull
    private Long currentSalary = 0L;

    @ManyToMany(mappedBy = "members", fetch = FetchType.LAZY)
    private List<Conversation> conversations = new ArrayList<>();
    public User(@NotNull @Email String emailId, String password, List<GrantedAuthority> userRoles) {

    }
}

