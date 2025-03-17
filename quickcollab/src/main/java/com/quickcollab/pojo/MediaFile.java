package com.quickcollab.pojo;

import com.quickcollab.enums.MediaType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MediaFile {
    private String url;
    private MediaType type;
}
