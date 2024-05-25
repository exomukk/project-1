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
import java.sql.SQLException;

@RestController

public class EditProfile {
    @Autowired
    private DataSource dataSource;

    @Getter
    @Setter
    @Component
    public static class editProfileInfo{
        private String username;
        private String password;
    }

    @PostMapping("/editprofile.app")
    public ResponseEntity<String> editProfile(@RequestBody EditProfile.editProfileInfo editProfileInfo){
        System.out.println("Connected successfully");
        String updateQuery = "UPDATE master.dbo.[user] SET password = ? WHERE username = ?";
        try {
            Connection conn = dataSource.getConnection();
            PreparedStatement ps = conn.prepareStatement(updateQuery);
            ps.setString(1, editProfileInfo.password);
            ps.setString(2, editProfileInfo.username);
            int rowsUpdated = ps.executeUpdate();
            if (rowsUpdated > 0) {
                System.out.println("Profile updated successfully");
                ps.close();
                conn.close();
                return ResponseEntity.status(HttpStatus.OK).body("Profile update success");
            } else {
                ps.close();
                conn.close();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Profile update failed, please recheck your credentials");
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
