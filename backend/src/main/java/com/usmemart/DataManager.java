package com.usmemart;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DataManager {
    private static String DATA_DIR;
    private static final Gson gson = new Gson();
    private static boolean initialized = false;
    
    public static synchronized void init(String contextPath) {
    if (initialized) return;
    
    // Use a directory outside webapp for write permissions
    // For Tomcat, use the user's home directory or a dedicated data folder
    String userHome = System.getProperty("user.home");
    DATA_DIR = userHome + File.separator + "usm-emart-data" + File.separator;
    
    System.out.println("=== DataManager Initialization ===");
    System.out.println("User Home: " + userHome);
    System.out.println("Data directory: " + DATA_DIR);
    
    // Create all necessary directories
    File dir = new File(DATA_DIR);
    if (!dir.exists()) {
        boolean created = dir.mkdirs();
        System.out.println("Data directory created: " + created);
    }
    
    File cartsDir = new File(DATA_DIR + "carts");
    if (!cartsDir.exists()) {
        cartsDir.mkdirs();
        System.out.println("Carts directory created");
    }
    
    // Initialize default data
    loadUsers(); // This will create default users if needed
    loadProducts(); // This will create default products if needed
    
    initialized = true;
    System.out.println("DataManager initialized successfully");
    
    // Debug: List created files
    System.out.println("Created files:");
    File[] files = dir.listFiles();
    if (files != null) {
        for (File file : files) {
            System.out.println("  - " + file.getName() + " (" + file.length() + " bytes)");
        }
    }
}
    
    // User management
    public static List<User> loadUsers() {
        try {
            File file = new File(DATA_DIR + "users.json");
            System.out.println("Loading users from: " + file.getAbsolutePath());
            
            if (!file.exists()) {
                System.out.println("Creating default users...");
                List<User> defaultUsers = createDefaultUsers();
                saveUsers(defaultUsers);
                return defaultUsers;
            }
            
            BufferedReader reader = new BufferedReader(new FileReader(file));
            Type userListType = new TypeToken<List<User>>(){}.getType();
            List<User> users = gson.fromJson(reader, userListType);
            reader.close();
            
            if (users == null) {
                System.out.println("Users file is empty, creating defaults");
                users = createDefaultUsers();
                saveUsers(users);
            }
            
            System.out.println("Loaded " + users.size() + " users");
            return users;
        } catch (IOException e) {
            System.err.println("Error loading users: " + e.getMessage());
            e.printStackTrace();
            return createDefaultUsers();
        }
    }
    
    public static void saveUsers(List<User> users) {
        try {
            File file = new File(DATA_DIR + "users.json");
            System.out.println("Saving users to: " + file.getAbsolutePath());
            
            FileWriter writer = new FileWriter(file);
            gson.toJson(users, writer);
            writer.close();
            System.out.println("Saved " + users.size() + " users");
        } catch (IOException e) {
            System.err.println("Error saving users: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Product management
    public static List<Product> loadProducts() {
        try {
            File file = new File(DATA_DIR + "products.json");
            System.out.println("Loading products from: " + file.getAbsolutePath());
            
            if (!file.exists()) {
                System.out.println("Creating default products...");
                List<Product> defaultProducts = createDefaultProducts();
                saveProducts(defaultProducts);
                return defaultProducts;
            }
            
            BufferedReader reader = new BufferedReader(new FileReader(file));
            Type productListType = new TypeToken<List<Product>>(){}.getType();
            List<Product> products = gson.fromJson(reader, productListType);
            reader.close();
            
            if (products == null) {
                System.out.println("Products file is empty, creating defaults");
                products = createDefaultProducts();
                saveProducts(products);
            }
            
            System.out.println("Loaded " + products.size() + " products");
            return products;
        } catch (IOException e) {
            System.err.println("Error loading products: " + e.getMessage());
            e.printStackTrace();
            return createDefaultProducts();
        }
    }
    
    public static void saveProducts(List<Product> products) {
        try {
            File file = new File(DATA_DIR + "products.json");
            System.out.println("Saving products to: " + file.getAbsolutePath());
            
            FileWriter writer = new FileWriter(file);
            gson.toJson(products, writer);
            writer.close();
            System.out.println("Saved " + products.size() + " products");
        } catch (IOException e) {
            System.err.println("Error saving products: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    
    // Order management
    public static List<Order> loadOrders() {
        try {
            File file = new File(DATA_DIR + "orders.json");
            System.out.println("Loading orders from: " + file.getAbsolutePath());
            
            if (!file.exists()) {
                System.out.println("No orders file, returning empty list");
                return new ArrayList<>();
            }
            
            BufferedReader reader = new BufferedReader(new FileReader(file));
            Type orderListType = new TypeToken<List<Order>>(){}.getType();
            List<Order> orders = gson.fromJson(reader, orderListType);
            reader.close();
            
            if (orders == null) {
                return new ArrayList<>();
            }
            
            System.out.println("Loaded " + orders.size() + " orders");
            return orders;
        } catch (IOException e) {
            System.err.println("Error loading orders: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    public static void saveOrders(List<Order> orders) {
        try {
            File file = new File(DATA_DIR + "orders.json");
            System.out.println("Saving orders to: " + file.getAbsolutePath());
            
            FileWriter writer = new FileWriter(file);
            gson.toJson(orders, writer);
            writer.close();
            System.out.println("Saved " + orders.size() + " orders");
        } catch (IOException e) {
            System.err.println("Error saving orders: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Cart management
    public static void saveCart(String userId, List<CartItem> cart) {
        try {
            File file = new File(DATA_DIR + "carts/" + userId + ".json");
            System.out.println("Saving cart for user " + userId + " to: " + file.getAbsolutePath());
            
            FileWriter writer = new FileWriter(file);
            gson.toJson(cart, writer);
            writer.close();
            System.out.println("Saved cart with " + cart.size() + " items");
        } catch (IOException e) {
            System.err.println("Error saving cart: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public static List<CartItem> loadCart(String userId) {
        try {
            File file = new File(DATA_DIR + "carts/" + userId + ".json");
            System.out.println("Loading cart for user " + userId + " from: " + file.getAbsolutePath());
            
            if (!file.exists()) {
                System.out.println("No cart file for user " + userId);
                return new ArrayList<>();
            }
            
            BufferedReader reader = new BufferedReader(new FileReader(file));
            Type cartListType = new TypeToken<List<CartItem>>(){}.getType();
            List<CartItem> cart = gson.fromJson(reader, cartListType);
            reader.close();
            
            if (cart == null) {
                return new ArrayList<>();
            }
            
            System.out.println("Loaded cart with " + cart.size() + " items");
            return cart;
        } catch (IOException e) {
            System.err.println("Error loading cart: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    public static void clearCart(String userId) {
        File file = new File(DATA_DIR + "carts/" + userId + ".json");
        if (file.exists()) {
            boolean deleted = file.delete();
            System.out.println("Cart cleared for user " + userId + ": " + deleted);
        } else {
            System.out.println("No cart file to delete for user " + userId);
        }
    }
    
    // Helper methods for default data
    private static List<Product> createDefaultProducts() {
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
    
    private static List<User> createDefaultUsers() {
        List<User> users = new ArrayList<>();
        users.add(new User("1", "admin", "admin@usm.my", "admin123", "admin", "ADMIN001"));
        users.add(new User("2", "student", "student@usm.my", "student123", "student", "22304500"));
        return users;
    }
}
