package com.example.demo;

import lombok.Getter;
import lombok.Setter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
        String checkUserQuery = "SELECT COUNT(*) FROM master.dbo.[user] WHERE username = ? OR phone = ?";
        String registerQuery = "INSERT INTO master.dbo.[user] (username, password, phone, address) VALUES (?, ?, ?, ?)";

        try (Connection conn = dataSource.getConnection()) {
            Map<String, String> response = new HashMap<>();
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
            try (PreparedStatement registerStmt = conn.prepareStatement(registerQuery)) {
                registerStmt.setString(1, loginInfo.username);
                registerStmt.setString(2, loginInfo.password);
                registerStmt.setString(3, loginInfo.phone);
                registerStmt.setString(4, loginInfo.address);
//                registerStmt.setBytes(5, loginInfo.avatar.getBytes());

                int rowsAffected = registerStmt.executeUpdate();

                if (rowsAffected > 0) {
                    response.put("message", "Register success");
                    System.out.println("Response successfully");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("message", "Internal server error");
                    System.out.println("Response unsuccessfully");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Error during registration", e);
        }
    }
}