package com.quickcollab.dtos.request;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MeetingCreateDTO {
    private String title;
    private String description;
    private List<String> members;
    private Date scheduledFor;
    private Date endsOn;
    private String adminId;
}
