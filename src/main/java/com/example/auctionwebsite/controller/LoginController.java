//package com.example.auctionwebsite.controller;
//
//import org.springframework.http.ResponseCookie;
//import org.springframework.http.ResponseEntity;
//import com.example.auctionwebsite.util.JwtUtil;
//import com.example.auctionwebsite.model.LoginInfo;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.sql.DataSource;
//import java.nio.charset.StandardCharsets;
//import java.security.MessageDigest;
//import java.security.NoSuchAlgorithmException;
//import java.sql.Connection;
//import java.sql.PreparedStatement;
//import java.sql.ResultSet;
//import java.sql.SQLException;
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//public class LoginController {
//
//    @Autowired
//    private DataSource dataSource;
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @PostMapping("/login.app")
//    public ResponseEntity<Map<String, String>> login(@RequestBody LoginInfo loginInfo) {
//        System.out.println("Connected successfully");
//        String loginQuery = "SELECT id, password FROM master.dbo.[user] WHERE username = ?";
//
//        // Hash the password
//        String hashedPassword = encodePassword(loginInfo.getPassword());
//
//        try (Connection conn = dataSource.getConnection();
//             PreparedStatement ps = conn.prepareStatement(loginQuery)) {
//            ps.setString(1, loginInfo.getUsername());
//
//            try (ResultSet rs = ps.executeQuery()) {
//                Map<String, String> response = new HashMap<>();
//                if (rs.next()) {
//                    String storedPasswordHash = rs.getString("password");
//                    if (hashedPassword.equals(storedPasswordHash)) {
////                        long userId = rs.getLong("id");
//                        String token = jwtUtil.generateToken(loginInfo.getUsername());
//                        response.put("message", "Login successfully");
//                        ResponseCookie cookie = ResponseCookie.from("token", token)
//                                .httpOnly(true)
//                                .secure(true)  // Make sure to enable this in production
//                                .path("/")
//                                .maxAge(10 * 60 * 60)  // 10 hours
//                                .build();
//                        return ResponseEntity.ok()
//                                .header("Set-Cookie", cookie.toString())
//                                .body(response);
//                    } else {
//                        response.put("message", "Login failed, please recheck your credentials");
//                        System.out.println("Wrong password");
//                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
//                    }
//                } else {
//                    response.put("message", "Login failed, please recheck your credentials");
//                    System.out.println("Something wrong");
//                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
//                }
//            } catch (SQLException e) {
//                throw new RuntimeException(e);
//            }
//        } catch (SQLException e) {
//            throw new RuntimeException(e);
//        }
//    }
//
//    // Hashing the password using SHA-256
//    private String encodePassword(String password) {
//        try {
//            MessageDigest digest = MessageDigest.getInstance("SHA-256");
//            byte[] encodedHash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
//            return bytesToHex(encodedHash);
//        } catch (NoSuchAlgorithmException e) {
//            throw new RuntimeException(e);
//        }
//    }
//
//    private String bytesToHex(byte[] hash) {
//        StringBuilder hexString = new StringBuilder(2 * hash.length);
//        for (byte b : hash) {
//            String hex = Integer.toHexString(0xff & b);
//            if (hex.length() == 1) {
//                hexString.append('0');
//            }
//            hexString.append(hex);
//        }
//        return hexString.toString();
//    }
//}

package com.example.auctionwebsite.controller;

import com.example.auctionwebsite.model.LoginInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {

    @Autowired
    private DataSource dataSource;

    @PostMapping("/login.app")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginInfo loginInfo) {
        System.out.println("Connected successfully");
        String loginQuery = "SELECT id, password FROM master.dbo.[user] WHERE username = ?";

        // Hash the password
        String hashedPassword = encodePassword(loginInfo.getPassword());

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(loginQuery)) {
            ps.setString(1, loginInfo.getUsername());

            try (ResultSet rs = ps.executeQuery()) {
                Map<String, String> response = new HashMap<>();
                if (rs.next()) {
                    String storedPasswordHash = rs.getString("password");
                    if (hashedPassword.equals(storedPasswordHash)) {
                        long userId = rs.getLong("id");
                        response.put("message", "Login successfully");
                        response.put("userId", String.valueOf(userId));
                        return ResponseEntity.status(HttpStatus.OK).body(response);
                    } else {
                        response.put("message", "Login failed, please recheck your credentials");
                        System.out.println("Wrong password");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                    }
                } else {
                    response.put("message", "Login failed, please recheck your credentials");
                    System.out.println("Something wrong");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                }
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // Hashing the password using SHA-256
    private String encodePassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encodedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}