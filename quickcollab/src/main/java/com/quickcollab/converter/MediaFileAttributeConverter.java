package com.quickcollab.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.pojo.MediaFile;
import com.quickcollab.pojo.SocialMediaHandle;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.ArrayList;
import java.util.List;

@Converter
public class MediaFileAttributeConverter implements AttributeConverter<List<MediaFile>, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<MediaFile> mediaFiles) {
        try {
            return objectMapper.writeValueAsString(mediaFiles);
        } catch (JsonProcessingException jpe) {
            return "[]";
        }
    }

    @Override
    public List<MediaFile> convertToEntityAttribute(String value) {
        try {
            return objectMapper.readValue(value, objectMapper.getTypeFactory().constructCollectionType(List.class, MediaFile.class));
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
