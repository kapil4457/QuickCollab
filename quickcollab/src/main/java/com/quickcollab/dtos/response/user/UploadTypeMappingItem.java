package com.quickcollab.dtos.response.user;

import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.Platform;
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
}
