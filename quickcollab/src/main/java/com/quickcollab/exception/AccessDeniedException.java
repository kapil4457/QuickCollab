package com.quickcollab.exception;

public class AccessDeniedException extends RuntimeException{
    public AccessDeniedException(String resourceType) {
        super("Access denied to access "+resourceType);
    }
}
