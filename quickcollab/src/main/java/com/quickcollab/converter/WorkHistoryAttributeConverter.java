package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.pojo.OfferDetail;
import com.quickcollab.pojo.WorkHistory;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter
public class WorkHistoryAttributeConverter implements AttributeConverter<List<WorkHistory>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<WorkHistory> workHistory) {
        try {
            return objectMapper.writeValueAsString(workHistory);
        } catch (JsonProcessingException jpe) {
            return "[]";
        }
    }

    @Override
    public List<WorkHistory> convertToEntityAttribute(String value) {
        try {
            return objectMapper.readValue(value, objectMapper.getTypeFactory().constructCollectionType(List.class, WorkHistory.class));
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
