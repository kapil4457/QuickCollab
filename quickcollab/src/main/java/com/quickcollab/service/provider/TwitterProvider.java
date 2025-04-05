package com.quickcollab.service.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.auth.oauth2.TokenRequest;
import com.google.api.client.auth.oauth2.TokenResponse;
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
import org.hibernate.sql.Update;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;


import java.io.*;
import java.net.*;


@Service
public class TwitterProvider extends ProviderImpl {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final AWSService awsService;
    private final ObjectMapper objectMapper;
    @Value("${twitter.client.secret}")
    private String clientSecret;

    @Value("${twitter.client.id}")
    private String clientId;

    @Value("${twitter.redirect.url}")
    private String redirectUrl;

    @Value("${twitter.code.challenge}")
    private String codeChallenge;

    private static  String TOKEN_URI = "https://api.x.com/2/oauth2/token";

    private static  HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static  JsonFactory JSON_FACTORY = new GsonFactory();

    public TwitterProvider(UserRepository userRepository, ProviderRepository providerRepository, AWSService awsService,ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
        this.awsService=awsService;
        this.objectMapper = objectMapper;
    }


    @Override
    public void addProvider(String accessCode,String authUserId) throws IOException {
        User user = userRepository.findById(authUserId).orElseThrow(()-> new ResourceNotFoundException("User","id",authUserId));
        URL url = new URL(TOKEN_URI);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        String auth = clientId + ":" + clientSecret;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
        connection.setRequestProperty("Authorization", "Basic " + encodedAuth);


        String body = "code=" + URLEncoder.encode(accessCode, StandardCharsets.UTF_8)
                    + "&grant_type=authorization_code"
                    + "&client_id=" + URLEncoder.encode(clientId, StandardCharsets.UTF_8)
                    + "&redirect_uri=" + URLEncoder.encode(redirectUrl, StandardCharsets.UTF_8)
                    + "&code_verifier="+URLEncoder.encode(codeChallenge, StandardCharsets.UTF_8);

        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = body.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        // Read the response
        try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
//            Save the Provider Info
        JsonNode jsonNode = objectMapper.readTree(response.toString());
        Provider provider = new Provider();
        provider.setAccessToken(jsonNode.get("access_token").asText());
        provider.setRefreshToken(jsonNode.get("refresh_token").asText());
        Date expiresAt = new Date(System.currentTimeMillis() + (jsonNode.get("expires_in").asInt() * 1000L));
        provider.setExpires(expiresAt);
        provider.setName(Platform.TWITTER);
        provider.setUser(user);
        Provider savedProvider = providerRepository.save(provider);
        user.getProviders().add(savedProvider);
        userRepository.save(user);
        }


    }

    @Override
    public Provider updateAccessToken(String authUserId) throws IOException {
        User user = userRepository.findById(authUserId).orElseThrow(()-> new ResourceNotFoundException("User","id",authUserId));
        List<Provider> providers = providerRepository.findByUser(user);
        List<Provider> twitterProviders = providers.stream().filter(provider -> provider.getName().equals(Platform.TWITTER)).toList();
        if(twitterProviders.isEmpty()) {
            throw new ResourceNotFoundException("Provider","name",Platform.TWITTER.toString());
        }
        Provider twitterProvider = twitterProviders.get(0);
        URL url = new URL(TOKEN_URI);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        String auth = clientId + ":" + clientSecret;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
        connection.setRequestProperty("Authorization", "Basic " + encodedAuth);


        String body = "refresh_token=" + URLEncoder.encode(twitterProvider.getRefreshToken(), StandardCharsets.UTF_8)
                + "&grant_type=refresh_token";

        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = body.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        // Read the response
        try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            // Update the Provider Info
            JsonNode jsonNode = objectMapper.readTree(response.toString());
            twitterProvider.setAccessToken(jsonNode.get("access_token").asText());
            twitterProvider.setRefreshToken(jsonNode.get("refresh_token").asText());
            Date expiresAt = new Date(System.currentTimeMillis() + (jsonNode.get("expires_in").asInt() * 1000L));
            twitterProvider.setExpires(expiresAt);
            return providerRepository.save(twitterProvider);
        }

    }

    @Override
    public void uploadMedia(UploadRequest uploadRequest , ContentType contentType, User contentCreator) throws IOException {

        List<Provider> providers =  contentCreator.getProviders();
        List<Provider> twitterProviders = providers.stream().filter(provider -> provider.getName().equals(Platform.TWITTER)).toList();
        if(twitterProviders.isEmpty()) {
            throw new ResourceNotFoundException("Provider","name",Platform.TWITTER.toString());
        }
        Provider twitterProvider = twitterProviders.get(0);

        Date tokenExpiry =twitterProvider.getExpires();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(tokenExpiry);
        calendar.add(Calendar.MINUTE, -30);
        Date adjustedExpiry = calendar.getTime();
        Date now = new Date();
        if(now.after(adjustedExpiry)) {
            twitterProvider =   updateAccessToken(contentCreator.getUserId());
        }

        IngestionRequestDTO ingestionRequestDTO = new IngestionRequestDTO();
        ingestionRequestDTO.setDescription(uploadRequest.getDescription());
        ingestionRequestDTO.setPlatform(Platform.TWITTER);
        ingestionRequestDTO.setTags(uploadRequest.getTags());
        ingestionRequestDTO.setMediaType(uploadRequest.getMediaType());
        ingestionRequestDTO.setTitle(uploadRequest.getTitle());
        ingestionRequestDTO.setUploadRequestId(uploadRequest.getUploadRequestId());
        ingestionRequestDTO.setFileUrl(uploadRequest.getFileUrl());
        ingestionRequestDTO.setContentType(contentType);
        ingestionRequestDTO.setAccessToken(twitterProvider.getAccessToken());
        awsService.ingestDataToSQS(ingestionRequestDTO);
        new ResponseDTO("Media uploaded successfully", true);
    }

}
