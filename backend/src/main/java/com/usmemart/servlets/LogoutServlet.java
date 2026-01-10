package com.usmemart.servlets;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.*;


public class LogoutServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        
        PrintWriter out = response.getWriter();
        out.print("{\"success\": true, \"message\": \"Logged out successfully\"}");
        out.flush();
    }
}