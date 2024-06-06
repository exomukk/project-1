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
        private String id;
        private String username;
        private String password;
        private String address;
        private String phone;
    }

    @PostMapping("/editprofile.app")
    public ResponseEntity<String> editProfile(@RequestBody EditProfile.editProfileInfo editProfileInfo){
        System.out.println("Connected successfully");
        StringBuilder updateQuery = getStringBuilder(editProfileInfo);

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(updateQuery.toString())) {
            int paramIndex = 1;
            if (editProfileInfo.username != null && !editProfileInfo.username.isEmpty()) {
                ps.setString(paramIndex++, editProfileInfo.username);
            }
            if (editProfileInfo.password != null && !editProfileInfo.password.isEmpty()) {
                ps.setString(paramIndex++, editProfileInfo.password);
            }
            if (editProfileInfo.address != null && !editProfileInfo.address.isEmpty()) {
                ps.setString(paramIndex++, editProfileInfo.address);
            }
            if (editProfileInfo.phone != null && !editProfileInfo.phone.isEmpty()) {
                ps.setString(paramIndex++, editProfileInfo.phone);
            }
            ps.setString(paramIndex, editProfileInfo.id);

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

    private static StringBuilder getStringBuilder(editProfileInfo editProfileInfo) {
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
        return updateQuery;
    }
}
