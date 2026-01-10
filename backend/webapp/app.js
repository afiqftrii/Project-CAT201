// USM E-Mart - Simple E-commerce
// Data storage using localStorage

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Remove this line:
    // initData();
    
    // Keep rest as is:
    setupEventListeners();
    
    if (isHomePage()) {
        loadProducts();
    }
    
    checkLoginStatus();
}

// ========== DATA MANAGEMENT ==========
/*function initData() {
    // Initialize users if empty
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            {
                id: '1',
                username: 'admin',
                email: 'admin@usm.my',
                password: 'admin123',
                role: 'admin',
                matric: 'ADMIN001'
            },
            {
                id: '2', 
                username: 'student',
                email: 'student@usm.my',
                password: 'student123',
                role: 'student',
                matric: '22304500'
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    
    // In initData() function, replace the defaultProducts array with:
    if (!localStorage.getItem('products')) {
        const defaultProducts = [
            {
                id: '1',
                name: 'Nike Shoes',
                price: 123.99,
                category: 'Clothes',
                seller: 'Hanafi Zaharuddin',
                condition: 'Used: Like New',
                image: 'pic/kasut1.jpg',
                description: 'High-quality Nike running shoes in excellent condition'
            },
            {
                id: '2',
                name: 'Office Desk',
                price: 53.45,
                category: 'Home Appliances',
                seller: 'Qaid Mubasyir',
                condition: 'New',
                image: 'pic/Office Desk.jpg',
                description: 'Wooden office desk, perfect for study'
            },
            {
                id: '3',
                name: 'Jisulife Portable Fan',
                price: 12.20,
                category: 'Electronics',
                seller: 'Raja Adam',
                condition: 'Used: Good',
                image: 'pic/Jisulife Portable Fan.jpg',
                description: 'Portable USB fan with battery'
            },
            {
                id: '4',
                name: 'Calculator',
                price: 20.99,
                category: 'Education',
                seller: 'Afiq Fitri',
                condition: 'Used: Poor',
                image: 'pic/Casio Calculator.jpg',
                description: 'Casio scientific calculator'
            },
            {
                id: '5',
                name: 'Blue Shirt Size XL',
                price: 5.00,
                category: 'Clothes',
                seller: 'Hanafi Zaharuddin',
                condition: 'Used: Good',
                image: 'pic/blue shirt.jpg',
                description: 'Blue casual shirt, size XL'
            },
            {
                id: '6',
                name: 'iPhone 13 256GB White',
                price: 1151.99,
                category: 'Electronics',
                seller: 'Afiq Fitri',
                condition: 'Used: Like New',
                image: 'pic/iPhone 13 second.jpg',
                description: 'iPhone 13 in excellent condition'
            },
            {
                id: '7',
                name: 'IKEA Wood Chair',
                price: 23.99,
                category: 'Home Appliances',
                seller: 'Arif Isahak',
                condition: 'Used: Good',
                image: 'pic/IKEA NORDVIKEN chair.jpg',
                description: 'IKEA wooden chair'
            },
            {
                id: '8',
                name: 'Ninja Air Fryer',
                price: 80.00,
                category: 'Home Appliances',
                seller: 'Danish',
                condition: 'Used: Like New',
                image: 'pic/Ninja Air Fryer.jpg',
                description: 'Ninja air fryer in good condition'
            },
            {
                id: '9',
                name: 'Men\'s Axis Pant Size M',
                price: 13.49,
                category: 'Clothes',
                seller: 'Syazwan',
                condition: 'Used: Good',
                image: 'pic/Men\'s Axis Pant.jpg',
                description: 'Men\'s axis pant size M'
            },
            {
                id: '10',
                name: 'Magsafe iPhone 16 Pro Case',
                price: 9.00,
                category: 'Electronics',
                seller: 'Muhammad',
                condition: 'Used: Like New',
                image: 'pic/Magsafe iPhone 16 Pro Case.jpg',
                description: 'Magsafe iPhone case'
            },
            {
                id: '11',
                name: 'School Beg',
                price: 12.79,
                category: 'Education',
                seller: 'Ahmad',
                condition: 'Used: Like New',
                image: 'pic/Beg Sekolah.jpg',
                description: 'School bag'
            },
            {
                id: '12',
                name: 'Adidas Train Short',
                price: 3.00,
                category: 'Clothes',
                seller: 'Amirul',
                condition: 'Used: Poor',
                image: 'pic/Adidas Train Short.jpg',
                description: 'Adidas training shorts'
            }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    
    // Initialize cart if empty
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Initialize orders if empty
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
}*/

// ========== PAGE DETECTION ==========
function isHomePage() {
    return window.location.pathname.includes('index.html') || 
           window.location.pathname.endsWith('/') ||
           window.location.pathname === '';
}

function isLoginPage() {
    return window.location.pathname.includes('login.html');
}

function isSellPage() {
    return window.location.pathname.includes('sell.html');
}

function isCartPage() {
    return window.location.pathname.includes('cart.html');
}

function isAdminPage() {
    return window.location.pathname.includes('admin.html');
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    // SELL button - works on any page
    document.addEventListener('click', function(e) {
        if (e.target.closest('.sell')) {
            e.preventDefault();
            const user = getCurrentUser();
            if (user) {
                window.location.href = 'sell.html';
            } else {
                alert('Please login to sell items');
                window.location.href = 'login.html';
            }
        }
        
        // CART button - works on any page
        if (e.target.closest('.Cart')) {
            e.preventDefault();
            const user = getCurrentUser();
            if (user) {
                window.location.href = 'cart.html';
            } else {
                alert('Please login to view cart');
                window.location.href = 'login.html';
            }
        }
    });
    
    // Search functionality
    const searchInput = document.querySelector('.searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchProducts(this.value);
            }
        });
    }
    
    // Search icon
    const searchIcon = document.querySelector('.searchIcon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const searchInput = document.querySelector('.searchInput');
            if (searchInput && searchInput.value) {
                searchProducts(searchInput.value);
            }
        });
    }
    
    // Category filters
    const categoryButtons = document.querySelectorAll('.navBot button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterByCategory(this.textContent.trim());
        });
    });
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Sell form
    const sellForm = document.getElementById('sellForm');
    if (sellForm) {
        sellForm.addEventListener('submit', handleSellItem);
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

// ========== USER MANAGEMENT ==========
function checkLoginStatus() {
    const user = getCurrentUser();
    updateUIForLoggedInUser(user);
}

function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function updateUIForLoggedInUser(user) {
    const buttonsDiv = document.querySelector('.buttons');
    if (buttonsDiv) {
        if (user) {
            // User is logged in - show user info
            let adminButton = '';
            if (user.role === 'admin') {
                adminButton = `
                    <button class="admin-panel-btn" onclick="window.location.href='admin.html'">
                        ⚙️ ADMIN
                    </button>
                `;
            }
            
            buttonsDiv.innerHTML = `
                ${adminButton}
                <button class="sell">
                    SELL
                    <img class="plusicon" src="pic/plus4.png" />
                </button>
                <button class="Cart">
                    CART
                    <img class="carticon" src="pic/cart4.png" />
                </button>
                <div class="user-info">
                    <span style="color: white;">Hi, ${user.username}</span>
                    <button onclick="logout()" style="margin-left: 10px; background: #555; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                        Logout
                    </button>
                </div>
            `;
        } else {
            // User is NOT logged in - show login button
            buttonsDiv.innerHTML = `
                <button class="sell" onclick="window.location.href='login.html'">
                    SELL
                    <img class="plusicon" src="pic/plus4.png" />
                </button>
                <button class="Cart" onclick="window.location.href='login.html'">
                    CART
                    <img class="carticon" src="pic/cart4.png" />
                </button>
                <button onclick="window.location.href='login.html'" 
                        style="background: #4CAF50; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    LOGIN
                </button>
            `;
        }
    }
}

// Replace the entire handleLogin function with this:
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const result = await ApiService.login(email, password);
        
        if (result.success) {
            // Store user info locally for UI updates
            localStorage.setItem('currentUser', JSON.stringify({
                id: result.userId,
                username: result.username,
                role: result.role
            }));
            
            alert(result.message || 'Login successful!');
            
            if (result.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            alert(result.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check server connection.');
    }
}

async function logout() {
    try {
        const result = await ApiService.logout();
        localStorage.removeItem('currentUser');
        alert(result.message || 'Logged out successfully');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('currentUser');
        alert('Logged out successfully');
        window.location.href = 'index.html';
    }
}

// ========== PRODUCT MANAGEMENT ==========

function validateProductData(product) {
    if (!product.id || !product.name || !product.price) {
        console.error('Invalid product data:', product);
        return false;
    }
    return true;
}

async function loadProducts(category = null) {
    console.log("Loading products... Category:", category);
    
    const productGrid = document.querySelector('.productGrid');
    
    if (!productGrid) {
        console.error("productGrid element not found!");
        return;
    }
    
    productGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 50px;">Loading products...</div>';
    
    try {
        // Get search query from input field
        const searchInput = document.querySelector('.searchInput');
        const searchQuery = searchInput ? searchInput.value.trim() : '';
        
        // Pass BOTH category and search query to ApiService
        const products = await ApiService.getProducts(category, searchQuery);
        console.log("Products received:", products);
        
        if (!products || products.length === 0) {
            productGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                    <h3>No products found</h3>
                    <p>${searchQuery ? 'Try a different search term or ' : ''}category</p>
                    <button class="sell" onclick="window.location.href='sell.html'">
                        SELL ITEM
                    </button>
                </div>
            `;
            return;
        }
        
        productGrid.innerHTML = '';
        products.forEach(product => {
            if (!product || !product.id) {
                console.error('Invalid product:', product);
                return;
            }
            const productElement = createProductElement(product);
            productGrid.innerHTML += productElement;
        });
        
        console.log("Finished loading", products.length, "products");
    } catch (error) {
        console.error('Error loading products:', error);
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #666;">
                <h3>Unable to load products</h3>
                <p>Error: ${error.message}</p>
                <p>Please check if server is running at ${API_BASE_URL}</p>
            </div>
        `;
    }
}

function createProductElement(product) {
    return `
        <div class="productLayout">
            <img class="productImage" src="${product.image}" onclick="viewProduct('${product.id}')"/>
            <div class="productInfo">
                <div class="typename">
                    <p class="productType">${product.category}</p>
                    <p class="productSeller">by ${product.seller}</p>
                </div>
                <div class="productNamegrid">
                    <p class="productName" onclick="viewProduct('${product.id}')" style="cursor: pointer;">
                        ${product.name}
                    </p>
                </div>
                <div class="condprice">
                    <p class="productPrice">RM${product.price.toFixed(2)}</p>
                    <p class="productCondition">${product.condition}</p>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function searchProducts(query) {
    if (!query.trim()) {
        loadProducts();
        return;
    }
    
    loadProducts(null, query);
}

function filterByCategory(category) {
    loadProducts(category);
}


async function viewProduct(productId) {
    try {
        const product = await ApiService.getProductById(productId);
        if (!product) {
            alert('Product not found');
            return;
        }
        
        // Create modal HTML (same as before, but with product from API)
        const modalHTML = `
        <div id="productModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 800px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <button onclick="closeModal()" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #333;
                    color: white;
                    border: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
                
                <div style="display: flex; gap: 30px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 300px;">
                        <img src="${product.image}" alt="${product.name}" style="
                            width: 100%;
                            height: 300px;
                            object-fit: cover;
                            border-radius: 10px;
                            margin-bottom: 20px;
                        ">
                        
                        <div style="
                            background: #f8f9fa;
                            padding: 20px;
                            border-radius: 10px;
                            margin-top: 20px;
                        ">
                            <h3 style="margin: 0 0 10px 0; color: #333;">Seller Information</h3>
                            <p style="margin: 5px 0;"><strong>Name:</strong> ${product.seller}</p>
                            <p style="margin: 5px 0;"><strong>Contact:</strong> Available after purchase</p>
                            <p style="margin: 5px 0;"><strong>Student Seller</strong> ✓</p>
                        </div>
                    </div>
                    
                    <div style="flex: 2; min-width: 300px;">
                        <h1 style="margin-top: 0; color: #333;">${product.name}</h1>
                        
                        <div style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 15px;
                            border-radius: 10px;
                            margin: 20px 0;
                        ">
                            <h2 style="margin: 0; font-size: 36px;">RM${product.price.toFixed(2)}</h2>
                            <div style="display: flex; gap: 10px; margin-top: 10px;">
                                <span style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 20px;">
                                    ${product.category}
                                </span>
                                <span style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 20px;">
                                    ${product.condition}
                                </span>
                            </div>
                        </div>
                        
                        <div style="margin: 20px 0;">
                            <h3 style="color: #555; margin-bottom: 10px;">Description</h3>
                            <p style="line-height: 1.6; color: #666;">${product.description}</p>
                        </div>
                        
                        <div style="
                            display: flex;
                            gap: 15px;
                            margin-top: 30px;
                            flex-wrap: wrap;
                        ">
                            <button onclick="addToCart('${product.id}'); closeModal();" style="
                                flex: 1;
                                padding: 15px;
                                background: #333;
                                color: white;
                                border: none;
                                border-radius: 8px;
                                font-size: 18px;
                                font-weight: bold;
                                cursor: pointer;
                                min-width: 200px;
                                transition: background 0.3s;
                            " onmouseover="this.style.background='#555'"
                            onmouseout="this.style.background='#333'">
                                🛒 Add to Cart
                            </button>
                            
                            <button onclick="closeModal()" style="
                                flex: 1;
                                padding: 15px;
                                background: #f0f0f0;
                                color: #333;
                                border: none;
                                border-radius: 8px;
                                font-size: 18px;
                                cursor: pointer;
                                min-width: 200px;
                                transition: background 0.3s;
                            " onmouseover="this.style.background='#e0e0e0'"
                            onmouseout="this.style.background='#f0f0f0'">
                                Continue Shopping
                            </button>
                        </div>
                        
                        <div style="
                            margin-top: 20px;
                            padding: 15px;
                            background: #fff8e1;
                            border-radius: 8px;
                            border-left: 4px solid #ffc107;
                        ">
                            <p style="margin: 0; color: #856404;">
                                ⚠️ <strong>Important:</strong> This is a student-to-student marketplace. 
                                All transactions are between USM students only.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        console.error('View product error:', error);
        alert('Error loading product details');
    }
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

async function addToCart(productId) {
    const user = getCurrentUser();
    if (!user) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const result = await ApiService.addToCart(productId);
        
        if (result.success) {
            alert(result.message || 'Item added to cart!');
        } else {
            alert(result.message || 'Failed to add to cart');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        alert('Failed to add to cart. Please try again.');
    }
}

// ========== SELL ITEM ==========
async function handleSellItem(e) {
    e.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        alert('Please login to sell items');
        window.location.href = 'login.html';
        return;
    }
    
    const itemName = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const condition = document.getElementById('condition').value;
    const price = parseFloat(document.getElementById('price').value);
    const description = document.getElementById('description').value;
    const imageUrl = document.getElementById('imageUrl').value || 'pic/default-item.jpg';
    
    const productData = {
        name: itemName,
        price: price,
        category: category,
        seller: user.username,
        condition: condition,
        image: imageUrl,
        description: description
    };
    
    try {
        const result = await ApiService.createProduct(productData);
        
        if (result.success) {
            alert(result.message || 'Item posted successfully!');
            window.location.href = 'index.html';
        } else {
            alert(result.message || 'Failed to post item');
        }
    } catch (error) {
        console.error('Sell item error:', error);
        alert('Failed to post item. Please try again.');
    }
}

// ========== CART FUNCTIONS ==========
async function loadCart() {
    const cartContent = document.getElementById('cartContent');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartContent) return;
    
    try {
        const cart = await ApiService.getCart();
        
        if (cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started!</p>
                    <a href="index.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #333; color: white; text-decoration: none; border-radius: 5px;">Continue Shopping</a>
                </div>
            `;
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }
        
        let html = '<div class="cart-items">';
        let subtotal = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            html += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-seller">Sold by: ${item.seller}</div>
                        <div class="cart-item-price">RM ${item.price.toFixed(2)}</div>
                        
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateCartQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn" onclick="updateCartQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                            <button class="remove-btn" onclick="removeFromCart('${item.productId}')">Remove</button>
                        </div>
                    </div>
                    <div style="font-weight: bold; font-size: 18px;">
                        RM ${itemTotal.toFixed(2)}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        cartContent.innerHTML = html;
        
        if (cartSummary) {
            cartSummary.style.display = 'block';
            const fee = subtotal * 0.02;
            const total = subtotal + fee;
            
            document.getElementById('subtotal').textContent = `RM ${subtotal.toFixed(2)}`;
            document.getElementById('fee').textContent = `RM ${fee.toFixed(2)}`;
            document.getElementById('total').textContent = `RM ${total.toFixed(2)}`;
        }
    } catch (error) {
        console.error('Load cart error:', error);
        cartContent.innerHTML = `
            <div class="empty-cart">
                <h3>Error loading cart</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

async function updateCartQuantity(productId, newQuantity) {
    try {
        const result = await ApiService.updateCartItem(productId, newQuantity);
        if (result.success) {
            loadCart();
        } else {
            alert(result.message || 'Failed to update quantity');
        }
    } catch (error) {
        console.error('Update cart quantity error:', error);
        alert('Failed to update quantity');
    }
}

async function removeFromCart(productId) {
    try {
        const result = await ApiService.removeFromCart(productId);
        if (result.success) {
            loadCart();
        } else {
            alert(result.message || 'Failed to remove item');
        }
    } catch (error) {
        console.error('Remove from cart error:', error);
        alert('Failed to remove item');
    }
}

async function handleCheckout() {
    const user = getCurrentUser();
    if (!user) {
        alert('Please login to checkout');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const cart = await ApiService.getCart();
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        
        // Calculate totals
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        const fee = subtotal * 0.02;
        const total = subtotal + fee;
        
        const orderData = {
            items: cart,
            subtotal: subtotal,
            fee: fee,
            total: total
        };
        
        const result = await ApiService.createOrder(orderData);
        
        if (result.success) {
            alert(`Order placed successfully!\nOrder ID: ${result.orderId}\nTotal: RM${total.toFixed(2)}`);
            window.location.href = 'index.html';
        } else {
            alert(result.message || 'Failed to place order');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to place order. Please try again.');
    }
}

// ========== ADMIN FUNCTIONS ==========
async function loadAdminPanel() {
    console.log("loadAdminPanel() called");
    
    const user = getCurrentUser();
    console.log("Current user:", user);
    
    if (!user) {
        console.log("No user logged in");
        window.location.href = 'login.html';
        return;
    }
    
    if (user.role !== 'admin') {
        console.log("User is not admin:", user.role);
        window.location.href = 'index.html';
        return;
    }
    
    console.log("Admin user verified, loading admin data...");
    
    // Load all admin data
    await loadAdminStats();
    await loadAdminOrders();
    await loadAdminProducts();
    await loadAdminUsers();
}

async function loadAdminStats() {
    try {
        const stats = await ApiService.getAdminStats();
        if (stats) {
            document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
            document.getElementById('totalProducts').textContent = stats.totalProducts || 0;
            document.getElementById('totalOrders').textContent = stats.totalOrders || 0;
            document.getElementById('totalRevenue').textContent = `RM ${(stats.totalRevenue || 0).toFixed(2)}`;
        }
    } catch (error) {
        console.error('Load admin stats error:', error);
    }
}

async function loadAdminOrders() {
    try {
        const orders = await ApiService.getAdminOrders();
        const tbody = document.querySelector('#ordersTable tbody');
        
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        orders.forEach(order => {
            const row = `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.date}</td>
                    <td>${order.buyer}</td>
                    <td>RM ${order.total.toFixed(2)}</td>
                    <td><span class="status status-processing">${order.status}</span></td>
                    <td>
                        <button class="btn-approve" onclick="updateOrderStatus('${order.id}', 'Completed')">Complete</button>
                        <button class="btn-reject" onclick="updateOrderStatus('${order.id}', 'Cancelled')">Cancel</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Load admin orders error:', error);
    }
}

async function loadAdminProducts() {
    try {
        const products = await ApiService.getAdminProducts();
        const tbody = document.querySelector('#productsTable tbody');
        
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        products.forEach(product => {
            const row = `
                <tr>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.seller}</td>
                    <td>RM ${product.price.toFixed(2)}</td>
                    <td><span class="status status-processing">Active</span></td>
                    <td>
                        <button class="btn-reject" onclick="removeProduct('${product.id}')">Remove</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Load admin products error:', error);
    }
}


async function loadAdminUsers() {
    try {
        const users = await ApiService.getAdminUsers();
        const tbody = document.querySelector('#usersTable tbody');
        
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.matric}</td>
                    <td>USM Student</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Load admin users error:', error);
    }
}


async function updateOrderStatus(orderId, status) {
    try {
        const result = await ApiService.updateOrderStatus(orderId, status);
        if (result.success) {
            alert(`Order ${orderId} marked as ${status}`);
            loadAdminOrders();
        } else {
            alert(result.message || 'Failed to update order');
        }
    } catch (error) {
        console.error('Update order status error:', error);
        alert('Failed to update order');
    }
}

async function removeProduct(productId) {
    try {
        const result = await ApiService.deleteProduct(productId);
        if (result.success) {
            alert('Product removed');
            loadAdminProducts();
        } else {
            alert(result.message || 'Failed to remove product');
        }
    } catch (error) {
        console.error('Remove product error:', error);
        alert('Failed to remove product');
    }
}

// ========== PAGE-SPECIFIC LOADERS ==========
// Run specific functions based on page
if (isCartPage()) {
    document.addEventListener('DOMContentLoaded', loadCart);
}

if (isAdminPage()) {
    document.addEventListener('DOMContentLoaded', loadAdminPanel);
}

// Add to end of app.js
// ========== TAB SWITCHING ==========
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}
