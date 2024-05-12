package com.project1.chatapp;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@RestController
public class loginn {
    @Autowired
    private DataSource dataSource;
    @Autowired
    private com.project1.chatapp.user.user user;
    @Getter
    @Setter
    public static class LoginInfo{
        private String username;
        private String password;
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginInfo loginInfo){
        System.out.println("Connected successfully");
        String loginQuery="SELECT * FROM [user] where username =? and password=?";
        try {
            System.out.println("1");
            Connection conn=dataSource.getConnection();
            System.out.println("2");
            PreparedStatement ps=conn.prepareStatement(loginQuery);
            System.out.println("3");
            ps.setString(1,loginInfo.username);
            ps.setString(2,loginInfo.password);
            System.out.println("4");
            ResultSet rs=ps.executeQuery();
            System.out.println("5");
            if (rs.getString("username")!=null && rs.getString("password")!=null) {
                String username=rs.getString("username");
                ps.close();
                conn.close();
                rs.close();
                return ResponseEntity.status(HttpStatus.OK).body(username);
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
