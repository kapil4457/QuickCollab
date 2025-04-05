package com.quickcollab.pojo;

import com.quickcollab.converter.ReportsToAttributeConverter;
import com.quickcollab.dtos.response.user.ReportingUser;
import com.quickcollab.enums.JobLocationType;
import com.quickcollab.enums.UserRole;
import jakarta.persistence.Convert;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.util.Date;

@Valid
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobHistory {
    public Long jobId;
    @NotNull
    @Length(min=3)
    public String title;
    @NotNull
    public Date startDate;
    public Date endDate;
    @NotNull
    @Length(min=2)
    public String location;
    public Long salary;
    @NotNull
    public JobLocationType locationType;
    @NotNull
    @Convert(converter = ReportsToAttributeConverter.class)
    public ReportingUser reportingUser;
}
