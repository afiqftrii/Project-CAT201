// USM E-Mart - Simple E-commerce
// Data storage using localStorage

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupCategoryFilters();
    
    // Always check login status first
    checkLoginStatus();
    
    if (isHomePage()) {
        // Set default active category to "All Product"
        setTimeout(() => {
            const activeButton = document.querySelector('.navBot button.active-category');
            if (!activeButton) {
                updateActiveCategory('All Product');
            }
            loadProducts();
            
            // Update product count
            updateProductCount();
        }, 100);
    }
}

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

// ========== MODAL SERVICE ==========
class ModalService {
    static showLoginModal(redirectAction = 'add-to-cart', productId = null) {
        // Remove any existing modals first
        this.closeAllModals();
        
        let message = '';
        let buttons = '';
        
        switch(redirectAction) {
            case 'add-to-cart':
                message = 'Please login to add items to your cart.';
                buttons = `
                    <button onclick="ModalService.redirectToLogin('${redirectAction}', '${productId}')" 
                            class="modal-btn primary">
                        🔐 Login Now
                    </button>
                    <button onclick="ModalService.closeAllModals()" 
                            class="modal-btn secondary">
                        Continue Shopping
                    </button>
                `;
                break;
                
            case 'view-cart':
                message = 'Please login to view your shopping cart.';
                buttons = `
                    <button onclick="ModalService.redirectToLogin('${redirectAction}')" 
                            class="modal-btn primary">
                        🔐 Login Now
                    </button>
                    <button onclick="ModalService.closeAllModals()" 
                            class="modal-btn secondary">
                        Continue Shopping
                    </button>
                `;
                break;
                
            case 'sell':
                message = 'Please login to sell items on USM E-Mart.';
                buttons = `
                    <button onclick="ModalService.redirectToLogin('${redirectAction}')" 
                            class="modal-btn primary">
                        🔐 Login Now
                    </button>
                    <button onclick="ModalService.closeAllModals()" 
                            class="modal-btn secondary">
                        Maybe Later
                    </button>
                `;
                break;
                
            case 'checkout':
                message = 'Please login to complete your purchase.';
                buttons = `
                    <button onclick="ModalService.redirectToLogin('${redirectAction}')" 
                            class="modal-btn primary">
                        🔐 Login Now
                    </button>
                    <button onclick="ModalService.closeAllModals()" 
                            class="modal-btn secondary">
                        Continue Shopping
                    </button>
                `;
                break;
        }
        
        const modalHTML = `
        <div id="loginRequiredModal" class="custom-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: modalFadeIn 0.3s ease;
        ">
            <div class="modal-content" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 0;
                border-radius: 20px;
                max-width: 450px;
                width: 90%;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: modalSlideUp 0.4s ease;
            ">
                <!-- Modal Header -->
                <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 30px 30px 20px;
                    text-align: center;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                ">
                    <div style="
                        width: 80px;
                        height: 80px;
                        background: rgba(255,255,255,0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 20px;
                        backdrop-filter: blur(10px);
                    ">
                        <span style="color: white; font-size: 40px;">🔒</span>
                    </div>
                    <h3 style="
                        margin: 0;
                        color: white;
                        font-size: 24px;
                        font-weight: bold;
                    ">Login Required</h3>
                </div>
                
                <!-- Modal Body -->
                <div style="
                    padding: 30px;
                    background: white;
                    color: #333;
                    text-align: center;
                ">
                    <p style="
                        margin: 0 0 25px 0;
                        font-size: 16px;
                        line-height: 1.6;
                        color: #555;
                    ">${message}</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        ${buttons}
                    </div>
                    
                    <div style="
                        margin-top: 25px;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 10px;
                        border-left: 4px solid #4CAF50;
                    ">
                        <p style="
                            margin: 0;
                            font-size: 14px;
                            color: #666;
                            text-align: left;
                        ">
                            <strong>Demo Accounts:</strong><br>
                            👑 Admin: admin@usm.my / admin123<br>
                            👨‍🎓 Student: student@usm.my / student123
                        </p>
                    </div>
                </div>
                
                <!-- Modal Footer -->
                <div style="
                    padding: 15px 30px;
                    background: rgba(255,255,255,0.05);
                    text-align: center;
                    border-top: 1px solid rgba(255,255,255,0.1);
                ">
                    <p style="
                        margin: 0;
                        color: rgba(255,255,255,0.7);
                        font-size: 12px;
                    ">
                        USM Students Only • Secure Login
                    </p>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes modalSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
    }
    
    static redirectToLogin(action, productId = null) {
        // Store the intended action in localStorage
        if (productId) {
            localStorage.setItem('pendingAction', JSON.stringify({
                action: action,
                productId: productId
            }));
        } else {
            localStorage.setItem('pendingAction', JSON.stringify({
                action: action
            }));
        }
        
        window.location.href = 'login.html';
    }
    
    static showSuccessModal(title, message, options = {}) {
        this.closeAllModals();
        
        const showCartButton = options.showCartButton || false;
        const autoClose = options.autoClose || true;
        const timeout = options.timeout || 3000;
        
        const modalHTML = `
        <div id="successModal" class="custom-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: modalFadeIn 0.3s ease;
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 20px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: modalSlideUp 0.4s ease;
                border-top: 5px solid #4CAF50;
                position: relative;
            ">
                <button onclick="ModalService.closeAllModals()" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #f0f0f0;
                    color: #666;
                    border: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                " onmouseover="this.style.background='#e0e0e0'"
                onmouseout="this.style.background='#f0f0f0'">×</button>
                
                <div style="margin-bottom: 25px;">
                    <div style="
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 20px;
                        animation: successIcon 0.5s ease;
                    ">
                        <span style="color: white; font-size: 40px;">✓</span>
                    </div>
                    <h3 style="margin: 0 0 10px 0; color: #333; font-size: 24px;">${title}</h3>
                    <p style="color: #666; margin-bottom: 30px; line-height: 1.5;">${message}</p>
                </div>
                
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <button onclick="ModalService.closeAllModals()" style="
                        flex: 1;
                        padding: 15px;
                        background: #f0f0f0;
                        color: #333;
                        border: none;
                        border-radius: 10px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.3s;
                        min-width: 120px;
                    " onmouseover="this.style.background='#e0e0e0'"
                    onmouseout="this.style.background='#f0f0f0'">
                        Continue Shopping
                    </button>
                    
                    ${showCartButton ? `
                    <button onclick="window.location.href='cart.html'" style="
                        flex: 1;
                        padding: 15px;
                        background: linear-gradient(135deg, #333 0%, #555 100%);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-size: 16px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s;
                        min-width: 120px;
                    " onmouseover="this.style.background='linear-gradient(135deg, #555 0%, #777 100%)'"
                    onmouseout="this.style.background='linear-gradient(135deg, #333 0%, #555 100%)'">
                        🛒 View Cart
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
        
        <style>
            @keyframes successIcon {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                70% {
                    transform: scale(1.2);
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
        </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
        
        if (autoClose) {
            setTimeout(() => {
                this.closeAllModals();
            }, timeout);
        }
    }
    
    static showErrorModal(title, message) {
        this.closeAllModals();
        
        const modalHTML = `
        <div id="errorModal" class="custom-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: modalFadeIn 0.3s ease;
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 20px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: modalSlideUp 0.4s ease;
                border-top: 5px solid #ff4444;
            ">
                <div style="margin-bottom: 25px;">
                    <div style="
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 20px;
                    ">
                        <span style="color: white; font-size: 40px;">!</span>
                    </div>
                    <h3 style="margin: 0 0 10px 0; color: #333; font-size: 24px;">${title}</h3>
                    <p style="color: #666; margin-bottom: 30px; line-height: 1.5;">${message}</p>
                </div>
                
                <button onclick="ModalService.closeAllModals()" style="
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #333 0%, #555 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                " onmouseover="this.style.background='linear-gradient(135deg, #555 0%, #777 100%)'"
                onmouseout="this.style.background='linear-gradient(135deg, #333 0%, #555 100%)'">
                    Okay, I Understand
                </button>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
    }
    
    static closeAllModals() {
        const modals = document.querySelectorAll('.custom-modal');
        modals.forEach(modal => {
            modal.style.animation = 'modalFadeOut 0.3s ease';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 300);
        });
        document.body.style.overflow = 'auto';
        
        // Add fade out animation if not exists
        if (!document.querySelector('#modalAnimations')) {
            const style = document.createElement('style');
            style.id = 'modalAnimations';
            style.textContent = `
                @keyframes modalFadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    static checkPendingAction() {
        const pendingAction = localStorage.getItem('pendingAction');
        if (pendingAction) {
            const action = JSON.parse(pendingAction);
            localStorage.removeItem('pendingAction');
            
            const user = getCurrentUser();
            if (user) {
                switch(action.action) {
                    case 'add-to-cart':
                        if (action.productId) {
                            setTimeout(() => {
                                addToCart(action.productId);
                            }, 100);
                        }
                        break;
                    case 'view-cart':
                        window.location.href = 'cart.html';
                        break;
                    case 'sell':
                        window.location.href = 'sell.html';
                        break;
                    case 'checkout':
                        window.location.href = 'cart.html';
                        break;
                }
            }
        }
    }
}

// Add to window object for global access
window.ModalService = ModalService;

// ========== ENHANCED CATEGORY NAVIGATION FUNCTIONS ==========
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.navBot button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category') || this.textContent.trim();
            filterByCategory(category);
            
            // Update active state
            updateActiveCategory(category);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Set data-category attribute for easier identification
        const buttonText = button.textContent.replace(/[📦👕🏠📱📚]/g, '').trim();
        button.setAttribute('data-category', buttonText);
    });
}

function updateActiveCategory(selectedCategory) {
    // Remove active class from all buttons
    document.querySelectorAll('.navBot button').forEach(button => {
        button.classList.remove('active-category');
    });
    
    // Add active class to selected button
    document.querySelectorAll('.navBot button').forEach(button => {
        const buttonCategory = button.getAttribute('data-category') || button.textContent.replace(/[📦👕🏠📱📚]/g, '').trim();
        if (buttonCategory === selectedCategory) {
            button.classList.add('active-category');
        }
    });
    
    // Update URL hash for bookmarking
    if (selectedCategory !== 'All Product') {
        window.location.hash = `category=${encodeURIComponent(selectedCategory)}`;
    } else {
        window.location.hash = '';
    }
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    // SELL button - works on any page
    document.addEventListener('click', function(e) {
        const sellBtn = e.target.closest('.sell');
        const cartBtn = e.target.closest('.Cart');
        
        if (sellBtn) {
            e.preventDefault();
            const user = getCurrentUser();
            if (user) {
                window.location.href = 'sell.html';
            } else {
                ModalService.showLoginModal('sell');
            }
        }
        
        if (cartBtn) {
            e.preventDefault();
            const user = getCurrentUser();
            if (user) {
                window.location.href = 'cart.html';
            } else {
                ModalService.showLoginModal('view-cart');
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
    
    // Search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.querySelector('.searchInput');
            if (searchInput && searchInput.value) {
                searchProducts(searchInput.value);
            }
        });
    }
    
    // Setup enhanced category filters
    setupCategoryFilters();
    
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

    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function() {
            const preview = document.getElementById('imagePreview');
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    preview.innerHTML = `
                        <img src="${e.target.result}" 
                             style="max-width: 200px; max-height: 200px; border-radius: 5px; margin-top: 10px;">
                        <p style="font-size: 12px; color: #666; margin-top: 5px;">
                            Image preview (${Math.round(imageUpload.files[0].size / 1024)} KB)
                        </p>
                    `;
                }
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

// ========== USER MANAGEMENT ==========
function checkLoginStatus() {
    const user = getCurrentUser();
    updateUIForLoggedInUser(user);
    
    // Check for pending actions after login
    ModalService.checkPendingAction();
}

function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function updateUIForLoggedInUser(user) {
    const buttonsDiv = document.querySelector('.buttons');
    if (!buttonsDiv) {
        // For pages without .buttons div (like admin, cart), check nav-right
        const navRight = document.querySelector('.nav-right');
        if (navRight) {
            // Admin/Cart page specific
            return;
        }
        return;
    }
    
    // Check if we're in the home page index.html
    if (isHomePage()) {
        if (user) {
            // User is logged in - show user info and action buttons
            let adminButton = '';
            if (user.role === 'admin') {
                adminButton = `
                    <a href="admin.html" style="
                        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                        color: white;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        text-decoration: none;
                        display: inline-flex;
                        align-items: center;
                        gap: 5px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    " onmouseover="this.style.background='linear-gradient(135deg, #ff5252 0%, #ff3838 100%)'"
                    onmouseout="this.style.background='linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'">
                        ⚙️ ADMIN
                    </a>
                `;
            }
            
            buttonsDiv.innerHTML = `
                ${adminButton}
                <button class="sell">
                    <img class="plusicon" src="pic/plus4.png" />
                    SELL
                </button>
                <button class="Cart">
                    <img class="carticon" src="pic/cart4.png" />
                    CART
                </button>
                <div class="user-info" style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 8px 15px;
                    border-radius: 20px;
                    margin-left: 10px;
                ">
                    <span style="color: white; font-weight: 500;">Hi, ${user.username}</span>
                    <button onclick="logout()" style="
                        background: rgba(255, 255, 255, 0.2);
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 15px;
                        cursor: pointer;
                        font-size: 12px;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'"
                    onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                        Logout
                    </button>
                </div>
            `;
        } else {
            // User is NOT logged in - show login button with action buttons
            buttonsDiv.innerHTML = `
                <button class="sell" onclick="ModalService.showLoginModal('sell')">
                    <img class="plusicon" src="pic/plus4.png" />
                    SELL
                </button>
                <button class="Cart" onclick="ModalService.showLoginModal('view-cart')">
                    <img class="carticon" src="pic/cart4.png" />
                    CART
                </button>
                <button onclick="window.location.href='login.html'" 
                        style="
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            padding: 12px 20px;
                            border-radius: 30px;
                            font-size: 16px;
                            font-weight: bold;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                            white-space: nowrap;
                        " 
                        onmouseover="this.style.background='linear-gradient(135deg, #764ba2 0%, #667eea 100%)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)'"
                        onmouseout="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.3)'">
                    🔐 LOGIN
                </button>
            `;
        }
        
        // Re-attach event listeners for the buttons
        setupEventListeners();
    }
}

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
            
            ModalService.showSuccessModal('Login Successful', 'Welcome to USM E-Mart!');
            
            if (result.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            ModalService.showErrorModal('Login Failed', result.message || 'Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        ModalService.showErrorModal('Login Failed', 'Login failed. Please check server connection.');
    }
}

async function logout() {
    try {
        const result = await ApiService.logout();
        localStorage.removeItem('currentUser');
        ModalService.showSuccessModal('Logged Out', 'You have been successfully logged out.');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('currentUser');
        ModalService.showSuccessModal('Logged Out', 'You have been successfully logged out.');
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

async function loadProducts(category = null, search = null) {
    console.log("Loading products... Category:", category, "Search:", search);
    
    const productGrid = document.querySelector('.productGrid');
    
    if (!productGrid) {
        console.error("productGrid element not found!");
        return;
    }
    
    // Show loading animation
    productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
            <div class="loading-spinner" style="
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #333;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            "></div>
            <p>Loading products...</p>
        </div>
    `;
    
    try {
        // Check URL hash for category
        if (!category && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const urlCategory = hashParams.get('category');
            if (urlCategory) {
                category = decodeURIComponent(urlCategory);
                // Don't update active category if it's "All Product" from URL
                if (category !== 'All Product') {
                    updateActiveCategory(category);
                }
            }
        }
        
        // If no category specified and no active category, default to "All Product"
        if (!category) {
            const activeButton = document.querySelector('.navBot button.active-category');
            if (!activeButton) {
                category = 'All Product';
                updateActiveCategory(category);
            }
        }
        
        // Get search query
        const searchInput = document.querySelector('.searchInput');
        const searchQuery = search || (searchInput ? searchInput.value.trim() : '');
        
        // Get products from API
        // IMPORTANT: Pass "All Product" as null to API
        const apiCategory = category === 'All Product' ? null : category;
        const products = await ApiService.getProducts(apiCategory, searchQuery);
        console.log("Products received:", products.length);
        
        if (!products || products.length === 0) {
            let message = 'No products found';
            if (category && category !== 'All Product') {
                message = `No products found in "${category}" category`;
            } else if (searchQuery) {
                message = `No products found for "${searchQuery}"`;
            }
            
            productGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #666;">
                    <div style="font-size: 60px; margin-bottom: 20px;">😕</div>
                    <h3>${message}</h3>
                    <button class="sell" onclick="window.location.href='sell.html'" 
                            style="margin-top: 20px; padding: 10px 20px; font-size: 16px; background-color: #333; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        SELL YOUR FIRST ITEM
                    </button>
                    <br>
                    <button onclick="loadProducts()" style="
                        margin-top: 20px;
                        padding: 10px 20px;
                        background-color: #f0f0f0;
                        color: #333;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">
                        Show All Products
                    </button>
                </div>
            `;
            return;
        }
        
        // Clear and render products
        productGrid.innerHTML = '';
        products.forEach(product => {
            if (!product || !product.id) {
                console.error('Invalid product:', product);
                return;
            }
            const productElement = createProductElement(product);
            productGrid.innerHTML += productElement;
        });
        
        // Update category counts
        updateCategoryCounts(products);
        
        console.log("Finished loading", products.length, "products");
        
    } catch (error) {
        console.error('Error loading products:', error);
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #666;">
                <div style="font-size: 60px; margin-bottom: 20px;">⚠️</div>
                <h3>Unable to load products</h3>
                <p>${error.message || 'Server connection error'}</p>
                <button onclick="loadProducts()" style="
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #333;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">
                    Retry
                </button>
            </div>
        `;
    }
}

// Add this function to update product count in hero section
async function updateProductCount() {
    try {
        const products = await ApiService.getProducts();
        const countElement = document.getElementById('totalProductsCount');
        if (countElement && products) {
            countElement.textContent = products.length + '+';
            
            // Also update after loading products
            setTimeout(() => {
                countElement.textContent = products.length + '+';
            }, 1000);
        }
    } catch (error) {
        console.log('Could not update product count:', error);
    }
}

// Update the loadProducts function to also update product count
async function loadProducts(category = null, search = null) {
    console.log("Loading products... Category:", category, "Search:", search);
    
    const productGrid = document.querySelector('.productGrid');
    
    if (!productGrid) {
        console.error("productGrid element not found!");
        return;
    }
    
    // Show loading animation
    productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
            <div class="loading-spinner" style="
                width: 60px;
                height: 60px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            "></div>
            <p style="color: #666; font-size: 18px;">Loading amazing products...</p>
        </div>
    `;
    
    try {
        // Check URL hash for category
        if (!category && window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const urlCategory = hashParams.get('category');
            if (urlCategory) {
                category = decodeURIComponent(urlCategory);
                // Don't update active category if it's "All Product" from URL
                if (category !== 'All Product') {
                    updateActiveCategory(category);
                }
            }
        }
        
        // If no category specified and no active category, default to "All Product"
        if (!category) {
            const activeButton = document.querySelector('.navBot button.active-category');
            if (!activeButton) {
                category = 'All Product';
                updateActiveCategory(category);
            }
        }
        
        // Get search query
        const searchInput = document.querySelector('.searchInput');
        const searchQuery = search || (searchInput ? searchInput.value.trim() : '');
        
        // Get products from API
        // IMPORTANT: Pass "All Product" as null to API
        const apiCategory = category === 'All Product' ? null : category;
        const products = await ApiService.getProducts(apiCategory, searchQuery);
        console.log("Products received:", products.length);
        
        // Update product count in hero section
        updateProductCount();
        
        if (!products || products.length === 0) {
            let message = 'No products found';
            if (category && category !== 'All Product') {
                message = `No products found in "${category}" category`;
            } else if (searchQuery) {
                message = `No products found for "${searchQuery}"`;
            }
            
            productGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #666; animation: fadeIn 0.5s ease;">
                    <div style="font-size: 80px; margin-bottom: 20px; opacity: 0.5;">😕</div>
                    <h3 style="font-size: 24px; margin-bottom: 15px;">${message}</h3>
                    <p style="margin-bottom: 30px; font-size: 16px;">Be the first to list an item in this category!</p>
                    <button class="sell" onclick="window.location.href='sell.html'" 
                            style="margin-top: 20px; padding: 15px 30px; font-size: 16px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3); transition: all 0.3s ease;">
                        🚀 SELL YOUR FIRST ITEM
                    </button>
                    <br>
                    <button onclick="loadProducts()" style="
                        margin-top: 20px;
                        padding: 12px 25px;
                        background: #f8f9fa;
                        color: #333;
                        border: none;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#e9ecef'"
                    onmouseout="this.style.background='#f8f9fa'">
                        🔄 Show All Products
                    </button>
                </div>
            `;
            return;
        }
        
        // Clear and render products with animation
        productGrid.innerHTML = '';
        products.forEach((product, index) => {
            if (!product || !product.id) {
                console.error('Invalid product:', product);
                return;
            }
            const productElement = createProductElement(product);
            const productDiv = document.createElement('div');
            productDiv.innerHTML = productElement;
            productDiv.style.animationDelay = `${index * 0.1}s`;
            productDiv.classList.add('animate-on-scroll');
            productGrid.appendChild(productDiv);
            
            // Make element visible after a delay for animation
            setTimeout(() => {
                productDiv.classList.add('visible');
            }, 100);
        });
        
        // Update category counts
        updateCategoryCounts(products);
        
        console.log("Finished loading", products.length, "products");
        
    } catch (error) {
        console.error('Error loading products:', error);
        productGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #666;">
                <div style="font-size: 80px; margin-bottom: 20px;">⚠️</div>
                <h3 style="font-size: 24px; margin-bottom: 15px;">Unable to load products</h3>
                <p style="margin-bottom: 30px;">${error.message || 'Server connection error'}</p>
                <button onclick="loadProducts()" style="
                    margin-top: 20px;
                    padding: 15px 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='linear-gradient(135deg, #764ba2 0%, #667eea 100%)'"
                onmouseout="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'">
                    🔄 Try Again
                </button>
            </div>
        `;
    }
}

// Update initializeApp function to include scroll animations
function initializeApp() {
    setupEventListeners();
    setupCategoryFilters();
    
    if (isHomePage()) {
        // Set default active category to "All Product"
        setTimeout(() => {
            const activeButton = document.querySelector('.navBot button.active-category');
            if (!activeButton) {
                updateActiveCategory('All Product');
            }
            loadProducts();
            
            // Initialize scroll animations
            initScrollAnimations();
        }, 100);
    }
    
    checkLoginStatus();
}

// Add scroll animation initialization
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
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
    console.log('Filtering by category:', category);
    
    // "All Product" should show all products (pass null)
    if (category === 'All Product') {
        loadProducts(null);
    } else {
        loadProducts(category);
    }
}

// Function to update category counts
function updateCategoryCounts(products) {
    const categoryCounts = {
        'All Product': products.length,
        'Clothes': 0,
        'Home Appliances': 0,
        'Electronics': 0,
        'Education': 0
    };
    
    // Count products by category
    products.forEach(product => {
        if (product.category && categoryCounts.hasOwnProperty(product.category)) {
            categoryCounts[product.category]++;
        }
    });
    
    // Update button labels with counts
    document.querySelectorAll('.navBot button').forEach(button => {
        const category = button.getAttribute('data-category') || button.textContent.replace(/[📦👕🏠📱📚]/g, '').trim();
        const count = categoryCounts[category] || 0;
        
        // Remove existing count span
        const existingCount = button.querySelector('.category-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        // Add count span if there are products
        if (count > 0 && category !== 'All Product') {
            const countSpan = document.createElement('span');
            countSpan.className = 'category-count';
            countSpan.textContent = count;
            button.appendChild(countSpan);
        }
    });
}

async function viewProduct(productId) {
    try {
        const product = await ApiService.getProductById(productId);
        if (!product) {
            ModalService.showErrorModal('Product Not Found', 'The requested product could not be found.');
            return;
        }
        
        // Create modal HTML
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
        ModalService.showErrorModal('Error', 'Error loading product details.');
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

async function addToCart(productId, showModal = true) {
    const user = getCurrentUser();
    if (!user) {
        ModalService.showLoginModal('add-to-cart', productId);
        return;
    }
    
    try {
        const result = await ApiService.addToCart(productId);
        
        if (result.success) {
            if (showModal) {
                ModalService.showSuccessModal(
                    'Item Added!',
                    'Your item has been added to the shopping cart.',
                    {
                        showCartButton: true,
                        autoClose: true,
                        timeout: 3000
                    }
                );
            }
        } else {
            ModalService.showErrorModal('Failed to Add Item', result.message || 'Please try again.');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        ModalService.showErrorModal('Error', 'Failed to add to cart. Please try again.');
    }
}

// ========== SELL ITEM ==========
async function handleSellItem(e) {
    e.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        ModalService.showLoginModal('sell');
        return;
    }
    
    const itemName = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const condition = document.getElementById('condition').value;
    const price = parseFloat(document.getElementById('price').value);
    const description = document.getElementById('description').value;
    const imageFile = document.getElementById('imageUpload').files[0];
    
    // Validate
    if (!itemName || !category || !condition || !price || !description || !imageFile) {
        ModalService.showErrorModal('Missing Information', 'Please fill all required fields and upload an image.');
        return;
    }
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', itemName);
    formData.append('category', category);
    formData.append('condition', condition);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('image', imageFile);
    
    try {
        const response = await fetch('http://localhost:8080/usm-emart/api/products', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.success) {
            ModalService.showSuccessModal('Item Posted!', 'Your item is now live on USM E-Mart.');
            window.location.href = 'index.html';
        } else {
            ModalService.showErrorModal('Failed to Post Item', result.message || 'Please try again.');
        }
    } catch (error) {
        console.error('Sell item error:', error);
        ModalService.showErrorModal('Error', 'Failed to post item. Please try again.');
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
            ModalService.showErrorModal('Update Failed', result.message || 'Failed to update quantity.');
        }
    } catch (error) {
        console.error('Update cart quantity error:', error);
        ModalService.showErrorModal('Error', 'Failed to update quantity.');
    }
}

async function removeFromCart(productId) {
    try {
        const result = await ApiService.removeFromCart(productId);
        if (result.success) {
            loadCart();
        } else {
            ModalService.showErrorModal('Remove Failed', result.message || 'Failed to remove item.');
        }
    } catch (error) {
        console.error('Remove from cart error:', error);
        ModalService.showErrorModal('Error', 'Failed to remove item.');
    }
}

async function handleCheckout() {
    const user = getCurrentUser();
    if (!user) {
        ModalService.showLoginModal('checkout');
        return;
    }
    
    try {
        const cart = await ApiService.getCart();
        if (cart.length === 0) {
            ModalService.showErrorModal('Empty Cart', 'Your cart is empty. Add some items first!');
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
            ModalService.showSuccessModal(
                'Order Placed!',
                `Thank you for your purchase!<br><br>
                 Order ID: ${result.orderId}<br>
                 Total: RM${total.toFixed(2)}<br><br>
                 You will be redirected to home page.`,
                {
                    showCartButton: false,
                    autoClose: false,
                    timeout: 5000
                }
            );
            
            // Redirect after 5 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 5000);
        } else {
            ModalService.showErrorModal('Order Failed', result.message || 'Failed to place order.');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        ModalService.showErrorModal('Error', 'Failed to place order. Please try again.');
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
            ModalService.showSuccessModal('Order Updated', `Order ${orderId} marked as ${status}`);
            loadAdminOrders();
        } else {
            ModalService.showErrorModal('Update Failed', result.message || 'Failed to update order.');
        }
    } catch (error) {
        console.error('Update order status error:', error);
        ModalService.showErrorModal('Error', 'Failed to update order.');
    }
}

async function removeProduct(productId) {
    try {
        const result = await ApiService.deleteProduct(productId);
        if (result.success) {
            ModalService.showSuccessModal('Product Removed', 'Product has been removed from the marketplace.');
            loadAdminProducts();
        } else {
            ModalService.showErrorModal('Remove Failed', result.message || 'Failed to remove product.');
        }
    } catch (error) {
        console.error('Remove product error:', error);
        ModalService.showErrorModal('Error', 'Failed to remove product.');
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

// Add new click handlers
function handleSellClick() {
    const user = getCurrentUser();
    if (user) {
        window.location.href = 'sell.html';
    } else {
        ModalService.showLoginModal('sell');
    }
}

function handleCartClick() {
    const user = getCurrentUser();
    if (user) {
        window.location.href = 'cart.html';
    } else {
        ModalService.showLoginModal('view-cart');
    }
}

// Update the UI function for the new structure
function updateUIForLoggedInUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;
    
    if (user) {
        // User is logged in
        let adminLink = '';
        if (user.role === 'admin') {
            adminLink = `
                <a href="admin.html" class="admin-btn">
                    ⚙️ ADMIN
                </a>
            `;
        }
        
        authButtons.innerHTML = `
            ${adminLink}
            <div class="user-info">
                <span>Hi, ${user.username}</span>
                <button onclick="logout()">Logout</button>
            </div>
        `;
    } else {
        // User is NOT logged in
        authButtons.innerHTML = `
            <button class="login-btn" onclick="window.location.href='login.html'">
                🔐 LOGIN
            </button>
        `;
    }
}

// Update event listeners for search
function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchProducts(this.value);
            }
        });
    }
    
    // Search button using Font Awesome
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.querySelector('.searchInput');
            if (searchInput && searchInput.value) {
                searchProducts(searchInput.value);
            }
        });
    }
    
    // Category filters
    setupCategoryFilters();
    
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
    
    // Image upload preview
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function() {
            const preview = document.getElementById('imagePreview');
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    preview.innerHTML = `
                        <img src="${e.target.result}" 
                             style="max-width: 200px; max-height: 200px; border-radius: 5px; margin-top: 10px;">
                        <p style="font-size: 12px; color: #666; margin-top: 5px;">
                            Image preview (${Math.round(imageUpload.files[0].size / 1024)} KB)
                        </p>
                    `;
                }
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}

// Update cart badge function
async function updateCartBadge() {
    try {
        const cart = await ApiService.getCart();
        const cartCount = cart.length;
        
        // Create or update cart badge
        let badge = document.querySelector('.cart-badge');
        if (!badge && cartCount > 0) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            document.querySelector('.cart-btn').appendChild(badge);
        }
        
        if (badge) {
            if (cartCount > 0) {
                badge.textContent = cartCount > 9 ? '9+' : cartCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Failed to update cart badge:', error);
    }
}

// Icon fallback system
document.addEventListener('DOMContentLoaded', function() {
    // Check if SVG icons loaded, fallback to images
    setTimeout(() => {
        // Check search icon
        const searchIcon = document.querySelector('.search-icon');
        const searchIconImg = document.querySelector('.search-icon-img');
        if (searchIcon && searchIcon.clientHeight === 0) {
            searchIcon.style.display = 'none';
            if (searchIconImg) searchIconImg.style.display = 'block';
        }
        
        // Check plus icon
        const plusIcon = document.querySelector('.plus-icon');
        const plusIconImg = document.querySelector('.plus-icon-img');
        if (plusIcon && plusIcon.clientHeight === 0) {
            plusIcon.style.display = 'none';
            if (plusIconImg) plusIconImg.style.display = 'block';
        }
        
        // Check cart icon
        const cartIcon = document.querySelector('.cart-icon');
        const cartIconImg = document.querySelector('.cart-icon-img');
        if (cartIcon && cartIcon.clientHeight === 0) {
            cartIcon.style.display = 'none';
            if (cartIconImg) cartIconImg.style.display = 'block';
        }
    }, 1000);
});

// Add this function to handle admin user info display
function updateAdminUserInfo() {
    const user = getCurrentUser();
    const userInfoDiv = document.getElementById('userInfoAdmin');
    const logoutBtn = document.getElementById('logoutBtnAdmin');
    
    if (user && userInfoDiv) {
        userInfoDiv.innerHTML = `
            <div class="admin-user-details">
                <span class="admin-email">${user.email}</span>
                <span class="admin-role">(${user.role})</span>
            </div>
        `;
    }
    
    // Always show logout button on admin page
    if (logoutBtn) {
        logoutBtn.style.display = 'flex';
    }
}

// Update the loadAdminPanel function
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
    
    // Update user info
    updateAdminUserInfo();
    
    // Load all admin data
    await loadAdminStats();
    await loadAdminOrders();
    await loadAdminProducts();
    await loadAdminUsers();
}

// Update global logout function to handle admin page
async function logout() {
    try {
        const result = await ApiService.logout();
        localStorage.removeItem('currentUser');
        
        // Show logout success message
        ModalService.showSuccessModal(
            'Logged Out', 
            'You have been successfully logged out. Redirecting to login page...',
            { autoClose: true, timeout: 1500 }
        );
        
        // Redirect based on current page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('currentUser');
        
        ModalService.showSuccessModal(
            'Logged Out', 
            'You have been logged out. Redirecting to login page...',
            { autoClose: true, timeout: 1500 }
        );
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

// Add this function to ensure admin panel loads properly
async function loadAdminPanel() {
    console.log("loadAdminPanel() called");
    
    const user = getCurrentUser();
    console.log("Current user:", user);
    
    // Check if user is admin
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
    
    try {
        // Load all admin data
        await loadAdminStats();
        await loadAdminOrders();
        await loadAdminProducts();
        await loadAdminUsers();
        
        console.log("Admin panel loaded successfully");
    } catch (error) {
        console.error("Error loading admin panel:", error);
        ModalService.showErrorModal("Loading Error", "Failed to load admin data. Please try again.");
    }
}

// Make sure switchTab function exists
function switchTab(tabName) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const clickedButton = event.target;
    clickedButton.classList.add('active');
}
