package com.quickcollab.dtos.response.user;

import com.quickcollab.enums.ContentType;
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
public class UploadTypeMappingItemList {
    public Platform platform;
    public List<ContentType> contentTypes;
}
