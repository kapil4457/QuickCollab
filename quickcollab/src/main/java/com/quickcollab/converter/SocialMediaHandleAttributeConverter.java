package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.pojo.SocialMediaHandle;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter
public class SocialMediaHandleAttributeConverter implements AttributeConverter<List<SocialMediaHandle>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<SocialMediaHandle> socialMediaHandle) {
        try {
            return objectMapper.writeValueAsString(socialMediaHandle);
        } catch (JsonProcessingException jpe) {
            return "[]";
        }
    }

    @Override
    public List<SocialMediaHandle> convertToEntityAttribute(String value) {
        try {
            return objectMapper.readValue(value, objectMapper.getTypeFactory().constructCollectionType(List.class, SocialMediaHandle.class));
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
