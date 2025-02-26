package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.dtos.response.user.ReportingUser;
import com.quickcollab.pojo.JobHistory;
import com.quickcollab.pojo.MessageDetail;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter
public class MessageDetailConverter implements AttributeConverter<List<MessageDetail>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<MessageDetail> messageDetails) {
        try {
            System.out.println("Converting messageDetails to JSON: " + messageDetails);
            return objectMapper.writeValueAsString(messageDetails);
        } catch (JsonProcessingException jpe) {
            return "[]";
        }
    }

    @Override
    public List<MessageDetail> convertToEntityAttribute(String value) {
        try {
            System.out.println("Converting JSON to MessageDetails: " + value);
            return objectMapper.readValue(value, objectMapper.getTypeFactory().constructCollectionType(List.class, MessageDetail.class));
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
