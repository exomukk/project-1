package com.example.auctionwebsite.controller;

import com.example.auctionwebsite.model.RoomInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class RoomController {
    @Autowired
    private DataSource dataSource;

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

    // Get item from a specific room
    @GetMapping("/user/{userId}/addItems")
    public ResponseEntity<List<RoomInfo>> getRoomsFromUser(@PathVariable String userId) {
        System.out.println("user ID: " + userId);
        List<RoomInfo> rooms = new ArrayList<>();
        String query = "SELECT id, name FROM [auctionRoom] WHERE ownerId = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    RoomInfo room = new RoomInfo();
                    room.setOwnerId(userId);
                    room.setName(rs.getString("name"));
                    room.setId(rs.getString("id"));
                    rooms.add(room);
                }
            }
            return ResponseEntity.status(HttpStatus.OK).body(rooms);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}