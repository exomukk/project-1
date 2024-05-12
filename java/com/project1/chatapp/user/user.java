package com.project1.chatapp.user;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class user {
    private String name;
    private String username;
    private String password;
    private int userId;
    private Status status;

    public void setStatus(Status status) {
        this.status = status;
    }
    public void createUser(){
    }
}
