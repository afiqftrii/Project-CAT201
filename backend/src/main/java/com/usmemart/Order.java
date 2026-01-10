package com.usmemart;

import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.List;

public class Order {
    private String id;
    private String buyer;
    private String date;  // Changed from Date to String
    private List<CartItem> items;
    private double subtotal;
    private double fee;
    private double total;
    private String status;
    
    public Order() {
        this.date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        this.status = "Processing";
    }
    
    public Order(String id, String buyer, List<CartItem> items, double subtotal, double fee, double total) {
        this();
        this.id = id;
        this.buyer = buyer;
        this.items = items;
        this.subtotal = subtotal;
        this.fee = fee;
        this.total = total;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getBuyer() { return buyer; }
    public void setBuyer(String buyer) { this.buyer = buyer; }
    
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    
    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }
    
    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    
    public double getFee() { return fee; }
    public void setFee(double fee) { this.fee = fee; }
    
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}