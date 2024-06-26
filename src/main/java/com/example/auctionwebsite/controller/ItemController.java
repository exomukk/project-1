package com.example.auctionwebsite.controller;

import com.example.auctionwebsite.model.ItemInfo;
import com.example.auctionwebsite.model.RoomInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ItemController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/items")
    public ResponseEntity<List<ItemInfo>> getItems() {
        List<ItemInfo> items = new ArrayList<>();
        String query = "SELECT id, name, price, description, openTime, endTime, imageLink, bid_price, highestBidder FROM items";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                ItemInfo item = new ItemInfo();
                item.setId(rs.getString("id"));
                item.setName(rs.getString("name"));
                item.setPrice(rs.getString("price"));
                item.setDescription(rs.getString("description"));
                item.setOpenTime(rs.getString("openTime"));
                item.setEndTime(rs.getString("endTime"));
                item.setImageLink(rs.getString("imageLink"));
                item.setBid_price(rs.getString("bid_price"));
                item.setHighestBidder(rs.getString("highestBidder"));
                items.add(item);
            }
            return ResponseEntity.status(HttpStatus.OK).body(items);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/getUserName")
    public ResponseEntity<String> getUserName(@RequestParam String userId) {
        String query = "SELECT username FROM [user] WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return ResponseEntity.ok(rs.getString("username"));
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                }
            }
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("SQL error: " + e.getMessage());
        }
    }

    @PostMapping("/createItem")
    public ResponseEntity<Map<String, String>> createItem(@RequestBody ItemInfo itemInfo) {
        Map<String, String> response = new HashMap<>();
        String insertQuery = "INSERT INTO master.dbo.[items] (name, price, bid_price, description, openTime, endTime, imageLink, roomId, sellerUserName, highestBidder) VALUES (?, ?, ?, ?, DATEADD(DAY, 1, GETDATE()), DATEADD(DAY, 1, DATEADD(DAY, 1, GETDATE())), ?, ?, ?, ?)";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(insertQuery, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, itemInfo.getName());
            ps.setString(2, itemInfo.getPrice());
            ps.setString(3, itemInfo.getBid_price());
            ps.setString(4, itemInfo.getDescription());
            // openTime và endTime được thiết lập tự động trong câu truy vấn
            ps.setString(5, itemInfo.getImageLink());
            ps.setString(6, itemInfo.getRoomId());
            ps.setString(7, itemInfo.getSellerUserName());
            ps.setString(8, itemInfo.getHighestBidder());

            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        itemInfo.setId(generatedKeys.getString(1)); // Retrieve the auto-generated ID
                    }
                }
                response.put("message", "Item created successfully");
                response.put("itemId", itemInfo.getId()); // Include the new item ID in the response
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                response.put("message", "Failed to create item");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (SQLException e) {
            response.put("message", "SQL error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/delItem/{itemId}")
    public ResponseEntity<Map<String, String>> deleteItem(@PathVariable String itemId) {
        Map<String, String> response = new HashMap<>();
        String query = "DELETE FROM items WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, itemId);
            int deletedRows = ps.executeUpdate();

            if (deletedRows > 0) {
                response.put("message", "Item deleted successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Item not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (SQLException e) {
            response.put("message", "SQL error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/delItem/{userId}")
    public ResponseEntity<List<ItemInfo>> getItemsForDeletion(@PathVariable String userId) {
        List<ItemInfo> items = new ArrayList<>();
        String getUsernameQuery = "SELECT username FROM [user] WHERE id = ?";
        String getItemsQuery = "SELECT id, name FROM [items] WHERE sellerUserName = ? AND (highestBidder IS NULL OR highestBidder = '')";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement psGetUsername = conn.prepareStatement(getUsernameQuery)) {

            psGetUsername.setString(1, userId);
            String sellerUserName = null;
            try (ResultSet rs = psGetUsername.executeQuery()) {
                if (rs.next()) {
                    sellerUserName = rs.getString("username");
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // User not found
                }
            }

            try (PreparedStatement psGetItems = conn.prepareStatement(getItemsQuery)) {
                psGetItems.setString(1, sellerUserName);
                try (ResultSet rs = psGetItems.executeQuery()) {
                    while (rs.next()) {
                        ItemInfo item = new ItemInfo();
                        item.setId(rs.getString("id"));
                        item.setName(rs.getString("name"));
                        items.add(item);
                    }
                }
            }

            return ResponseEntity.status(HttpStatus.OK).body(items);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}