package com.usmemart.servlets;

import com.usmemart.Product;
import com.usmemart.DataManager;
import com.google.gson.Gson;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.*;
import java.util.List;


public class ProductServlet extends HttpServlet {
    private Gson gson = new Gson();
    
    // GET: Get all products or by category
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
        throws ServletException, IOException {
    
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    
    List<Product> products = DataManager.loadProducts();
    String category = request.getParameter("category");
    String search = request.getParameter("search");
    
    // Filter by category
    if (category != null && !category.isEmpty() && !"All Product".equals(category)) {
        List<Product> filtered = new java.util.ArrayList<>();
        for (Product p : products) {
            if (category.equals(p.getCategory())) {
                filtered.add(p);
            }
        }
        products = filtered;
    }
    
    // Search by keyword
    // In ProductServlet doGet method, fix the search logic:
    if (search != null && !search.isEmpty()) {
    List<Product> searched = new java.util.ArrayList<>();
    String searchLower = search.toLowerCase();
    for (Product p : products) {
        if (p.getName().toLowerCase().contains(searchLower) ||
            (p.getCategory() != null && p.getCategory().toLowerCase().contains(searchLower)) ||
            (p.getSeller() != null && p.getSeller().toLowerCase().contains(searchLower)) ||
            (p.getDescription() != null && p.getDescription().toLowerCase().contains(searchLower))) {
            searched.add(p);
        }
    }
    products = searched;
}

    
    PrintWriter out = response.getWriter();
    out.print(gson.toJson(products));
    out.flush();
}
    
    // POST: Add new product
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Check session
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"success\": false, \"message\": \"Please login first\"}");
            return;
        }
        
        // Read product data
        BufferedReader reader = request.getReader();
        Product newProduct = gson.fromJson(reader, Product.class);
        
        // Generate ID
        newProduct.setId("prod_" + System.currentTimeMillis());
        
        // Add to products list
        List<Product> products = DataManager.loadProducts();
        products.add(newProduct);
        DataManager.saveProducts(products);
        
        PrintWriter out = response.getWriter();
        out.print("{\"success\": true, \"message\": \"Product added successfully\"}");
        out.flush();
    }
    
    // DELETE: Remove product (admin only)
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Check admin session
        HttpSession session = request.getSession(false);
        if (session == null || !"admin".equals(session.getAttribute("userRole"))) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().print("{\"success\": false, \"message\": \"Admin access required\"}");
            return;
        }
        
        String productId = request.getParameter("id");
        if (productId == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print("{\"success\": false, \"message\": \"Product ID required\"}");
            return;
        }
        
        List<Product> products = DataManager.loadProducts();
        boolean removed = products.removeIf(p -> p.getId().equals(productId));
        
        if (removed) {
            DataManager.saveProducts(products);
            response.getWriter().print("{\"success\": true, \"message\": \"Product removed\"}");
        } else {
            response.getWriter().print("{\"success\": false, \"message\": \"Product not found\"}");
        }
    }
}