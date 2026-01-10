package com.usmemart;

public class CartItem {
    private String productId;
    private String name;
    private double price;
    private String image;
    private String seller;
    private int quantity;
    
    public CartItem() {}
    
    public CartItem(String productId, String name, double price, String image, String seller, int quantity) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.image = image;
        this.seller = seller;
        this.quantity = quantity;
    }
    
    // Getters and Setters
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    
    public String getSeller() { return seller; }
    public void setSeller(String seller) { this.seller = seller; }
    
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
