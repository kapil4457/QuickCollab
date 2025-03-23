package com.quickcollab.service;

import com.quickcollab.dtos.request.UploadRequestDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
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
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class UploadRequestService {
    private UploadRequestRepository uploadRequestRepository;
    private UserRepository userRepository;
    private ProviderFactory providerFactory;
    private ProviderImpl providerImpl;
    private AWSService awsService;

    @Value("${aws.cloudfront.distribution}")
    private String cloudFrontDistribution;

    public UploadRequestService(UploadRequestRepository uploadRequestRepository, UserRepository userRepository, ProviderFactory providerFactory, ProviderImpl providerImpl, AWSService awsService) {
        this.uploadRequestRepository = uploadRequestRepository;
        this.userRepository = userRepository;
        this.providerFactory = providerFactory;
        this.providerImpl = providerImpl;
        this.awsService = awsService;
    }

    public ResponseDTO createUploadRequest(String authUserId , UploadRequestDTO uploadRequestDTO) throws IOException {
        User authUser = userRepository.findById(authUserId).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));
        User contentCreator = userRepository.findById(authUser.getReportsTo().getUserId()).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));
        if(authUserId.equals(contentCreator.getUserId())){
            throw new GenericError("You are not allowed to perform this operation");
        }
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

    public ResponseDTO updateUploadRequest(String authUserId , UploadRequestDTO uploadRequestDTO,Long uploadRequestId) throws IOException {
        User authUser = userRepository.findById(authUserId).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));
        User contentCreator = userRepository.findById(authUser.getReportsTo().getUserId()).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));

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
        if(uploadRequestDTO.getUploadRequestStatus().equals(UploadRequestStatus.COMPLETED)){

            List<Platform> uploadTo =  uploadRequestDTO.getUploadTo();
            for(Integer ind = 0; ind < uploadTo.size();ind++){
               ProviderImpl provider =  providerFactory.getProvider(uploadTo.get(ind));
               provider.uploadMedia(uploadRequest,contentCreator);
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


}
