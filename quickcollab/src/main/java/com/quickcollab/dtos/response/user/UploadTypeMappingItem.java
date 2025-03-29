package com.quickcollab.dtos.response.user;

import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.Platform;
import com.quickcollab.enums.UploadRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UploadTypeMappingItem {
    public Platform platform;
    public ContentType contentType;
    public UploadRequestStatus status;
}
