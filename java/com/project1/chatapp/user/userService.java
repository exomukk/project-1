package com.project1.chatapp.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class userService {
    @Autowired
    
    public void connected(user user){
        user.setStatus(Status.ONLINE);
    }
    public void createAccount(user user){

    }
}
