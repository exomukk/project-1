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
    }

    @PostMapping("/register.app")
    public ResponseEntity<String> register(@RequestBody loginInfo loginInfo){
        String registerQuery = "INSERT INTO master.dbo.[user] (username, password) VALUES (?, ?)";
        try {
            Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(registerQuery);
            ps.setString(1, loginInfo.username);
            ps.setString(2, loginInfo.password);
            int rowsAffected = ps.executeUpdate();
            ps.close();
            conn.close();
            if (rowsAffected > 0) {
                return ResponseEntity.status(HttpStatus.OK).body("Registration successful");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed, please try again");
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
