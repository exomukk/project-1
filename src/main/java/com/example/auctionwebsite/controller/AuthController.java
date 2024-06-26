//package com.example.auctionwebsite.controller;
//
//import com.example.auctionwebsite.util.JwtUtil;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.servlet.http.Cookie;
//import javax.servlet.http.HttpServletResponse;
//import java.util.Collections;
//import java.util.Map;
//
//@RestController
//public class AuthController {
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @GetMapping("/auth/status")
//    public ResponseEntity<Map<String, String>> authStatus() {
//        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        if (principal instanceof UserDetails) {
//            UserDetails userDetails = (UserDetails) principal;
//            return ResponseEntity.ok(Collections.singletonMap("username", userDetails.getUsername()));
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Not authenticated"));
//        }
//    }
//
//    @PostMapping("/logout.app")
//    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
//        Cookie cookie = new Cookie("token", null);
//        cookie.setHttpOnly(true);
//        cookie.setPath("/");
//        cookie.setMaxAge(0); // Expire the cookie
//        response.addCookie(cookie);
//        return ResponseEntity.ok(Collections.singletonMap("message", "Logged out successfully"));
//    }
//}
//
