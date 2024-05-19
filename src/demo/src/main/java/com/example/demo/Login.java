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
            System.out.println("1");
            Connection conn = dataSource.getConnection();
            System.out.println("2");
            PreparedStatement ps = conn.prepareStatement(loginQuery);
            System.out.println("3");
            ps.setString(1,loginInfo.username);
            ps.setString(2,loginInfo.password);
            System.out.println("4");
            ResultSet rs = ps.executeQuery();
            System.out.println("5");
            rs.next();
            System.out.println(rs.getString("username"));
            System.out.println("breakpoint");
            if (rs.getString("username") != null && rs.getString("password") != null) {
                System.out.println("6");
//                String user_id = rs.getString("user_id");
                System.out.println("7");
                ps.close();
                System.out.println("8");
                conn.close();
                System.out.println("9");
                rs.close();
                System.out.println("10");
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


