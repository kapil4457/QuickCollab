package com.quickcollab.dtos.response.user;

import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.MediaType;
import com.quickcollab.enums.Platform;
import com.quickcollab.enums.UploadRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UploadRequestResponseDTO {
    private String title;
    private String description;
    private List<String> tags=new ArrayList<>();
    private List<Platform> uploadTo;
    private UploadRequestStatus uploadRequestStatus;
    private String mediaUrl;
    private List<UploadTypeMappingItem> uploadTypeMapping;
    private MediaType mediaType;
}
