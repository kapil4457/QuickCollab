package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.pojo.CallLog;
import com.quickcollab.pojo.MessageDetail;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter
public class CallLogConverter implements AttributeConverter<List<CallLog>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<CallLog> callLogs) {
        try {
            return objectMapper.writeValueAsString(callLogs);
        } catch (JsonProcessingException jpe) {
            return "[]";
        }
    }

    @Override
    public List<CallLog> convertToEntityAttribute(String value) {
        try {
            return objectMapper.readValue(value, objectMapper.getTypeFactory().constructCollectionType(List.class, CallLog.class));
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
