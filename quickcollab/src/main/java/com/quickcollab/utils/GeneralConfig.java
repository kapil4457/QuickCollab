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
            UploadTypeMappingItemList youtubeUploadTypeMappingItemList = new UploadTypeMappingItemList();
            youtubeUploadTypeMappingItemList.setContentTypes(Arrays.asList(ContentType.VIDEO));
            youtubeUploadTypeMappingItemList.setPlatform(Platform.YOUTUBE);


            UploadTypeMappingItemList facebookUploadTypeMappingItemList = new UploadTypeMappingItemList();
            facebookUploadTypeMappingItemList.setContentTypes(Arrays.asList(ContentType.VIDEO));
            facebookUploadTypeMappingItemList.setPlatform(Platform.FACEBOOK);



            uploadTypeMappingItemLists.add(youtubeUploadTypeMappingItemList);
            uploadTypeMappingItemLists.add(facebookUploadTypeMappingItemList);
            return uploadTypeMappingItemLists;

    }
}
