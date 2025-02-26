package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.pojo.JobHistory;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter
public class JobHistoryListConverter implements AttributeConverter<List<JobHistory>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<JobHistory> jobHistory) {
        try {
            System.out.println("Converting JobHistory to JSON: " + jobHistory);
            return objectMapper.writeValueAsString(jobHistory);
        } catch (JsonProcessingException jpe) {
            return "[]";
        }
    }

    @Override
    public List<JobHistory> convertToEntityAttribute(String value) {
        try {
            System.out.println("Converting JSON to JobHistory: " + value);
            return objectMapper.readValue(value, objectMapper.getTypeFactory().constructCollectionType(List.class, JobHistory.class));
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
