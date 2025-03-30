package com.quickcollab.service.provider;

import com.quickcollab.enums.ContentType;
import com.quickcollab.enums.Platform;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.model.Provider;
import com.quickcollab.model.UploadRequest;
import com.quickcollab.model.User;
import com.quickcollab.repository.ProviderRepository;
import com.quickcollab.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

@Service
public class FacebookProvider extends ProviderImpl {

    public final RestTemplate restTemplate;
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;

    @Value("${facebook.client.secret}")
    private String clientSecret;

    @Value("${facebook.app.id}")
    private String appId;

    public FacebookProvider(RestTemplate restTemplate, UserRepository userRepository, ProviderRepository providerRepository) {
        this.restTemplate = restTemplate;
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
    }

    @Override
    public void addProvider(String accessCode, String authUserId) throws IOException {
        try {
            User contentCreator = userRepository.findById(authUserId).orElseThrow(()-> new ResourceNotFoundException("User","id",authUserId));

            String uri = UriComponentsBuilder.fromUriString("https://graph.facebook.com/v12.0/oauth/access_token")
                .queryParam("grant_type", "fb_exchange_token")
                .queryParam("client_id", appId)
                .queryParam("client_secret", clientSecret)
                .queryParam("fb_exchange_token", accessCode)
                .toUriString();
            ResponseEntity<Map> response = restTemplate.getForEntity(uri, Map.class);
            Map<String, Object> responseBody = response.getBody();
            String accessToken = (String) responseBody.get("access_token");
            Integer expiresIn = (Integer) responseBody.get("expires_in");


        Provider provider = new Provider();
        provider.setAccessToken(accessToken);
        provider.setRefreshToken("");
        Date expiresAt = new Date(System.currentTimeMillis() + (expiresIn * 1000L));
        provider.setExpires(expiresAt);
        provider.setName(Platform.FACEBOOK);
        provider.setUser(contentCreator);
        Provider savedProvider = providerRepository.save(provider);
        contentCreator.getProviders().add(savedProvider);
        userRepository.save(contentCreator);
        } catch (RestClientException e) {
            throw new GenericError(e.getMessage());
        }
    }

    @Override
    public Provider updateAccessToken(String authUserId) throws IOException {
        return null;
    }

    @Override
    public void uploadMedia(UploadRequest uploadRequest, ContentType contentType, User contentCreator) throws IOException {

    }
}
