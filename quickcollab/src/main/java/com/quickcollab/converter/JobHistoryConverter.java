package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.dtos.response.user.ReportingUser;
import com.quickcollab.pojo.JobHistory;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class JobHistoryConverter implements AttributeConverter<JobHistory, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(JobHistory reportingUser) {
        try {
            return objectMapper.writeValueAsString(reportingUser);
        } catch (JsonProcessingException jpe) {
            return null;
        }
    }

    @Override
    public JobHistory convertToEntityAttribute(String value) {
        try {
            return objectMapper.readValue(value, JobHistory.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
