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
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class AuctionController {

    @Autowired
    private DataSource dataSource;

    // Class chứa thông tin của một phòng đấu giá
    @Getter
    @Setter
    @Component
    public static class AuctionRoom {
        private String id;
        private String ownerId;
        private String name;
        // Các thuộc tính khác nếu cần
    }

    // Class chứa thông tin của một item
    @Getter
    @Setter
    @Component
    public static class ItemInfo {
        private String id;
        private String roomId; // Thêm trường này để liên kết item với phòng đấu giá
        private String name;
        private String price;
        private String description;
        private String openTime;
        private String imageLink;
    }

    // API để tạo một phòng đấu giá mới
    @PostMapping("/auction-rooms/create")
    public ResponseEntity<AuctionRoom> createAuctionRoom(@RequestBody AuctionRoom auctionRoom) {
        // Logic để tạo một phòng đấu giá mới và lưu vào cơ sở dữ liệu
        // ...
        return ResponseEntity.status(HttpStatus.CREATED).body(auctionRoom);
    }

    // API để lấy danh sách các items trong một phòng đấu giá cụ thể
    @GetMapping("/auction-rooms/{roomId}/items")
    public ResponseEntity<List<ItemInfo>> getItemsInRoom(@PathVariable String roomId) {
        List<ItemInfo> items = new ArrayList<>();
        String query = "SELECT id, name, price, description, openTime, imageLink FROM items WHERE roomId = ?";
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

    // Các phương thức khác để quản lý phòng đấu giá và items
    // ...
}