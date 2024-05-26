package com.example.demo;

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
        String loginQuery = "SELECT * FROM master.dbo.[user] where username =? and password=?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(loginQuery)) {
            ps.setString(1, loginInfo.getUsername());
            ps.setString(2, loginInfo.getPassword());
            ResultSet rs = ps.executeQuery();
            boolean isLoginSuccessful = rs.next() && rs.getString("username") != null && rs.getString("password") != null;
            rs.close();

            Map<String, String> response = new HashMap<>();
            if (isLoginSuccessful) {
                response.put("message", "Login success");
                System.out.println("Response successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Login failed, please recheck your credentials");
                System.out.println("Wrong password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}


