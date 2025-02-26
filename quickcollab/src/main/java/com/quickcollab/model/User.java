package com.quickcollab.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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


    private String selfDescription="";

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
    private String profilePicture="";

    @OneToMany(fetch = FetchType.EAGER)
    @JsonBackReference
    private List<User> employees=new ArrayList<>();


    @OneToMany(fetch = FetchType.EAGER)
    @JsonBackReference
    private List<Conversation> conversations = new ArrayList<>();

    @OneToMany(fetch = FetchType.EAGER)
    @JsonBackReference
    private List<Work> works = new ArrayList<>();

    @OneToMany(fetch = FetchType.EAGER)
    @JsonBackReference
    private List<Job> appliedJobs = new ArrayList<>();

    @OneToMany(fetch = FetchType.EAGER)
    @JsonBackReference
    private List<Job> jobsPosted =  new ArrayList<>();

    @Convert(converter = SocialMediaHandleAttributeConverter.class)
    private List<SocialMediaHandle> socialMediaHandles = new ArrayList<>();

    @Convert(converter = ReportsToAttributeConverter.class)
    private ReportingUser reportsTo;

    @Convert(converter = OfferDetailsConverter.class)
    private List<OfferDetail> offersReceived =  new ArrayList<>();

    @NotNull
    private Boolean isServingNoticePeriod=Boolean.FALSE;
    private Date noticePeriodEndDate;

    @Convert(converter = JobHistoryConverter.class)
    private JobHistory currentJobDetails;

    private Long currentJobNoticePeriodDays;
    private Date currentJobJoinedOn;
    @NotNull
    private Long currentSalary = 0L;

    public User(@NotNull @Email String emailId, String password, List<GrantedAuthority> userRoles) {

    }
}

