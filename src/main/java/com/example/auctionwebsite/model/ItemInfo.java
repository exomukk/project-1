package com.example.auctionwebsite.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
public class ItemInfo {
    private String id;
    private String roomId;
    private String name;
    private String price;
    private String bid_price;
    private String description;
    private String openTime;
    private String endTime;
    private String imageLink;
}
