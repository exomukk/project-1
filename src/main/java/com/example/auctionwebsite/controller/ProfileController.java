package com.example.auctionwebsite.controller;

import lombok.Getter;
import lombok.Setter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@RestController
public class ProfileController {
    @Autowired
    private DataSource dataSource;

    @Getter
    @Setter
    @Component
    public static class EditProfileInfo {
        private String id;
        private String username;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String userId) {
        System.out.println(userId);
        // Sử dụng userId để truy vấn cơ sở dữ liệu và lấy thông tin username
        String query = "SELECT username FROM [user] WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    String username = rs.getString("username");
                    return ResponseEntity.ok(Collections.singletonMap("username", username));
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}
