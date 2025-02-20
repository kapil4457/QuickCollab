package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.pojo.OfferDetail;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter
public class OfferDetailsConverter implements AttributeConverter<List<OfferDetail>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<OfferDetail> offerDetails) {
        try {
            return objectMapper.writeValueAsString(offerDetails);
        } catch (JsonProcessingException jpe) {
            return "[]";
        }
    }

    @Override
    public List<OfferDetail> convertToEntityAttribute(String value) {
        try {
            return objectMapper.readValue(value, objectMapper.getTypeFactory().constructCollectionType(List.class, OfferDetail.class));
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
