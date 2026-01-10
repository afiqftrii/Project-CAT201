package com.usmemart.servlets;

import com.usmemart.CartItem;
import com.usmemart.Product;
import com.usmemart.DataManager;
import com.google.gson.Gson;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.*;

@WebServlet("/api/cart/*")
public class CartServlet extends HttpServlet {
    private Gson gson = new Gson();
    
    // GET: Get user's cart
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"error\": \"Please login first\"}");
            return;
        }
        
        String userId = (String) session.getAttribute("userId");
        List<CartItem> cart = DataManager.loadCart(userId);
        
        PrintWriter out = response.getWriter();
        out.print(gson.toJson(cart));
        out.flush();
    }
    
    // POST: Add item to cart
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
        throws ServletException, IOException {
    
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    
    HttpSession session = request.getSession(false);
    if (session == null || session.getAttribute("userId") == null) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().print("{\"success\": false, \"message\": \"Please login first\"}");
        return;
    }
    
    String userId = (String) session.getAttribute("userId");
    
    try {
        // Parse JSON from request body
        StringBuilder jsonBuilder = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            jsonBuilder.append(line);
        }
        
        Gson gson = new Gson();
        CartRequest cartReq = gson.fromJson(jsonBuilder.toString(), CartRequest.class);
        
        if (cartReq == null || cartReq.productId == null) {
            response.getWriter().print("{\"success\": false, \"message\": \"Invalid request\"}");
            return;
        }
        
        // Rest of the code remains the same...
        // Get product details
        List<Product> products = DataManager.loadProducts();
        Product product = null;
        for (Product p : products) {
            if (p.getId().equals(cartReq.productId)) {
                product = p;
                break;
            }
        }
        
        if (product == null) {
            response.getWriter().print("{\"success\": false, \"message\": \"Product not found\"}");
            return;
        }
        
        // Get user's cart
        List<CartItem> cart = DataManager.loadCart(userId);
        
        // Check if already in cart
        boolean found = false;
        for (CartItem item : cart) {
            if (item.getProductId().equals(cartReq.productId)) {
                item.setQuantity(item.getQuantity() + 1);
                found = true;
                break;
            }
        }
        
        // Add new item if not found
        if (!found) {
            cart.add(new CartItem(
                product.getId(), product.getName(), product.getPrice(),
                product.getImage(), product.getSeller(), 1
            ));
        }
        
        // Save cart
        DataManager.saveCart(userId, cart);
        
        PrintWriter out = response.getWriter();
        out.print("{\"success\": true, \"message\": \"Item added to cart\", \"cartSize\": " + cart.size() + "}");
        out.flush();
    } catch (Exception e) {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().print("{\"success\": false, \"message\": \"Server error: " + e.getMessage() + "\"}");
    }
}
    
    // PUT: Update cart item quantity
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"success\": false, \"message\": \"Please login first\"}");
            return;
        }
        
        String userId = (String) session.getAttribute("userId");
        
        BufferedReader reader = request.getReader();
        UpdateCartRequest updateReq = gson.fromJson(reader, UpdateCartRequest.class);
        
        if (updateReq == null || updateReq.productId == null) {
            response.getWriter().print("{\"success\": false, \"message\": \"Invalid request\"}");
            return;
        }
        
        List<CartItem> cart = DataManager.loadCart(userId);
        boolean updated = false;
        
        for (CartItem item : cart) {
            if (item.getProductId().equals(updateReq.productId)) {
                if (updateReq.quantity <= 0) {
                    cart.remove(item);
                } else {
                    item.setQuantity(updateReq.quantity);
                }
                updated = true;
                break;
            }
        }
        
        if (updated) {
            DataManager.saveCart(userId, cart);
            response.getWriter().print("{\"success\": true, \"message\": \"Cart updated\"}");
        } else {
            response.getWriter().print("{\"success\": false, \"message\": \"Item not found in cart\"}");
        }
    }
    
    // DELETE: Remove item from cart
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"success\": false, \"message\": \"Please login first\"}");
            return;
        }
        
        String userId = (String) session.getAttribute("userId");
        String productId = request.getParameter("productId");
        
        if (productId == null) {
            response.getWriter().print("{\"success\": false, \"message\": \"Product ID required\"}");
            return;
        }
        
        List<CartItem> cart = DataManager.loadCart(userId);
        boolean removed = cart.removeIf(item -> item.getProductId().equals(productId));
        
        if (removed) {
            DataManager.saveCart(userId, cart);
            response.getWriter().print("{\"success\": true, \"message\": \"Item removed from cart\"}");
        } else {
            response.getWriter().print("{\"success\": false, \"message\": \"Item not found in cart\"}");
        }
    }
    
    // Helper classes
    private static class CartRequest {
        String productId;
        int quantity = 1;
    }
    
    private static class UpdateCartRequest {
        String productId;
        int quantity;
    }
}
