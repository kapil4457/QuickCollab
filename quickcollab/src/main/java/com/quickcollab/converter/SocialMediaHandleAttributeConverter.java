package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.pojo.SocialMediaHandle;
import com.quickcollab.pojo.WorkHistory;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class SocialMediaHandleAttributeConverter implements AttributeConverter<SocialMediaHandle, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(SocialMediaHandle socialMediaHandle) {
        try {
            return objectMapper.writeValueAsString(socialMediaHandle);
        } catch (JsonProcessingException jpe) {
            return null;
        }
    }

    @Override
    public SocialMediaHandle convertToEntityAttribute(String value) {
        try {
            return objectMapper.readValue(value, SocialMediaHandle.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }
}
