package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.dtos.response.user.ReportingUser;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ReportsToAttributeConverter implements AttributeConverter<ReportingUser, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(ReportingUser workHistory) {
        try {
            return objectMapper.writeValueAsString(workHistory);
        } catch (JsonProcessingException jpe) {
            return null;
        }
    }

    @Override
    public ReportingUser convertToEntityAttribute(String value) {
        try {
            return objectMapper.readValue(value, ReportingUser.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
