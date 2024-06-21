package com.example.auctionwebsite.controller;

import com.example.auctionwebsite.model.EditProfileInfo;
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
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class EditProfileController {

    @Autowired
    private DataSource dataSource;

    @PostMapping("/editprofile.app")
    public ResponseEntity<Map<String, String>> editProfile(@RequestBody EditProfileInfo editProfileInfo) {
        System.out.println("Connected successfully");

        if (editProfileInfo.getId() == null || editProfileInfo.getId().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User ID is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        StringBuilder updateQuery = new StringBuilder("UPDATE master.dbo.[user] SET ");
        boolean firstField = true;

        if (editProfileInfo.getUsername() != null && !editProfileInfo.getUsername().isEmpty()) {
            updateQuery.append("username = ?");
            firstField = false;
        }
        if (editProfileInfo.getPassword() != null && !editProfileInfo.getPassword().isEmpty()) {
            if (!firstField) updateQuery.append(", ");
            updateQuery.append("password = ?");
            firstField = false;
        }
        if (editProfileInfo.getAddress() != null && !editProfileInfo.getAddress().isEmpty()) {
            if (!firstField) updateQuery.append(", ");
            updateQuery.append("address = ?");
            firstField = false;
        }
        if (editProfileInfo.getPhone() != null && !editProfileInfo.getPhone().isEmpty()) {
            if (!firstField) updateQuery.append(", ");
            updateQuery.append("phone = ?");
        }
        updateQuery.append(" WHERE id = ?");

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(updateQuery.toString())) {
            int paramIndex = 1;
            if (editProfileInfo.getUsername() != null && !editProfileInfo.getUsername().isEmpty()) {
                ps.setString(paramIndex++, editProfileInfo.getUsername());
            }
            if (editProfileInfo.getPassword() != null && !editProfileInfo.getPassword().isEmpty()) {
                String hashedPassword = encodePassword(editProfileInfo.getPassword()); // Hash the password
                ps.setString(paramIndex++, hashedPassword);
            }
            if (editProfileInfo.getAddress() != null && !editProfileInfo.getAddress().isEmpty()) {
                ps.setString(paramIndex++, editProfileInfo.getAddress());
            }
            if (editProfileInfo.getPhone() != null && !editProfileInfo.getPhone().isEmpty()) {
                ps.setString(paramIndex++, editProfileInfo.getPhone());
            }
            ps.setString(paramIndex, editProfileInfo.getId());

            int rowsUpdated = ps.executeUpdate();

            Map<String, String> response = new HashMap<>();
            if (rowsUpdated > 0) {
                response.put("message", "Changed success");
                System.out.println("Changed");
                return ResponseEntity.status(HttpStatus.OK).body(response);
            } else {
                response.put("message", "Changed failed");
                System.out.println("Failed");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
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
