package com.quickcollab.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.sqs.SqsClient;

@Configuration
public class AWSConfig {


    @Value("${aws.s3.region.name}")
    private String s3Region;
    @Value("${aws.access.id}")
    private String accessKeyId;
    @Value("${aws.secret.access.key}")
    private String secretAccessKeyId;

    @Bean
    AwsBasicCredentials awsBasicCredentials() {
    return AwsBasicCredentials.create(accessKeyId, secretAccessKeyId);
    }

    @Bean
    S3Client s3Client() {
        return S3Client
                .builder()
                .region(Region.of(s3Region))
                .credentialsProvider(StaticCredentialsProvider.create(awsBasicCredentials()))
                .build();
    }


    @Bean
    public SqsClient sqsClient() {
        return SqsClient.builder()
                .credentialsProvider(StaticCredentialsProvider.create(awsBasicCredentials()))
                .region(Region.US_EAST_1)
                .build();
    }

}
