package com.quickcollab.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.quickcollab.enums.JobLocationType;
import com.quickcollab.enums.JobStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private String jobName;

    @NotNull
    private String jobDescription;

    @NotNull
    @Enumerated(EnumType.STRING)
    private JobStatus jobStatus;

    @NotNull
    @Min(value = 1)
    private Long openingsCount;

    @NotNull
    @Enumerated(EnumType.STRING)
    private JobLocationType jobLocationType;

    @OneToMany
    @JsonManagedReference
    private List<User> applicants;

    @NotNull
    private String jobLocation;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "posted_by")
    private User postedBy;

    @NotNull
    @NotNull
    private Date postedOn;


    @NotNull
    @ManyToOne
    @JoinColumn(name="updated_by")
    private User updatedBy;

    @NotNull
    private Date updatedOn;


}
