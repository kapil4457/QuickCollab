package com.quickcollab.dtos.request;
import com.quickcollab.dtos.response.user.UploadTypeMappingItem;
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
    private List<UploadTypeMappingItem> uploadTypeMapping;
    private MediaType mediaType;
}
