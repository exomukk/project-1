package com.example.auctionwebsite.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
public class AuctionRoom {
    private String id;
    private String ownerId;
    private String name;
}
