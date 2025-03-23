package com.quickcollab.dtos.request;

import com.quickcollab.enums.Platform;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddProviderDTO {
    private Platform name;
    private String accessCode;
}
