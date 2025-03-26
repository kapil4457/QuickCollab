package com.quickcollab.utils;

import com.quickcollab.dtos.response.user.UploadTypeMappingItemList;
import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.Platform;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GeneralConfig {

    public List<UploadTypeMappingItemList> availableContentTypes(){
            Map<Platform , List<ContentType>> availableContentType = new HashMap<Platform , List<ContentType>>();
            List<UploadTypeMappingItemList> uploadTypeMappingItemLists = new ArrayList<>();
            UploadTypeMappingItemList uploadTypeMappingItemList = new UploadTypeMappingItemList();
            uploadTypeMappingItemList.setContentTypes(Arrays.asList(ContentType.VIDEO,ContentType.REEL,ContentType.MESSAGE));
            uploadTypeMappingItemList.setPlatform(Platform.YOUTUBE);
            uploadTypeMappingItemLists.add(uploadTypeMappingItemList);
            return uploadTypeMappingItemLists;

    }
}
