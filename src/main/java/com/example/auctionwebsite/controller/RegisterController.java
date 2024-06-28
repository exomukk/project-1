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
import java.sql.*;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RegisterController {
    @Autowired
    private DataSource dataSource;

    @PostMapping("/register.app")
    public ResponseEntity<Map<String, String>> register(@RequestBody LoginInfo loginInfo) {
        System.out.println("Connected successfully");
        String checkUserQuery = "SELECT COUNT(*) FROM master.dbo.[user] WHERE username = ? OR phone = ?";
        String registerQuery = "INSERT INTO master.dbo.[user] (username, password, phone, address) VALUES (?, ?, ?, ?)";

        // Define regex patterns
        String usernamePattern = "^[a-zA-Z0-9_]{3,16}$";
        String passwordPattern = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$";
        String phonePattern = "^\\+?[0-9]{10,15}$";
        String addressPattern = "^.{5,100}$";

        Map<String, String> response = new HashMap<>();

        // Validate fields using regex
        if (!loginInfo.getUsername().matches(usernamePattern)) {
            response.put("message", "Invalid username.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (!loginInfo.getPassword().matches(passwordPattern)) {
            response.put("message", "Invalid password.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (!loginInfo.getPhone().matches(phonePattern)) {
            response.put("message", "Invalid phone number.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (!loginInfo.getAddress().matches(addressPattern)) {
            response.put("message", "Invalid address.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Hash the password using SHA-256
        String hashedPassword = encodePassword(loginInfo.getPassword());

        try (Connection conn = dataSource.getConnection()) {
            // Check for duplicate username or phone
            try (PreparedStatement checkStmt = conn.prepareStatement(checkUserQuery)) {
                checkStmt.setString(1, loginInfo.getUsername());
                checkStmt.setString(2, loginInfo.getPhone());

                try (ResultSet rs = checkStmt.executeQuery()) {
                    if (rs.next() && rs.getInt(1) > 0) {
                        response.put("message", "Username or phone number already exists.");
                        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
                    }
                }
            }

            // Register new user
            try (PreparedStatement registerStmt = conn.prepareStatement(registerQuery, Statement.RETURN_GENERATED_KEYS)) {
                registerStmt.setString(1, loginInfo.getUsername());
                registerStmt.setString(2, hashedPassword);
                registerStmt.setString(3, loginInfo.getPhone());
                registerStmt.setString(4, loginInfo.getAddress());

                int rowsAffected = registerStmt.executeUpdate();

                if (rowsAffected > 0) {
                    try (ResultSet generatedKeys = registerStmt.getGeneratedKeys()) {
                        if (generatedKeys.next()) {
                            long userId = generatedKeys.getLong(1);
                            response.put("message", "Register successfully!");
                            response.put("userId", String.valueOf(userId));
                            return ResponseEntity.ok(response);
                        }
                    }
                } else {
                    response.put("message", "Internal server error");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error during registration", e);
        }
        response.put("message", "Unexpected error");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    // For the same reason in LoginController.java, idk how to implement the BCryptPasswordEncoder so... here's go SHA-256
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
