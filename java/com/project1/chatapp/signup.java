package com.project1.chatapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@RestController
public class signup {
    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    private DataSource dataSource;

    private class signupInfo{
        private String username;
        private String password;
        private String name;
        private int id;
    }
    /*
    * add a random id generator*/
    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody signupInfo signupInfo){
        String signupQuery="insert into [user] (username,password,name,id) values (?,?,?,?)";
        try{
            Connection connection = dataSource.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(signupQuery);
            preparedStatement.setString(1, signupInfo.username);
            preparedStatement.setString(2, signupInfo.password);
            preparedStatement.setString(3, signupInfo.name);
            preparedStatement.setInt(4, signupInfo.id);
            preparedStatement.executeUpdate();
            connection.close();
            preparedStatement.close();
            return ResponseEntity.status(HttpStatus.OK).body("Signup Successful");
        }
        catch(SQLException e){
            throw new RuntimeException(e);
        }
    }
}
