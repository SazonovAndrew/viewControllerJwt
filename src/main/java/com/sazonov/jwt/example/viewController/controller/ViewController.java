package com.sazonov.jwt.example.viewController.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class ViewController {


    @GetMapping("/user")
    public String show(){
        return "user";
    }
    @GetMapping("/admin")
    public String adminView(){
        return "users";
    }
    @GetMapping("/login")
    public String loginView(){
        return "login";
    }
    @GetMapping("/logout")
    public String exit(){
        return "/login";
    }
}