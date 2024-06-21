package com.example.auctionwebsite.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
public class LoginInfo {
    private String username;
    private String password;
    private String phone;
    private String address;
}
