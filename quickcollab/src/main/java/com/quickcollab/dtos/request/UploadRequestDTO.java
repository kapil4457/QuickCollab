package com.quickcollab.dtos.request;

import com.quickcollab.converter.PlatformConverter;
import com.quickcollab.converter.TagConverter;
import com.quickcollab.converter.UploadTypeMappingConverter;
import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.MediaType;
import com.quickcollab.enums.Platform;
import com.quickcollab.enums.UploadRequestStatus;
import com.quickcollab.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UploadRequestDTO {
    private String title;
    private String description;
    private List<String> tags=new ArrayList<>();
    private List<Platform> uploadTo;
    private UploadRequestStatus uploadRequestStatus;
    private MultipartFile media;
    private Map<Platform, ContentType> uploadTypeMapping;
    private MediaType mediaType;
}
