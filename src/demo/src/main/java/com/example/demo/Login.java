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
    public ResponseEntity<String> login(@RequestBody loginInfo loginInfo){
        System.out.println("Connected successfully");
        String loginQuery = "SELECT * FROM master.dbo.[user] where username =? and password=?";
        try {
            Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(loginQuery);
            ps.setString(1,loginInfo.username);
            ps.setString(2,loginInfo.password);
            ResultSet rs = ps.executeQuery();
            rs.next();
            if (rs.getString("username") != null && rs.getString("password") != null) {
                ps.close();
                conn.close();
                rs.close();
                return ResponseEntity.status(HttpStatus.OK).body("Login success");
            }
            else
            {
                rs.close();
                ps.close();
                conn.close();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed, please recheck your credentials");
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}


