package com.example.auctionwebsite;

import lombok.Getter;
import lombok.Setter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;

@RestController

public class Register {
    @Autowired
    private DataSource dataSource;

    @Getter
    @Setter
    @Component
    public static class loginInfo{
        private String username;
        private String password;
        private String phone;
        private String address;
//        private MultipartFile avatar;
    }

    @PostMapping("/register.app")
    public ResponseEntity<Map<String, String>> register(@RequestBody loginInfo loginInfo) {
        System.out.println("Connected successfully");
        String checkUserQuery = "SELECT COUNT(*) FROM master.dbo.[user] WHERE username = ? OR phone = ?";
        String registerQuery = "INSERT INTO master.dbo.[user] (username, password, phone, address) VALUES (?, ?, ?, ?)";

        // Hash the password using SHA-256
        String hashedPassword = encodePassword(loginInfo.getPassword());

        Map<String, String> response;
        try (Connection conn = dataSource.getConnection()) {
            response = new HashMap<>();
            // Check for duplicate username or phone
            try (PreparedStatement checkStmt = conn.prepareStatement(checkUserQuery)) {
                checkStmt.setString(1, loginInfo.username);
                checkStmt.setString(2, loginInfo.phone);

                try (ResultSet rs = checkStmt.executeQuery()) {
                    if (rs.next() && rs.getInt(1) > 0) {
                        response.put("message", "Username or phone number already exists.");
                        System.out.println("Username or phone number already exists.");
                        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
                    }
                }
            }

            // Register new user
            try (PreparedStatement registerStmt = conn.prepareStatement(registerQuery, Statement.RETURN_GENERATED_KEYS)) {
                registerStmt.setString(1, loginInfo.username);
                registerStmt.setString(2, hashedPassword);
                registerStmt.setString(3, loginInfo.phone);
                registerStmt.setString(4, loginInfo.address);
                // registerStmt.setBytes(5, loginInfo.avatar.getBytes());

                int rowsAffected = registerStmt.executeUpdate();

                if (rowsAffected > 0) {
                    try (ResultSet generatedKeys = registerStmt.getGeneratedKeys()) {
                        if (generatedKeys.next()) {
                            long userId = generatedKeys.getLong(1);
                            response.put("message", "Register success. User ID: " + userId);
                            System.out.println("Response successfully");
                            return ResponseEntity.ok(response);
                        }
                    }
                } else {
                    response.put("message", "Internal server error");
                    System.out.println("Response unsuccessfully");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error during registration", e);
        }

        // Add a default return statement
        response.put("message", "Unexpected error");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    // For the same reason in Login.java, idk how to implement the BCryptPasswordEncoder so... here's go SHA-256
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