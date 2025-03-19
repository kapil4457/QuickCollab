package com.quickcollab.model;

import com.quickcollab.converter.ExternalLinkAttributeConverter;
import com.quickcollab.converter.MediaFileAttributeConverter;
import com.quickcollab.pojo.ExternalLink;
import com.quickcollab.pojo.MediaFile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Work {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workId;
    @ManyToOne
    private User user;
    @Column(length = 2000)
    private String title;
    @Column(length = 2000)
    private String description;
    @Convert(converter = MediaFileAttributeConverter.class)
    private List<MediaFile> mediaFiles;
    @Convert(converter = ExternalLinkAttributeConverter.class)
    private List<ExternalLink> externalLinks;
}
