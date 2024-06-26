//package com.example.auctionwebsite.util;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfigurer extends WebSecurityConfigurerAdapter {
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Autowired
//    private UserDetailsService userDetailsService;
//
//    @Override
//    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
//    }
//
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http
//                .csrf().disable() // Disabling CSRF
//                .authorizeRequests()
//                .antMatchers("/login.app", "/register.app", "/auth/status").permitAll() // Permitting these URLs without authentication
//                .anyRequest().authenticated() // All other URLs require authentication
//                .and()
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless session management
//                .and()
//                .addFilterBefore(jwtRequestFilter(), UsernamePasswordAuthenticationFilter.class); // Adding JWT filter before UsernamePasswordAuthenticationFilter
//    }
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public JwtRequestFilter jwtRequestFilter() {
//        return new JwtRequestFilter(userDetailsService, jwtUtil);
//    }
//}
