package com.quickcollab.service.provider;

import com.quickcollab.enums.ContentType;
import com.quickcollab.model.Provider;
import com.quickcollab.model.UploadRequest;
import com.quickcollab.model.User;

import java.io.IOException;

public abstract class ProviderImpl {
    public abstract void addProvider(String accessCode,String authUserId) throws IOException;
    public abstract Provider updateAccessToken(String authUserId) throws IOException;
    public abstract void uploadMedia(UploadRequest uploadRequest, ContentType contentType, User contentCreator) throws IOException;
}
