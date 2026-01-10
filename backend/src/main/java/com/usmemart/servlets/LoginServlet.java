package com.usmemart.servlets;

import com.usmemart.User;
import com.usmemart.DataManager;
import com.google.gson.Gson;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.List;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {
    private Gson gson = new Gson();
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Read request body
        BufferedReader reader = request.getReader();
        LoginRequest loginReq = gson.fromJson(reader, LoginRequest.class);
        
        // Load users
        List<User> users = DataManager.loadUsers();
        
        // Find matching user
        User foundUser = null;
        for (User user : users) {
            if (user.getEmail().equals(loginReq.email) && 
                user.getPassword().equals(loginReq.password)) {
                foundUser = user;
                break;
            }
        }
        
        PrintWriter out = response.getWriter();
        if (foundUser != null) {
            // Set session
            HttpSession session = request.getSession();
            session.setAttribute("userId", foundUser.getId());
            session.setAttribute("userRole", foundUser.getRole());
            session.setAttribute("username", foundUser.getUsername());
            session.setAttribute("userEmail", foundUser.getEmail()); 
            
            // Return user info (without password)
            LoginResponse loginRes = new LoginResponse(
                true, "Login successful", 
                foundUser.getId(), foundUser.getUsername(), foundUser.getRole()
            );
            out.print(gson.toJson(loginRes));
        } else {
            LoginResponse loginRes = new LoginResponse(false, "Invalid email or password", null, null, null);
            out.print(gson.toJson(loginRes));
        }
        out.flush();
    }
    
    // Helper classes for JSON
    private static class LoginRequest {
        String email;
        String password;
    }
    
    private static class LoginResponse {
        boolean success;
        String message;
        String userId;
        String username;
        String role;
        
        LoginResponse(boolean success, String message, String userId, String username, String role) {
            this.success = success;
            this.message = message;
            this.userId = userId;
            this.username = username;
            this.role = role;
        }
    }
}
