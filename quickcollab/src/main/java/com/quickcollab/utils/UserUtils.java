package com.quickcollab.utils;

import org.springframework.stereotype.Component;

@Component
public class UserUtils {

    public Boolean RoleCheck(String actual , String expected){
        return actual.equals(expected);
    }
    
}
