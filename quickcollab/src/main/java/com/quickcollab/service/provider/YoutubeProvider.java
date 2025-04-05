package com.quickcollab.service.provider;
import com.google.api.client.auth.oauth2.TokenRequest;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.quickcollab.dtos.request.IngestionRequestDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.Platform;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.model.Provider;
import com.quickcollab.model.UploadRequest;
import com.quickcollab.model.User;
import com.quickcollab.repository.ProviderRepository;
import com.quickcollab.repository.UserRepository;
import com.quickcollab.service.AWSService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringReader;
import java.util.*;


@Service
public class YoutubeProvider extends ProviderImpl {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final AWSService awsService;
    @Value("${youtube.client.secret}")
    private String clientSecret;

    @Value("${youtube.client.id}")
    private String clientId;


    private static final String TOKEN_URI = "https://oauth2.googleapis.com/token";
    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final JsonFactory JSON_FACTORY = new GsonFactory();

    public YoutubeProvider(UserRepository userRepository, ProviderRepository providerRepository,AWSService awsService) {
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
        this.awsService=awsService;
    }


    @Override
    public void addProvider(String accessCode,String authUserId) throws IOException {
        String clientSecretJson = "{ \"installed\": { \"client_id\": \""+clientId+"\", \"client_secret\": \""+clientSecret+"\" } }";
        User user = userRepository.findById(authUserId).orElseThrow(()-> new ResourceNotFoundException("User","id",authUserId));
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new StringReader(clientSecretJson));

        TokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                HTTP_TRANSPORT,
                JSON_FACTORY,
                TOKEN_URI,
                clientSecrets.getDetails().getClientId(),
                clientSecrets.getDetails().getClientSecret(),
                accessCode,
                "postmessage")
                .execute();
        String accessToken = tokenResponse.getAccessToken();
        String refreshToken = tokenResponse.getRefreshToken();

        Provider provider = new Provider();
        provider.setAccessToken(accessToken);
        provider.setRefreshToken(refreshToken);
        Date expiresAt = new Date(System.currentTimeMillis() + (tokenResponse.getExpiresInSeconds() * 1000L));
        provider.setExpires(expiresAt);
        provider.setName(Platform.YOUTUBE);
        provider.setUser(user);
        Provider savedProvider = providerRepository.save(provider);
        user.getProviders().add(savedProvider);
        userRepository.save(user);
    }

    @Override
    public Provider updateAccessToken(String authUserId) throws IOException {
        User user = userRepository.findById(authUserId).orElseThrow(()-> new ResourceNotFoundException("User","id",authUserId));
        List<Provider> providers = providerRepository.findByUser(user);
        List<Provider> youtubeProviders = providers.stream().filter(provider -> provider.getName().equals(Platform.YOUTUBE)).toList();
        if(youtubeProviders.isEmpty()) {
            throw new ResourceNotFoundException("Provider","name",Platform.YOUTUBE.toString());
        }
        Provider youtubeProvider = youtubeProviders.get(0);

        TokenResponse tokenResponse = new TokenRequest(
                HTTP_TRANSPORT,
                JSON_FACTORY,
                new GenericUrl(TOKEN_URI),
                "refresh_token")
                .set("client_id", clientId)
                .set("client_secret", clientSecret)
                .set("refresh_token", youtubeProvider.getRefreshToken())
                .set("grant_type", "refresh_token")
                .execute();

        String newAccessToken = tokenResponse.getAccessToken();
        Long expiresInSeconds = tokenResponse.getExpiresInSeconds();
        youtubeProvider.setAccessToken(newAccessToken);
        Date expiresAt = new Date(System.currentTimeMillis() + (expiresInSeconds * 1000L));
        youtubeProvider.setExpires(expiresAt);
        return providerRepository.save(youtubeProvider);
    }

    @Override
    public void uploadMedia(UploadRequest uploadRequest , ContentType contentType, User contentCreator) throws IOException {

        List<Provider> providers =  contentCreator.getProviders();
        List<Provider> youtubeProviders = providers.stream().filter(provider -> provider.getName().equals(Platform.YOUTUBE)).toList();
        if(youtubeProviders.isEmpty()) {
            throw new ResourceNotFoundException("Provider","name",Platform.YOUTUBE.toString());
        }
        Provider youtubeProvider = youtubeProviders.get(0);

        Date tokenExpiry =youtubeProvider.getExpires();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(tokenExpiry);
        calendar.add(Calendar.MINUTE, -30);
        Date adjustedExpiry = calendar.getTime();
        Date now = new Date();
        if(now.after(adjustedExpiry)) {
            youtubeProvider =   updateAccessToken(contentCreator.getUserId());

        }

        IngestionRequestDTO ingestionRequestDTO = new IngestionRequestDTO();
        ingestionRequestDTO.setDescription(uploadRequest.getDescription());
        ingestionRequestDTO.setPlatform(Platform.YOUTUBE);
        ingestionRequestDTO.setTags(uploadRequest.getTags());
        ingestionRequestDTO.setMediaType(uploadRequest.getMediaType());
        ingestionRequestDTO.setTitle(uploadRequest.getTitle());
        ingestionRequestDTO.setUploadRequestId(uploadRequest.getUploadRequestId());
        ingestionRequestDTO.setFileUrl(uploadRequest.getFileUrl());
        ingestionRequestDTO.setContentType(contentType);
        ingestionRequestDTO.setAccessToken(youtubeProvider.getAccessToken());
        awsService.ingestDataToSQS(ingestionRequestDTO);
        new ResponseDTO("Media uploaded successfully", true);
    }


}
