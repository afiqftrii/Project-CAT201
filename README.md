# USM E-Mart - Student Marketplace

## Project Description
USM E-Mart is an e-commerce platform exclusively for USM students to buy and sell items within the campus community.

## Team Members
1. Muhammad Afiq Fitri bin Mohd Mazlan
2. Muhammad Hanafi bin Zaharuddin
3. Muhammad Qaid Mubasyir bin Yahya
4. Raja Adam Haziq bin Raja Muhd Zulkhairi

## Features
- Student registration and login
- Browse items by category
- Post items for sale
- Shopping cart functionality
- Order management
- Admin panel for monitoring

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Java Servlets
- **Build Tool**: Maven
- **Server**: Apache Tomcat

# Project Structure
- USM-EMart/
- ├── backend/
- │   ├── src/main/java/com/usmemart/
- │   │   ├── User.java
- │   │   ├── Product.java
- │   │   ├── Order.java
- │   │   ├── CartItem.java
- │   │   ├── DataManager.java 
- │   │   ├── ContextListener.java
- │   │   ├── servlets/
- │   │   │   ├── LoginServlet.java
- │   │   │   ├── ProductServlet.java
- │   │   │   ├── CartServlet.java 
- │   │   │   ├── OrderServlet.java 
- │   │   │   ├── AdminServlet.java
- │   │   │   ├── UserServlet.java
- │   │   │   ├── SpecificProductServlet.java
- │   │   │   ├── LogoutServlet.java
- │   │   │   └── ImageServlet.java
- │   │   └── filters/
- │   │       └── CorsFilter.java
- │   ├── src/main/webapp/
- │   │   ├── index.html 
- │   │   ├── login.html 
- │   │   ├── sell.html
- │   │   ├── cart.html
- │   │   ├── admin.html
- │   │   ├── style.css
- │   │   ├── app.js 
- │   │   ├── api-service.js 
- │   │   ├── pic/ (images)
- │   │   ├── WEB-INF/web.xml
- │   │   ├── orders.html
- │   │   ├── order-confirmation.html
- │   │   └── checkout.html
- │   └── pom.xml
- └── ~/usm-emart-data/ (created at runtime)
-   ├── users.json (auto-generated)
-   ├── products.json (auto-generated)
-   ├── orders.json (auto-generated)
-   └── carts/ (user cart files)

## Installation and Setup

### Prerequisites
1.Java Development Kit (JDK) 8
Version: Must be exactly Java 8 (1.8.0_xxx)
Download: https://adoptium.net/temurin/releases/?version=8
Verify: Run java -version and ensure output shows 1.8.0_xxx

2.Apache Maven 3.9.12
Download: https://maven.apache.org/download.cgi
Verify: Run mvn -v and check version
Purpose: Builds the project and manages dependencies

3.Apache Tomcat 9.0.113
Download: https://tomcat.apache.org/download-90.cgi
Choose: apache-tomcat-9.0.113-windows-x64.zip (Windows)

### Setup
1.Make sure to run this command in terminal to reset war file
cd backend
mvn clean
mvn compile
mvn package

2.Go to Project-CAT201/backend/target then copy the newly generated usm-emart.war

3.Paste it in your Apache Program Files in webapps folder (e.g: C:\Users\AFIQFRII\Downloads\apache-tomcat-9.0.113\apache-tomcat-9.0.113\webapps)

4.Start the tomcat server.

5.Go to Project-CAT201/backend/webapp and copy "admin.html","api-service.js","app.js","cart.html","index.html","login.html","sell.html"."style.css" and pic folder.

6.Paste these files and folder in your Apache Program FIles in webapp folder (e.g: C:\Users\AFIQFRII\Downloads\apache-tomcat-9.0.113\apache-tomcat-9.0.113\webapps)

7.Refresh the localhost:8080 page and then enter localhost:8080/usm-emart

8.The website should be functional as long the setup are executed properly.
