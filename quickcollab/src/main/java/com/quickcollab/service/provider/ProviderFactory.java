package com.quickcollab.service.provider;

import com.quickcollab.enums.Platform;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProviderFactory {

    private final YoutubeProvider youtubeProvider;
    private final FacebookProvider facebookProvider;


   public ProviderImpl getProvider(Platform providerName) {
       switch (providerName){
           case YOUTUBE -> {
               return youtubeProvider;
           }
           case FACEBOOK -> {
               return facebookProvider;
           }
       }
       return null;
   }
}
