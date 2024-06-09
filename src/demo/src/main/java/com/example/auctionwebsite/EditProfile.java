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
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class EditProfile {
    @Autowired
    private DataSource dataSource;

    @Getter
    @Setter
    @Component
    public static class EditProfileInfo {
        private String id;
        private String username;
        private String password;
        private String address;
        private String phone;
    }

    @PostMapping("/editprofile.app")
    public ResponseEntity<Map<String, String>> editProfile(@RequestBody EditProfileInfo editProfileInfo) {
        System.out.println("Connected successfully");

        if (editProfileInfo.id == null || editProfileInfo.id.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User ID is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        StringBuilder updateQuery = new StringBuilder("UPDATE master.dbo.[user] SET ");
        boolean firstField = true;

        if (editProfileInfo.username != null && !editProfileInfo.username.isEmpty()) {
            updateQuery.append("username = ?");
            firstField = false;
        }
        if (editProfileInfo.password != null && !editProfileInfo.password.isEmpty()) {
            if (!firstField) updateQuery.append(", ");
            updateQuery.append("password = ?");
            firstField = false;
        }
        if (editProfileInfo.address != null && !editProfileInfo.address.isEmpty()) {
            if (!firstField) updateQuery.append(", ");
            updateQuery.append("address = ?");
            firstField = false;
        }
        if (editProfileInfo.phone != null && !editProfileInfo.phone.isEmpty()) {
            if (!firstField) updateQuery.append(", ");
            updateQuery.append("phone = ?");
        }
        updateQuery.append(" WHERE id = ?");

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(updateQuery.toString())) {
            int paramIndex = 1;
            if (editProfileInfo.username != null && !editProfileInfo.username.isEmpty()) {
                ps.setString(paramIndex++, editProfileInfo.username);
            }
            if (editProfileInfo.password != null && !editProfileInfo.password.isEmpty()) {
                String hashedPassword = encodePassword(editProfileInfo.password); // Hash the password
                ps.setString(paramIndex++, hashedPassword);
            }
            if (editProfileInfo.address != null && !editProfileInfo.address.isEmpty()) {
                ps.setString(paramIndex++, editProfileInfo.address);
            }
            if (editProfileInfo.phone != null && !editProfileInfo.phone.isEmpty()) {
                ps.setString(paramIndex++, editProfileInfo.phone);
            }
            ps.setString(paramIndex, editProfileInfo.id);

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
