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
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController

public class Login {
    @Autowired
    private DataSource dataSource;

    @Getter
    @Setter
    @Component
    public static class loginInfo{
        private String username;
        private String password;
    }

    @PostMapping("/login.app")
    public ResponseEntity<Map<String, String>> login(@RequestBody loginInfo loginInfo) {
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
                        response.put("message", "Login success. User ID: " + userId);
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

    // Since I don't know how to use the Spring Security - aka - BCryptPasswordEncoder
    // I'll do the SHA-256 hash by myself
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


