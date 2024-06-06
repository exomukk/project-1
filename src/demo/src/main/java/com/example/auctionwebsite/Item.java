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
public class Item {
    @Autowired
    private DataSource dataSource;

    @Getter
    @Setter
    @Component
    public static class ItemInfo {
        private String id;
        private String name;
        private String price;
        private String description;
        private String openTime;
        private String imageLink;
    }

    @GetMapping("/items")
    public ResponseEntity<List<ItemInfo>> getItems() {
        List<ItemInfo> items = new ArrayList<>();
        String query = "SELECT id, name, price, description, openTime, imageLink FROM items";
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
                item.setImageLink(rs.getString("imageLink"));
                items.add(item);
            }
            return ResponseEntity.status(HttpStatus.OK).body(items);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}