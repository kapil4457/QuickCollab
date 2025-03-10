package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.enums.Platform;
import com.quickcollab.pojo.CallLog;
import com.quickcollab.pojo.JobHistory;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;


@Converter
public class PlatformConverter implements AttributeConverter<List<Platform>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<Platform> platforms) {
        try {
            return objectMapper.writeValueAsString(platforms);
        } catch (JsonProcessingException jpe) {
            return "[]";
        }
    }

    @Override
    public List<Platform> convertToEntityAttribute(String value) {
        try {
            return objectMapper.readValue(value, objectMapper.getTypeFactory().constructCollectionType(List.class, Platform.class));
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
