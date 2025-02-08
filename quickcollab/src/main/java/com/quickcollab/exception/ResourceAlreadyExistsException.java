package com.quickcollab.exception;

public class ResourceAlreadyExistsException extends RuntimeException{
    public ResourceAlreadyExistsException(String resourceType , String resourceName, String resourceValue) {
        super(resourceType + " with " + resourceName +" " + resourceValue+" already exists !!");
    }
}
