package com.example.auctionwebsite.controller;

import com.example.auctionwebsite.model.RoomInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    // Get room where ownerId = ?
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

    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<Map<String, String>> deleteRoom(@PathVariable String roomId) {
        Map<String, String> response = new HashMap<>();
        String deleteItemsQuery = "DELETE FROM items WHERE roomId = ?";
        String deleteRoomQuery = "DELETE FROM auctionRoom WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement deleteItemsPs = conn.prepareStatement(deleteItemsQuery);
             PreparedStatement deleteRoomPs = conn.prepareStatement(deleteRoomQuery)) {

            // Begin transaction
            conn.setAutoCommit(false);

            // Delete items in the room
            deleteItemsPs.setString(1, roomId);
            deleteItemsPs.executeUpdate();

            // Delete the room
            deleteRoomPs.setString(1, roomId);
            int deletedRows = deleteRoomPs.executeUpdate();

            if (deletedRows > 0) {
                // Commit transaction
                conn.commit();
                response.put("message", "Room and its items deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                // Rollback transaction
                conn.rollback();
                response.put("message", "Room not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (SQLException e) {
            response.put("message", "SQL error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}