package com.quickcollab.exception;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String resourceType , String resourceName, String resourceValue) {
        super(resourceType + " with " + resourceName +" " + resourceValue+" does not exist !!");
    }
}
