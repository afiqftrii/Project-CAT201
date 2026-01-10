package com.usmemart.servlets;

import com.usmemart.Product;
import com.usmemart.DataManager;
import com.google.gson.Gson;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.*;
import java.util.List;

@WebServlet("/api/products/*")
public class SpecificProductServlet extends HttpServlet {
    private Gson gson = new Gson();
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print("{\"error\": \"Product ID required\"}");
            return;
        }
        
        // Extract product ID from path
        String productId = pathInfo.substring(1); // Remove leading "/"
        
        List<Product> products = DataManager.loadProducts();
        Product foundProduct = null;
        
        for (Product product : products) {
            if (product.getId().equals(productId)) {
                foundProduct = product;
                break;
            }
        }
        
        PrintWriter out = response.getWriter();
        if (foundProduct != null) {
            out.print(gson.toJson(foundProduct));
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            out.print("{\"error\": \"Product not found\"}");
        }
        out.flush();
    }
}
