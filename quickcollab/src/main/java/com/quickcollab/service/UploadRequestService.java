package com.quickcollab.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickcollab.dtos.request.UploadRequestDTO;
import com.quickcollab.dtos.request.UploadRequestStringifiedDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.dtos.response.user.UploadTypeMappingItem;
import com.quickcollab.enums.Platform;
import com.quickcollab.enums.UploadRequestStatus;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.model.UploadRequest;
import com.quickcollab.model.User;
import com.quickcollab.repository.UploadRequestRepository;
import com.quickcollab.repository.UserRepository;
import com.quickcollab.service.provider.ProviderFactory;
import com.quickcollab.service.provider.ProviderImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class UploadRequestService {
    private final UploadRequestRepository uploadRequestRepository;
    private final UserRepository userRepository;
    private final ProviderFactory providerFactory;
    private final AWSService awsService;
    private final ObjectMapper objectMapper;

    @Value("${aws.cloudfront.distribution}")
    private String cloudFrontDistribution;

    public UploadRequestService(ObjectMapper objectMapper,UploadRequestRepository uploadRequestRepository, UserRepository userRepository, ProviderFactory providerFactory,AWSService awsService, ObjectMapper jacksonObjectMapper) {
        this.uploadRequestRepository = uploadRequestRepository;
        this.userRepository = userRepository;
        this.providerFactory = providerFactory;
        this.awsService = awsService;
        this.objectMapper=objectMapper;

    }

    private UploadRequestDTO uploadRequestStringifiedToUploadRequestDTOConverter(UploadRequestStringifiedDTO uploadRequestStringifiedDTO) {
        UploadRequestDTO uploadRequestDTO = new UploadRequestDTO();
        uploadRequestDTO.setTitle(uploadRequestStringifiedDTO.getTitle());
        uploadRequestDTO.setDescription(uploadRequestStringifiedDTO.getDescription());
        uploadRequestDTO.setMedia(uploadRequestStringifiedDTO.getMedia());
        uploadRequestDTO.setMediaType(uploadRequestStringifiedDTO.getMediaType());
        uploadRequestDTO.setUploadRequestStatus(uploadRequestStringifiedDTO.getUploadRequestStatus());

        try {
            List<String> tags = objectMapper.readValue(uploadRequestStringifiedDTO.getTags(),
                    new TypeReference<List<String>>() {});
            uploadRequestDTO.setTags(tags);
        } catch (JsonProcessingException e) {
            throw new GenericError("Invalid tags format");
        }
        try {
            List<Platform> uploadTo = objectMapper.readValue(uploadRequestStringifiedDTO.getUploadTo(),
                    new TypeReference<List<Platform>>() {});
            uploadRequestDTO.setUploadTo(uploadTo);
        } catch (JsonProcessingException e) {
            throw new GenericError("Invalid uploadTo format");
        }
        try {
            List<UploadTypeMappingItem> uploadTypeMapping = objectMapper.readValue(uploadRequestStringifiedDTO.getUploadTypeMapping(),
                    new TypeReference<List<UploadTypeMappingItem>>() {});
            uploadRequestDTO.setUploadTypeMapping(uploadTypeMapping);
        } catch (JsonProcessingException e) {
            throw new GenericError("Invalid uploadTypeMapping format");
        }

        return uploadRequestDTO;

    }

    public ResponseDTO createUploadRequest(String authUserId , UploadRequestStringifiedDTO uploadRequestStringifiedDTO) throws IOException {
        User authUser = userRepository.findById(authUserId).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));
        User contentCreator = userRepository.findById(authUser.getReportsTo().getUserId()).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));
        if(authUserId.equals(contentCreator.getUserId())){
            throw new GenericError("You are not allowed to perform this operation");
        }
        UploadRequestDTO uploadRequestDTO = uploadRequestStringifiedToUploadRequestDTOConverter(uploadRequestStringifiedDTO);
        UploadRequest uploadRequest = new UploadRequest();
        uploadRequest.setRequestedBy(authUser);
        uploadRequest.setRequestedOn(new Date());
        uploadRequest.setRequestedTo(contentCreator);
        uploadRequest.setTags(uploadRequestDTO.getTags());
        uploadRequest.setDescription(uploadRequestDTO.getDescription());
        uploadRequest.setUploadTypeMapping(uploadRequestDTO.getUploadTypeMapping());
        uploadRequest.setTitle(uploadRequestDTO.getTitle());
        uploadRequest.setUploadTo(uploadRequestDTO.getUploadTo());
        uploadRequest.setMediaType(uploadRequestDTO.getMediaType());
        uploadRequest.setUploadRequestStatus(uploadRequestDTO.getUploadRequestStatus());
        String folderName = "upload-request";
        String mediaId =  awsService.s3MediaUploader(folderName,authUserId,uploadRequestDTO.getMedia().getContentType(),uploadRequestDTO.getMedia());
        String mediaUrl = cloudFrontDistribution + folderName + "/" + mediaId;
        uploadRequest.setFileUrl(mediaUrl);
        UploadRequest savedUploadRequest = uploadRequestRepository.save(uploadRequest);

        contentCreator.getUploadRequests().add(savedUploadRequest);
        userRepository.save(contentCreator);

        return new ResponseDTO("Upload request created successfully" , true);
        }

    public ResponseDTO updateUploadRequest(String authUserId , UploadRequestStringifiedDTO uploadRequestStringifiedDTO,Long uploadRequestId) throws IOException {
        User authUser = userRepository.findById(authUserId).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));
        User contentCreator = userRepository.findById(authUser.getReportsTo().getUserId()).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));
        UploadRequestDTO uploadRequestDTO = uploadRequestStringifiedToUploadRequestDTOConverter(uploadRequestStringifiedDTO);
        UploadRequest uploadRequest = uploadRequestRepository.findById(uploadRequestId).orElseThrow(()-> new ResourceNotFoundException("Upload Request","id",uploadRequestId.toString()));

        if(!uploadRequest.getRequestedBy().getUserId().equals(authUserId)){
            throw new GenericError("You are not allowed to perform this operation");
        }
        if(!uploadRequest.getRequestedTo().getUserId().equals(contentCreator.getUserId())){
            throw new GenericError("You are not allowed to perform this operation");
        }
        uploadRequest.setTags(uploadRequestDTO.getTags());
        uploadRequest.setDescription(uploadRequestDTO.getDescription());
        uploadRequest.setUploadTypeMapping(uploadRequestDTO.getUploadTypeMapping());
        uploadRequest.setTitle(uploadRequestDTO.getTitle());
        uploadRequest.setUploadTo(uploadRequestDTO.getUploadTo());
        uploadRequest.setUploadRequestStatus(uploadRequestDTO.getUploadRequestStatus());

        if(uploadRequestDTO.getMedia()!=null){
            String folderName = "upload-request";
            String oldMediaId = awsService.extractKeyFromCloudFrontUrl(uploadRequest.getFileUrl());
            awsService.s3MediaDelete(oldMediaId);
            String mediaId =  awsService.s3MediaUploader(folderName,authUserId,uploadRequestDTO.getMedia().getContentType(),uploadRequestDTO.getMedia());
            String mediaUrl = cloudFrontDistribution + folderName + "/" + mediaId;
            uploadRequest.setFileUrl(mediaUrl);
        }
        if(uploadRequestDTO.getUploadRequestStatus().equals(UploadRequestStatus.APPROVED)){
            List<UploadTypeMappingItem> uploadTypeMapping = uploadRequest.getUploadTypeMapping();
            for (UploadTypeMappingItem mapping : uploadTypeMapping) {
                ProviderImpl provider = providerFactory.getProvider(mapping.platform);
                provider.uploadMedia(uploadRequest, mapping.getContentType() , contentCreator);
            }
        }
        uploadRequestRepository.save(uploadRequest);
        return new ResponseDTO("Upload request updated successfully" , true);
    }

    public ResponseDTO deleteUploadRequest(String authUserId , Long uploadRequestId) throws IOException {
        User authUser = userRepository.findById(authUserId).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));
        User contentCreator = userRepository.findById(authUser.getReportsTo().getUserId()).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));

        UploadRequest uploadRequest = uploadRequestRepository.findById(uploadRequestId).orElseThrow(()-> new ResourceNotFoundException("Upload Request","id",uploadRequestId.toString()));

        if(!uploadRequest.getRequestedBy().getUserId().equals(authUserId)){
            throw new GenericError("You are not allowed to perform this operation");
        }
        if(!uploadRequest.getRequestedTo().getUserId().equals(contentCreator.getUserId())){
            throw new GenericError("You are not allowed to perform this operation");
        }
        String folderName = "upload-request";
        String oldMediaId = awsService.extractKeyFromCloudFrontUrl(uploadRequest.getFileUrl());
        awsService.s3MediaDelete(oldMediaId);
        contentCreator.getUploadRequests().remove(uploadRequest);
        uploadRequestRepository.delete(uploadRequest);
        userRepository.save(contentCreator);
        return new ResponseDTO("Upload request deleted successfully" , true);
    }


    // ACCEPT , DECLINE , REVISION
    public ResponseDTO updateUploadRequestStatus(String authUserId, Long requestId, UploadRequestStatus newStatus) throws IOException {
        User user =  userRepository.findById(authUserId).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));
        User contentCreator =  userRepository.findById(user.getReportsTo().getUserId()).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));
        UploadRequest uploadRequest = uploadRequestRepository.findById(requestId).orElseThrow(()->new ResourceNotFoundException("Upload Request","id",requestId.toString()));

        // ACCEPT and REVISION
            if(!user.getUserId().equals(uploadRequest.getRequestedTo().getUserId())){
            throw new GenericError("You are not allowed to perform this operation");
        }

       if(newStatus==UploadRequestStatus.APPROVED){
        uploadRequest.setUploadRequestStatus(UploadRequestStatus.UPLOAD_IN_PROGRESS);
        uploadRequest.getUploadTypeMapping().forEach(mapping->mapping.setStatus(UploadRequestStatus.UPLOAD_IN_PROGRESS));
           List<UploadTypeMappingItem> uploadTypeMapping = uploadRequest.getUploadTypeMapping();
           for (UploadTypeMappingItem mapping : uploadTypeMapping) {
               ProviderImpl provider = providerFactory.getProvider(mapping.platform);
               provider.uploadMedia(uploadRequest, mapping.getContentType() , contentCreator);
           }
       }else{
        uploadRequest.setUploadRequestStatus(newStatus);
       }
        uploadRequestRepository.save(uploadRequest);
        return new ResponseDTO("Upload request updated successfully" , true);

    }
}
