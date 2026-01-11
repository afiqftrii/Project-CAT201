package com.usmemart.servlets;

import com.usmemart.Product;
import com.usmemart.DataManager;
import com.google.gson.Gson;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;

import java.io.*;
import java.util.List;
import java.util.UUID;

@WebServlet("/api/products")
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024, // 1MB
    maxFileSize = 1024 * 1024 * 5,   // 5MB
    maxRequestSize = 1024 * 1024 * 10 // 10MB
)

public class ProductServlet extends HttpServlet {
    private Gson gson = new Gson();
    private static final String UPLOAD_DIR = "uploads";
    
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
        
        String userId = (String) session.getAttribute("userId");
        String username = (String) session.getAttribute("username");
        
        try {
            // Handle multipart form data
            String name = request.getParameter("name");
            String category = request.getParameter("category");
            String condition = request.getParameter("condition");
            double price = Double.parseDouble(request.getParameter("price"));
            String description = request.getParameter("description");
            Part filePart = request.getPart("image");
            
            // Generate unique ID
            String productId = "prod_" + System.currentTimeMillis();
            
            // Handle image upload
            String imagePath = "pic/default-item.jpg"; // Default image
            
            if (filePart != null && filePart.getSize() > 0) {
                // Get application path
                String appPath = request.getServletContext().getRealPath("");
                String uploadPath = appPath + File.separator + UPLOAD_DIR;
                
                // Create upload directory if it doesn't exist
                File uploadDir = new File(uploadPath);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                
                // Generate unique filename
                String fileName = productId + "_" + getFileName(filePart);
                String filePath = uploadPath + File.separator + fileName;
                
                // Save file
                try (InputStream fileContent = filePart.getInputStream();
                     FileOutputStream out = new FileOutputStream(filePath)) {
                    
                    byte[] buffer = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = fileContent.read(buffer)) != -1) {
                        out.write(buffer, 0, bytesRead);
                    }
                }
                
                // Set image path relative to web app
                imagePath = UPLOAD_DIR + "/" + fileName;
            }
            
            // Create product
            Product newProduct = new Product(
                productId, name, price, category, 
                username, condition, imagePath, description
            );
            
            // Add to products list
            List<Product> products = DataManager.loadProducts();
            products.add(newProduct);
            DataManager.saveProducts(products);
            
            PrintWriter out = response.getWriter();
            out.print("{\"success\": true, \"message\": \"Product added successfully\"}");
            out.flush();
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print("{\"success\": false, \"message\": \"Error adding product: " + e.getMessage() + "\"}");
        }
    }
    
    // Helper method to get filename from part
    private String getFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] tokens = contentDisp.split(";");
        for (String token : tokens) {
            if (token.trim().startsWith("filename")) {
                return token.substring(token.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return "unknown.jpg";
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
