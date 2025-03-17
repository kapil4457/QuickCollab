package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.pojo.ExternalLink;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter
public class ExternalLinkAttributeConverter implements AttributeConverter<List<ExternalLink>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<ExternalLink> externalLinks) {
        try {
            return objectMapper.writeValueAsString(externalLinks);
        } catch (JsonProcessingException jpe) {
            return "[]";
        }
    }

    @Override
    public List<ExternalLink> convertToEntityAttribute(String value) {
        try {
            return objectMapper.readValue(value, objectMapper.getTypeFactory().constructCollectionType(List.class, ExternalLink.class));
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
