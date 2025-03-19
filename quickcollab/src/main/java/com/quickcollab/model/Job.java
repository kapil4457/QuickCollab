package com.quickcollab.model;


import com.quickcollab.enums.JobLocationType;
import com.quickcollab.enums.JobStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;

    @NotNull
    @Column(length = 2000)
    private String jobName;

    @NotNull
    @Column(length = 2000)
    private String jobDescription;

    @NotNull
    @Enumerated(EnumType.STRING)
    private JobStatus jobStatus;

    @NotNull
    private Long openingsCount;

    @NotNull
    @Enumerated(EnumType.STRING)
    private JobLocationType jobLocationType;

    @ManyToMany
    @JoinTable(
            name = "job_applicants",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> applicants = new ArrayList<>();

    @NotNull
    @Column(length = 2000)
    private String jobLocation;

//    @Convert(converter = OfferDetailsConverter.class)
    @OneToMany
    private List<JobOffer> offeredTo = new ArrayList<>();

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by")
    private User postedBy;

    @NotNull
    private Date postedOn;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @NotNull
    private Date updatedOn;

    @NotNull
    private Long noticePeriodDays;

}
