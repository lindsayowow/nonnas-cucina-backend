package org.launchcode.nonna.config;

import org.launchcode.nonna.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // CORS - allows the front end to call the API
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // Route-level authorization rules and JWT filter wiring
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Public endpoints -- no login required
                        .requestMatchers(
                                "/auth/login",
                                "/users/register"
                        ).permitAll()

                        // Public Gemini endpoint.
                        // The frontend does not need to send a JWT
                        // just to ask Nonna for a message.
                        //  May choose to default sayings in future if traffic too high
                        .requestMatchers(
                                HttpMethod.POST,
                                "/gemini"
                        ).permitAll()

                        // Public READ-ONLY browsing of
                        // ingredients/filters/categories.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/ingredients/**",
                                "/filters/**",
                                "/categories/**"
                        ).permitAll()

                        // Protected endpoints
                        .requestMatchers(
                                "/users/profile/**"
                        ).authenticated()

                        .requestMatchers(
                                "/favorites/**"
                        ).authenticated()

                        .requestMatchers(
                                "/pastorders/**"
                        ).authenticated()

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    // Password hashing bean used by UserService
    // for registration/login.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
