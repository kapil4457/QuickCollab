package com.quickcollab.service;

import com.quickcollab.dtos.request.AddProviderDTO;
import com.quickcollab.dtos.response.general.ResponseDTO;
import com.quickcollab.exception.GenericError;
import com.quickcollab.exception.ResourceNotFoundException;
import com.quickcollab.model.Provider;
import com.quickcollab.model.User;
import com.quickcollab.repository.ProviderRepository;
import com.quickcollab.repository.UserRepository;
import com.quickcollab.service.provider.ProviderFactory;
import com.quickcollab.service.provider.ProviderImpl;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@AllArgsConstructor
public class ProviderService {
    private final  ProviderRepository providerRepository;
    private final ProviderFactory providerFactory;
    private final UserRepository userRepository;

    public ResponseDTO addProvider(AddProviderDTO addProviderDTO , String authUserId) throws IOException {
        User user = userRepository.findById(authUserId).orElseThrow(()->new ResourceNotFoundException("User","id",authUserId));
        List<Provider> currentProviderDetail = user.getProviders().stream().filter(provider -> {
            return provider.getName().equals(addProviderDTO.getName());
        }).toList();
        if(!currentProviderDetail.isEmpty()){
            throw new GenericError(addProviderDTO.getName()+" provider is already configured and added for your account");
        }
        ProviderImpl provider = providerFactory.getProvider(addProviderDTO.getName());
        provider.addProvider(addProviderDTO.getAccessCode(),authUserId);
        return new ResponseDTO(addProviderDTO.getName()+" added as a provider successfully",true);
    }

}
