package com.usmemart.servlets;

import com.usmemart.User;
import com.usmemart.Product;
import com.usmemart.Order;
import com.usmemart.DataManager;
import com.google.gson.Gson;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.List;

@WebServlet("/api/admin/*")
public class AdminServlet extends HttpServlet {
    private Gson gson = new Gson();
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Check admin session
        HttpSession session = request.getSession(false);
        if (session == null || !"admin".equals(session.getAttribute("userRole"))) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().print("{\"error\": \"Admin access required\"}");
            return;
        }
        
        String pathInfo = request.getPathInfo();
        
        if (pathInfo == null) {
            // Return all admin data
            AdminData adminData = getAdminData();
            PrintWriter out = response.getWriter();
            out.print(gson.toJson(adminData));
            out.flush();
            
        } else if ("/stats".equals(pathInfo)) {
            // Get admin statistics
            AdminStats stats = getAdminStats();
            PrintWriter out = response.getWriter();
            out.print(gson.toJson(stats));
            out.flush();
            
        } else if ("/users".equals(pathInfo)) {
            // Get all users
            List<User> users = DataManager.loadUsers();
            PrintWriter out = response.getWriter();
            out.print(gson.toJson(users));
            out.flush();
            
        } else if ("/products".equals(pathInfo)) {
            // Get all products
            List<Product> products = DataManager.loadProducts();
            PrintWriter out = response.getWriter();
            out.print(gson.toJson(products));
            out.flush();
            
        } else if ("/orders".equals(pathInfo)) {
            // Get all orders
            List<Order> orders = DataManager.loadOrders();
            PrintWriter out = response.getWriter();
            out.print(gson.toJson(orders));
            out.flush();
        }
    }
    
    // DELETE: Remove product or user
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        if (session == null || !"admin".equals(session.getAttribute("userRole"))) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().print("{\"success\": false, \"message\": \"Admin access required\"}");
            return;
        }
        
        String pathInfo = request.getPathInfo();
        String id = request.getParameter("id");
        
        if (id == null) {
            response.getWriter().print("{\"success\": false, \"message\": \"ID required\"}");
            return;
        }
        
        if ("/products".equals(pathInfo)) {
            // Delete product
            List<Product> products = DataManager.loadProducts();
            boolean removed = products.removeIf(p -> p.getId().equals(id));
            if (removed) {
                DataManager.saveProducts(products);
                response.getWriter().print("{\"success\": true, \"message\": \"Product removed\"}");
            } else {
                response.getWriter().print("{\"success\": false, \"message\": \"Product not found\"}");
            }
        }
    }
    
    private AdminStats getAdminStats() {
        List<User> users = DataManager.loadUsers();
        List<Product> products = DataManager.loadProducts();
        List<Order> orders = DataManager.loadOrders();
        
        double totalRevenue = 0;
        for (Order order : orders) {
            totalRevenue += order.getTotal();
        }
        
        return new AdminStats(
            users.size(), products.size(), orders.size(), totalRevenue
        );
    }
    
    private AdminData getAdminData() {
        List<User> users = DataManager.loadUsers();
        List<Product> products = DataManager.loadProducts();
        List<Order> orders = DataManager.loadOrders();
        
        double totalRevenue = 0;
        for (Order order : orders) {
            totalRevenue += order.getTotal();
        }
        
        return new AdminData(users, products, orders, totalRevenue);
    }
    
    // Helper classes
    private static class AdminStats {
        int totalUsers;
        int totalProducts;
        int totalOrders;
        double totalRevenue;
        
        AdminStats(int totalUsers, int totalProducts, int totalOrders, double totalRevenue) {
            this.totalUsers = totalUsers;
            this.totalProducts = totalProducts;
            this.totalOrders = totalOrders;
            this.totalRevenue = totalRevenue;
        }
    }
    
    private static class AdminData {
        List<User> users;
        List<Product> products;
        List<Order> orders;
        double totalRevenue;
        
        AdminData(List<User> users, List<Product> products, List<Order> orders, double totalRevenue) {
            this.users = users;
            this.products = products;
            this.orders = orders;
            this.totalRevenue = totalRevenue;
        }
    }
}
