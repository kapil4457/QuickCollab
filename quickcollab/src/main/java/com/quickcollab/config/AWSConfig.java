package com.quickcollab.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;


@Configuration
public class AWSConfig {


    @Value("${aws.s3.region.name}")
    private String s3Region;
    @Value("${aws.access.id}")
    private String accessKeyId;
    @Value("${aws.secret.access.key}")
    private String secretAccessKeyId;

    @Bean
    S3Client s3Client() {
    AwsCredentials credentials = AwsBasicCredentials.create(accessKeyId, secretAccessKeyId);
        return S3Client
                .builder()
                .region(Region.of(s3Region))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();
    }

}
