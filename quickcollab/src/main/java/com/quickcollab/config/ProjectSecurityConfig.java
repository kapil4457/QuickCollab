package com.quickcollab.config;

import com.quickcollab.events.CustomAuthenticationSuccessHandler;
import com.quickcollab.exceptionhandling.CustomAccessDeniedHandler;
import com.quickcollab.exceptionhandling.CustomBasicAuthenticationEntryPoint;
import com.quickcollab.filters.JWTTokenValidatorFilter;
import com.quickcollab.utils.JwtBlacklistService;
import com.quickcollab.utils.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.password.CompromisedPasswordChecker;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.password.HaveIBeenPwnedRestApiPasswordChecker;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;

@Configuration
@Profile("!prod")
@AllArgsConstructor
public class ProjectSecurityConfig {

    private final JwtBlacklistService jwtBlacklistService;
    private final JwtTokenUtil jwtTokenUtil;
    private final Environment env;



    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Use JWT (no sessions)
                )
                .cors(corsConfig -> corsConfig.configurationSource(new CorsConfigurationSource() {
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                        CorsConfiguration config = new CorsConfiguration();
                        config.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
                        config.setAllowedMethods(Collections.singletonList("*"));
                        config.setAllowCredentials(true);
                        config.setAllowedHeaders(Collections.singletonList("*"));
                        config.setMaxAge(3600L);
                        return config;
                    }
                }))
                .csrf(AbstractHttpConfigurer::disable)
                .requiresChannel(rcc -> rcc.anyRequest().requiresInsecure()) // Only HTTP
                .addFilterBefore(new JWTTokenValidatorFilter(jwtBlacklistService, jwtTokenUtil,env), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/api/me","/api/insertMessage","/api/all/conversations","/api/updateProfile").authenticated()
                        .requestMatchers("/api/getUserListedJobs","/api/createJob","/api/updateJob","/api/sendOffer","/api/reviseOffer","/api/updateEmployeeSalary","/api/updateEmployeeRole","/api/createConversation","/api/addProvider","/api/updateUploadRequestStatus").hasAnyRole("CONTENT_CREATOR")
                        .requestMatchers("/api/applyForJob","/api/applyForJob","/api/getAllJobs","/api/updateOfferStatus","/api/updateResignationStatus","/api/joinCompany","/api/deleteProject","/api/addProject" , "/api/updateProject").hasAnyRole("JOB_SEEKER","TEAM_MEMBER")
                        .requestMatchers("/api/createUploadRequest","/api/updateUploadRequest").hasRole("TEAM_MEMBER")
                        .requestMatchers( "/api/error", "/api/register","/api/apiLogin","/api/apiLogout","/api/chat/**").permitAll());


//        http.formLogin(fl -> fl
//                .loginPage("/apiLogin")
//                .successHandler(customAuthenticationSuccessHandler));

        http.formLogin(AbstractHttpConfigurer::disable);
        http.httpBasic(hbc -> hbc.authenticationEntryPoint(new CustomBasicAuthenticationEntryPoint()));
        http.exceptionHandling(ehc -> ehc.accessDeniedHandler(new CustomAccessDeniedHandler()));
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public CompromisedPasswordChecker compromisedPasswordChecker() {
        return new HaveIBeenPwnedRestApiPasswordChecker();
    }
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
}
