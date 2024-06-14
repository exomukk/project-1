package com.example.auctionwebsite;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.util.List;

@RestController
public class AuctionController {

    @Autowired
    private DataSource dataSource;

    @Getter
    @Setter
    @Component
    public static class AuctionRoom {
        private String id;
        private String ownerId;
        private String name;
    }

    @Getter
    @Setter
    @Component
    public static class ItemInfo {
        private String id;
        private String roomId;
        private String name;
        private String price;
        private String description;
        private String openTime;
        private String imageLink;
    }

    // API để tạo một phòng đấu giá mới
    @PostMapping("/auction-rooms/create")
    public ResponseEntity<Map<String, String>> createAuctionRoom(@RequestBody AuctionRoom auctionRoom, @RequestParam("ownerId") String ownerId) {
        auctionRoom.setOwnerId(ownerId);
        Map<String, String> response = new HashMap<>();
        String checkRoomExistsQuery = "SELECT COUNT(*) FROM master.dbo.[auctionRoom] WHERE ownerId = ? AND name = ?";

        try (Connection conn = dataSource.getConnection()) {
            // Kiểm tra xem phòng với ownerId hay name đã tồn tại chưa ?
            try (PreparedStatement checkRoomExistsStmt = conn.prepareStatement(checkRoomExistsQuery)) {
                checkRoomExistsStmt.setString(1, auctionRoom.getOwnerId());
                checkRoomExistsStmt.setString(2, auctionRoom.getName());

                try (ResultSet resultSet = checkRoomExistsStmt.executeQuery()) {
                    if (resultSet.next() && resultSet.getInt(1) > 0) {
                        // Nếu phòng tồn tại
                        response.put("message", "Tên phòng đã tồn tại");
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                    }
                }
            }

            // Nếu không tồn tại -> Tạo phòng mới
            String createRoomQuery = "INSERT INTO master.dbo.[auctionRoom] (ownerId, name) VALUES (?, ?)";
            try (PreparedStatement createRoomStmt = conn.prepareStatement(createRoomQuery, Statement.RETURN_GENERATED_KEYS)) {
                createRoomStmt.setString(1, auctionRoom.getOwnerId());
                createRoomStmt.setString(2, auctionRoom.getName());

                int rowsAffected = createRoomStmt.executeUpdate();

                if (rowsAffected > 0) {
                    try (ResultSet generatedKeys = createRoomStmt.getGeneratedKeys()) {
                        if (generatedKeys.next()) {
                            // Thiết lập ID cho auctionRoom từ khóa được tạo tự động
                            auctionRoom.setId(String.valueOf(generatedKeys.getLong(1)));
                            System.out.println("Room created successfully, id: " + auctionRoom.getId());
                            // Trả về đối tượng AuctionRoom với ID đã được thiết lập
                            response.put("message", auctionRoom.getId());
                            return ResponseEntity.ok(response);
                        }
                    }
                } else {
                    System.out.println("Room creation failed");
                    response.put("message", "Room creation failed");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.put("message", "Error during connecting: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        // Trường hợp không xảy ra lỗi nhưng không tạo được phòng
        response.put("message", "Could not create the room");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }



    // API để lấy danh sách các items trong một phòng đấu giá cụ thể
    @GetMapping("/auction-rooms/{roomId}/items")
    public ResponseEntity<List<ItemInfo>> getItemsInRoom(@PathVariable String roomId) {
        List<ItemInfo> items = new ArrayList<>();
        String query = "SELECT id, name, price, description, openTime, imageLink FROM [items] WHERE roomId = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, roomId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    ItemInfo item = new ItemInfo();
                    item.setId(rs.getString("id"));
                    item.setRoomId(roomId);
                    item.setName(rs.getString("name"));
                    item.setPrice(rs.getString("price"));
                    item.setDescription(rs.getString("description"));
                    item.setOpenTime(rs.getString("openTime"));
                    item.setImageLink(rs.getString("imageLink"));
                    items.add(item);
                }
            }
            return ResponseEntity.status(HttpStatus.OK).body(items);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // API để thêm một item vào phòng đấu giá
    @PostMapping("/auction-rooms/{roomId}/add-item")
    public ResponseEntity<Void> addItemToRoom(@PathVariable String roomId, @RequestBody ItemInfo itemInfo) {
        // Logic để thêm một item vào cơ sở dữ liệu với roomId tương ứng
        // ...
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}