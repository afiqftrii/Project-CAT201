package com.usmemart.servlets;

import com.usmemart.Order;
import com.usmemart.CartItem;
import com.usmemart.DataManager;
import com.google.gson.Gson;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.*;

@WebServlet("/api/orders")
public class OrderServlet extends HttpServlet {
    private Gson gson = new Gson();
    
    // GET: Get user's orders (all orders for admin)
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
        String userRole = (String) session.getAttribute("userRole");
        
        List<Order> allOrders = DataManager.loadOrders();
        List<Order> userOrders = new ArrayList<>();
        
        if ("admin".equals(userRole)) {
            userOrders = allOrders;
        } else {
            for (Order order : allOrders) {
                if (order.getBuyer().equals(userId)) {
                    userOrders.add(order);
                }
            }
        }
        
        PrintWriter out = response.getWriter();
        out.print(gson.toJson(userOrders));
        out.flush();
    }
    
    // POST: Create new order from cart
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
        // Parse JSON
        StringBuilder jsonBuilder = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            jsonBuilder.append(line);
        }
        
        Gson gson = new Gson();
        OrderRequest orderReq = gson.fromJson(jsonBuilder.toString(), OrderRequest.class);
        
        if (orderReq == null || orderReq.items == null) {
            response.getWriter().print("{\"success\": false, \"message\": \"Invalid order data\"}");
            return;
        }
        
        // Create order
        Order order = new Order();
        order.setId("ORD_" + System.currentTimeMillis());
        order.setBuyer(userId);
        order.setItems(orderReq.items);
        order.setSubtotal(orderReq.subtotal);
        order.setFee(orderReq.fee);
        order.setTotal(orderReq.total);
        
        // Save order
        List<Order> orders = DataManager.loadOrders();
        orders.add(order);
        DataManager.saveOrders(orders);
        
        // Clear user's cart
        DataManager.clearCart(userId);
        
        PrintWriter out = response.getWriter();
        out.print(gson.toJson(new OrderResponse(true, "Order placed successfully", order.getId())));
        out.flush();
        
        System.out.println("Order created: " + order.getId() + " for user: " + userId);
        
    } catch (Exception e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().print("{\"success\": false, \"message\": \"Error creating order\"}");
    }
}
    
    // PUT: Update order status (admin only)
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        if (session == null || !"admin".equals(session.getAttribute("userRole"))) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().print("{\"success\": false, \"message\": \"Admin access required\"}");
            return;
        }
        
        BufferedReader reader = request.getReader();
        UpdateOrderRequest updateReq = gson.fromJson(reader, UpdateOrderRequest.class);
        
        List<Order> orders = DataManager.loadOrders();
        boolean updated = false;
        
        for (Order order : orders) {
            if (order.getId().equals(updateReq.orderId)) {
                order.setStatus(updateReq.status);
                updated = true;
                break;
            }
        }
        
        if (updated) {
            DataManager.saveOrders(orders);
            response.getWriter().print("{\"success\": true, \"message\": \"Order updated\"}");
        } else {
            response.getWriter().print("{\"success\": false, \"message\": \"Order not found\"}");
        }
    }
    
    // Helper classes
    private static class OrderRequest {
        List<CartItem> items;
        double subtotal;
        double fee;
        double total;
    }
    
    private static class OrderResponse {
        boolean success;
        String message;
        String orderId;
        
        OrderResponse(boolean success, String message, String orderId) {
            this.success = success;
            this.message = message;
            this.orderId = orderId;
        }
    }
    
    private static class UpdateOrderRequest {
        String orderId;
        String status;
    }
}
