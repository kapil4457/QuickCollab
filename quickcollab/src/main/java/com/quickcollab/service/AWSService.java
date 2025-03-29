package com.quickcollab.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.dtos.request.IngestionRequestDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;
import software.amazon.awssdk.services.sqs.model.SendMessageResponse;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AWSService {
    private final S3Client s3Client;
    private final ObjectMapper objectMapper;
    private final SqsClient sqsClient;




    //    S3 Config
    @Value("${aws.s3.bucket.name}")
    private String bucketName;

    @Value("${aws.cloudfront.distribution}")
    private String cloudFrontDistribution;

// SQS Config

    @Value("${aws.sqs.url}")
    private String sqsQueueUrl;


    public AWSService(SqsClient sqsClient,S3Client s3Client, ObjectMapper objectMapper) {
        this.s3Client = s3Client;
        this.objectMapper = objectMapper;
        this.sqsClient=sqsClient;
    }

    public String s3MediaUploader(String folderName,String authUserId, String contentType, MultipartFile file) throws IOException {
        UUID uuid = UUID.randomUUID();
        Map<String, String> metadata = new HashMap<>();
        metadata.put("userId", authUserId);
        metadata.put("Date", new Date().toString());
        String key = uuid.toString();
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(folderName+"/" + key)
                .metadata(metadata)
                .contentDisposition("inline")
                .contentType(contentType)
                .build();
        s3Client.putObject(putObjectRequest,
                RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        return key;
    }

    public void s3MediaDelete(String key){
        s3Client.deleteObject(builder -> {
            builder.bucket(bucketName);
            builder.key(key);
        });
    }

    public String extractKeyFromCloudFrontUrl(String url){
        return url.split(cloudFrontDistribution)[1];
    }

    public void ingestDataToSQS(IngestionRequestDTO ingestionRequestDTO) throws JsonProcessingException {

        String data = objectMapper.writeValueAsString(ingestionRequestDTO);
        SendMessageRequest sendMsgRequest = SendMessageRequest.builder()
                .queueUrl(sqsQueueUrl)
                .messageBody(data)
                .build();
        SendMessageResponse sendMsgResponse = sqsClient.sendMessage(sendMsgRequest);
        System.out.println("Message sent with ID: " + sendMsgResponse.messageId());


    }

}
