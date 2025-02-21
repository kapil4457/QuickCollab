package com.quickcollab.dtos.response.job.contentCreator;

import com.quickcollab.dtos.response.user.ContentCreatorEmployee;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContentCreatorJobPost {
private Long jobId;
private String jobName;
private String jobDescription;
private String jobStatus;
private Long openingsCount;
private String jobLocationType;
private List<ContentCreatorEmployee> applicants;
}
