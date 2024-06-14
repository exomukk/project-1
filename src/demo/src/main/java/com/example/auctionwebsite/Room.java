package com.example.auctionwebsite;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class Room {
    @Autowired
    private DataSource dataSource;

    @Getter
    @Setter
    @Component
    public static class RoomInfo {
        private String id;
        private String ownerId;
        private String name;
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomInfo>> getRooms() {
        System.out.println("getRooms");
        List<RoomInfo> rooms = new ArrayList<>();
        String query = "SELECT id, ownerId, name FROM auctionRoom";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                RoomInfo room = new RoomInfo();
                room.setId(rs.getString("id"));
                room.setOwnerId(rs.getString("ownerId"));
                room.setName(rs.getString("name"));
                rooms.add(room);
            }
            return ResponseEntity.status(HttpStatus.OK).body(rooms);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}