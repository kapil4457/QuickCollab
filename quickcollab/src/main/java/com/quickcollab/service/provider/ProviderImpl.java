package com.quickcollab.service.provider;

import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.model.Provider;
import com.quickcollab.model.UploadRequest;
import com.quickcollab.model.User;

import java.io.IOException;
import java.util.Map;

public abstract class ProviderImpl {
    public abstract void addProvider(String accessCode,String authUserId) throws IOException;
    public abstract Provider updateAccessToken(String authUserId) throws IOException;

    public abstract  ResponseDTO uploadMedia(UploadRequest uploadRequest, User contentCreator) throws IOException;
}
