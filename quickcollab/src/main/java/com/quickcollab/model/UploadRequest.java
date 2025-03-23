package com.quickcollab.model;

import com.quickcollab.converter.PlatformConverter;
import com.quickcollab.converter.TagConverter;
import com.quickcollab.converter.UploadTypeMappingConverter;
import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.MediaType;
import com.quickcollab.enums.Platform;
import com.quickcollab.enums.UploadRequestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UploadRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uploadRequestId;

    private String title;
    private String description;

    @Convert(converter = TagConverter.class)
    private List<String> tags=new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(length = 20000)
    @Convert(converter= PlatformConverter.class)
    private List<Platform> uploadTo;

    private UploadRequestStatus uploadRequestStatus;

    @ManyToOne
    private User requestedTo;

    @OneToOne
    private User requestedBy;

    private Date requestedOn;

    private String fileUrl;

    private MediaType mediaType;

    @Convert(converter = UploadTypeMappingConverter.class)
    private Map<Platform, ContentType> uploadTypeMapping;

}

