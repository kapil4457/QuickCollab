package com.quickcollab.dtos.request;

import com.quickcollab.pojo.ExternalLink;
import com.quickcollab.pojo.MediaFile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProjectDetailsRequestStringifiedDTO {
    private String title;
    private String description;
    private List<MultipartFile> mediaFiles;
    private String externalLinks;
    private String existingMedia;
}

