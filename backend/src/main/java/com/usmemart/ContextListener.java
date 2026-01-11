package com.usmemart;

import javax.servlet.*;
import javax.servlet.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebListener
public class ContextListener implements ServletContextListener {
    
    public void contextInitialized(ServletContextEvent sce) {
        String contextPath = sce.getServletContext().getRealPath("");
        DataManager.init(contextPath);
        System.out.println("USM E-Mart Application initialized at: " + contextPath);
        
        // Initialize default products if empty
        List<Product> products = DataManager.loadProducts();
System.out.println("Products loaded from file: " + products.size() + " products");


if (products.size() < 12) {
    System.out.println("Initializing/refreshing default products...");
    List<Product> defaultProducts = createDefaultProducts();
    
    // Merge existing products with defaults
    Map<String, Product> productMap = new HashMap<>();
    
    // Add all existing products first
    for (Product p : products) {
        productMap.put(p.getId(), p);
    }
    
    // Add or replace with default products
    for (Product p : defaultProducts) {
        productMap.put(p.getId(), p);
    }
    
    // Save merged list
    DataManager.saveProducts(new ArrayList<>(productMap.values()));
    System.out.println("Total products after merge: " + productMap.size());
}
        
        // Initialize default users
        List<User> users = DataManager.loadUsers();
        if (users.isEmpty()) {
            System.out.println("Initializing default users...");
            List<User> defaultUsers = createDefaultUsers();
            DataManager.saveUsers(defaultUsers);
            System.out.println("Default users created");
        }
    }
    
    private List<Product> createDefaultProducts() {
    List<Product> products = new ArrayList<>();
    
    
    products.add(new Product("1", "Nike Shoes", 123.99, "Clothes", 
        "Hanafi Zaharuddin", "Used: Like New", "pic/kasut1.jpg", 
        "High-quality Nike running shoes in excellent condition"));
    
    products.add(new Product("2", "Office Desk", 53.45, "Home Appliances",
        "Qaid Mubasyir", "New", "pic/Office Desk.jpg",
        "Wooden office desk, perfect for study"));
        
    products.add(new Product("3", "Jisulife Portable Fan", 12.20, "Electronics",
        "Raja Adam", "Used: Good", "pic/Jisulife Portable Fan.jpg",
        "Portable USB fan with battery"));
        
    products.add(new Product("4", "Calculator", 20.99, "Education",
        "Afiq Fitri", "Used: Poor", "pic/Casio Calculator.jpg",
        "Casio scientific calculator"));
        
    products.add(new Product("5", "Blue Shirt Size XL", 5.00, "Clothes",
        "Hanafi Zaharuddin", "Used: Good", "pic/blue shirt.jpg",
        "Blue casual shirt, size XL"));
        
    products.add(new Product("6", "iPhone 13 256GB White", 1151.99, "Electronics",
        "Afiq Fitri", "Used: Like New", "pic/iPhone 13 second.jpg",
        "iPhone 13 in excellent condition"));
        
    products.add(new Product("7", "IKEA Wood Chair", 23.99, "Home Appliances",
        "Arif Isahak", "Used: Good", "pic/IKEA NORDVIKEN chair.jpg",
        "IKEA wooden chair"));
        
    products.add(new Product("8", "Ninja Air Fryer", 80.00, "Home Appliances",
        "Danish", "Used: Like New", "pic/Ninja Air Fryer.jpg",
        "Ninja air fryer in good condition"));
        
    products.add(new Product("9", "Men's Axis Pant Size M", 13.49, "Clothes",
        "Syazwan", "Used: Good", "pic/Men's Axis Pant.jpg",
        "Men's axis pant size M"));
        
    products.add(new Product("10", "Magsafe iPhone 16 Pro Case", 9.00, "Electronics",
        "Muhammad", "Used: Like New", "pic/Magsafe iPhone 16 Pro Case.jpg",
        "Magsafe iPhone case"));
        
    products.add(new Product("11", "School Beg", 12.79, "Education",
        "Ahmad", "Used: Like New", "pic/Beg Sekolah.jpg",
        "School bag"));
        
    products.add(new Product("12", "Adidas Train Short", 3.00, "Clothes",
        "Amirul", "Used: Poor", "pic/Adidas Train Short.jpg",
        "Adidas training shorts"));
        
    return products;
}
    
    private List<User> createDefaultUsers() {
        List<User> users = new ArrayList<>();
        users.add(new User("1", "admin", "admin@usm.my", "admin123", "admin", "ADMIN001"));
        users.add(new User("2", "student", "student@usm.my", "student123", "student", "22304500"));
        return users;
    }
    
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("USM E-Mart Application shutting down");
    }
}
