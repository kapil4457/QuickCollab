package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.Platform;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.HashMap;
import java.util.Map;


@Converter
public class UploadTypeMappingConverter implements AttributeConverter<Map<Platform, ContentType>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<Platform, ContentType> uploadTypeMapping) {
        try {
            System.out.println("Converting uploadTypeMapping to JSON: " + uploadTypeMapping);
            return objectMapper.writeValueAsString(uploadTypeMapping);
        } catch (JsonProcessingException jpe) {
            return "{}";
        }
    }

    @Override
    public Map<Platform, ContentType> convertToEntityAttribute(String value) {
        try {
            System.out.println("Converting JSON to uploadTypeMapping: " + value);
            return objectMapper.readValue(value, new TypeReference<Map<Platform, ContentType>>() {});        } catch (JsonProcessingException e) {
            return new HashMap<>();
        }
    }
}
