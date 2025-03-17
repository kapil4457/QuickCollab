package com.quickcollab.dtos.request;

import com.quickcollab.converter.ExternalLinkAttributeConverter;
import com.quickcollab.converter.MediaFileAttributeConverter;
import com.quickcollab.pojo.ExternalLink;
import com.quickcollab.pojo.MediaFile;
import jakarta.persistence.Convert;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class ProjectDetailsRequestDTO {
    private String title;
    private String description;
    private List<MultipartFile> mediaFiles;
    private List<ExternalLink> externalLinks;
    private List<MediaFile> existingMedia;
}

