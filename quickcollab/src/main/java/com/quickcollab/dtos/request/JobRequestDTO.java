package com.quickcollab.dtos.request;

import com.quickcollab.enums.JobLocationType;
import com.quickcollab.enums.JobStatus;
import com.quickcollab.model.User;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
public class JobRequestDTO {
    private String jobName;
    private String jobDescription;
    private JobStatus jobStatus;
    private Long openingsCount;
    private JobLocationType jobLocationType;
    private List<User> applicants;
    private String jobLocation;
    private User postedBy;
    private Date postedOn;
}
