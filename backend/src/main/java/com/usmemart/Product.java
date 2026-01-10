package com.usmemart;

public class Product {
    private String id;
    private String name;
    private double price;
    private String category;
    private String seller;
    private String condition;
    private String image;
    private String description;
    
    public Product() {}
    
    public Product(String id, String name, double price, String category, 
                   String seller, String condition, String image, String description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.seller = seller;
        this.condition = condition;
        this.image = image;
        this.description = description;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getSeller() { return seller; }
    public void setSeller(String seller) { this.seller = seller; }
    
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}