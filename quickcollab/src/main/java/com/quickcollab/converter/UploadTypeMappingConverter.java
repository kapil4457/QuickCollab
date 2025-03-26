package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.dtos.response.user.UploadTypeMappingItem;
import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.Platform;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Converter
public class UploadTypeMappingConverter implements AttributeConverter<List<UploadTypeMappingItem>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<UploadTypeMappingItem> uploadTypeMapping) {
        try {
            return objectMapper.writeValueAsString(uploadTypeMapping);
        } catch (JsonProcessingException jpe) {
            return "[]";
        }
    }

    @Override
    public List<UploadTypeMappingItem> convertToEntityAttribute(String value) {
        try {
            return objectMapper.readValue(value, new TypeReference<List<UploadTypeMappingItem>>() {});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
