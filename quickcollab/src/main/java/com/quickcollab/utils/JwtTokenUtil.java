package com.quickcollab.utils;

import com.quickcollab.constants.ApplicationConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@AllArgsConstructor
@Component
public class JwtTokenUtil {
    private final Environment env;

    public String generateToken(String username , List<? extends GrantedAuthority> authorities,String userId) {
        String jwt = "";
        String secret = env.getProperty(ApplicationConstants.JWT_SECRET_KEY,
                ApplicationConstants.JWT_SECRET_DEFAULT_VALUE);
        SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        jwt = Jwts.builder().issuer("Quick Collab").subject("JWT Token")
                .claim("username", username)
                .claim("userId", userId)
                .claim("authorities", authorities.stream().map(
                        GrantedAuthority::getAuthority).collect(Collectors.joining(",")))
                .issuedAt(new java.util.Date())
                .expiration(new java.util.Date((new java.util.Date()).getTime() + 30000000))
                .signWith(secretKey).compact();
        return jwt;
    }
    public long getRemainingTime(String token) {
        String secret = env.getProperty(ApplicationConstants.JWT_SECRET_KEY,
                ApplicationConstants.JWT_SECRET_DEFAULT_VALUE);
        SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        Date expiration = claims.getExpiration();
        long remainingTimeInMillis = expiration.getTime() - System.currentTimeMillis();

        return remainingTimeInMillis > 0 ? remainingTimeInMillis : 0;
    }

    public String getUsername(String token) {
        String secret = env.getProperty(ApplicationConstants.JWT_SECRET_KEY,
                ApplicationConstants.JWT_SECRET_DEFAULT_VALUE);
        SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("username",String.class);
    }
    public List<SimpleGrantedAuthority> getUserAuthorities(String token){
        String secret = env.getProperty(ApplicationConstants.JWT_SECRET_KEY,
                ApplicationConstants.JWT_SECRET_DEFAULT_VALUE);
        SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        String authorities = claims.get("authorities",String.class);
        List<String> authorityList = Arrays.asList(authorities.split(",")).stream().map(authority -> "ROLE_"+authority).toList();
        return authorityList.stream().map(SimpleGrantedAuthority::new).toList();
    }

}
