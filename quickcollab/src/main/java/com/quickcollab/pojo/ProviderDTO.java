package com.quickcollab.pojo;

import com.quickcollab.enums.Platform;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProviderDTO {
    private Platform providerName;
}
