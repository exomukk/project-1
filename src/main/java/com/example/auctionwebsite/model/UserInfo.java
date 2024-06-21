package com.example.auctionwebsite.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
public class UserInfo {
    private String id;
    private String username;
}