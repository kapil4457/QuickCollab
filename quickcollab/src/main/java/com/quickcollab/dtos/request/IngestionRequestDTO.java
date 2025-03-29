package com.quickcollab.dtos.request;

import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.MediaType;
import com.quickcollab.enums.Platform;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IngestionRequestDTO {

    private String accessToken;
    private String fileUrl;
    private MediaType mediaType;
    private Long uploadRequestId;
    private List<String> tags;
    private String description;
    private String title;
    private Platform platform;
    private ContentType contentType;

}
