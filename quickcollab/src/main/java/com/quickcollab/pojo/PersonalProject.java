package com.quickcollab.pojo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PersonalProject {
    private Long projectId;
    private String title;
    private String description;
    private List<MediaFile> mediaFiles;
    private List<ExternalLink> externalLinks;
}
