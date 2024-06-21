package com.example.auctionwebsite.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
public class EditProfileInfo {
    private String id;
    private String username;
    private String password;
    private String address;
    private String phone;
}
