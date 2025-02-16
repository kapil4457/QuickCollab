package com.quickcollab.dtos.response.job.contentCreator;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
public class ContentCreatorJobResponseDTO {
    private List<ContentCreatorJobDetailDTO> jobs;
    private String message;
    private Boolean success;
}

