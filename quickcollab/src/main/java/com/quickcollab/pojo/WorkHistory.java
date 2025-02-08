package com.quickcollab.pojo;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Valid
public class WorkHistory {

    @NotNull
    @Length(min=3)
    public String title;

    @NotNull
    @Length(min=3)
    public String description;

    @NotNull
    public LocalDate startDate;

    @NotNull
    public LocalDate endDate;

    @NotNull
    @Length(min=2)
    public String location;

}
