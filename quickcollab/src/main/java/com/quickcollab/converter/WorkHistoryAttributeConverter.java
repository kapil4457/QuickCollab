package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.pojo.WorkHistory;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class WorkHistoryAttributeConverter implements AttributeConverter<WorkHistory, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(WorkHistory workHistory) {
        try {
            return objectMapper.writeValueAsString(workHistory);
        } catch (JsonProcessingException jpe) {
            return null;
        }
    }

    @Override
    public WorkHistory convertToEntityAttribute(String value) {
        try {
            return objectMapper.readValue(value, WorkHistory.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
