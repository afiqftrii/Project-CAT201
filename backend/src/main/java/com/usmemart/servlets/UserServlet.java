package com.usmemart.servlets;

import com.usmemart.User;
import com.usmemart.DataManager;
import com.google.gson.Gson;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.*;
import java.util.List;


public class UserServlet extends HttpServlet {
    private Gson gson = new Gson();
    
    // POST: Register new user
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        BufferedReader reader = request.getReader();
        RegistrationRequest regReq = gson.fromJson(reader, RegistrationRequest.class);
        
        if (regReq == null || regReq.email == null || regReq.password == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print("{\"success\": false, \"message\": \"Invalid request\"}");
            return;
        }
        
        // Check if user already exists
        List<User> users = DataManager.loadUsers();
        for (User user : users) {
            if (user.getEmail().equals(regReq.email)) {
                response.getWriter().print("{\"success\": false, \"message\": \"Email already registered\"}");
                return;
            }
        }
        
        // Create new user
        String newId = "user_" + System.currentTimeMillis();
        User newUser = new User(newId, regReq.username, regReq.email, 
                               regReq.password, "student", regReq.matric);
        
        users.add(newUser);
        DataManager.saveUsers(users);
        
        PrintWriter out = response.getWriter();
        out.print("{\"success\": true, \"message\": \"Registration successful\", \"userId\": \"" + newId + "\"}");
        out.flush();
    }
    
    // GET: Get user profile
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
        List<User> users = DataManager.loadUsers();
        
        User user = null;
        for (User u : users) {
            if (u.getId().equals(userId)) {
                user = u;
                break;
            }
        }
        
        if (user != null) {
            // Don't send password
            user.setPassword(null);
            PrintWriter out = response.getWriter();
            out.print(gson.toJson(user));
            out.flush();
        } else {
            response.getWriter().print("{\"error\": \"User not found\"}");
        }
    }
    
    private static class RegistrationRequest {
        String username;
        String email;
        String password;
        String matric;
    }
}