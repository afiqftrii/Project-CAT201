// api-service.js
const API_BASE_URL = 'http://localhost:8080/shusm-emart/api';

const ApiService = {
    // ========== AUTHENTICATION ==========
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Login API error:', error);
            return { success: false, message: 'Server error. Please try again.' };
        }
    },

    async logout() {
        try {
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Logout API error:', error);
            return { success: false, message: 'Logout failed' };
        }
    },

    // ========== PRODUCTS ==========
    async getProducts(category = null, search = null) {
        try {
            let url = `${API_BASE_URL}/products`;
            const params = new URLSearchParams();
            if (category && category !== 'All Product') params.append('category', category);
            if (search) params.append('search', search);
            
            if (params.toString()) url += '?' + params.toString();
            
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Get products API error:', error);
            return [];
        }
    },

    async getProductById(productId) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`);
            if (!response.ok) throw new Error('Product not found');
            return await response.json();
        } catch (error) {
            console.error('Get product API error:', error);
            return null;
        }
    },

    async createProduct(productData) {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(productData),
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Create product API error:', error);
            return { success: false, message: 'Failed to create product' };
        }
    },

    // ========== CART ==========
    async getCart() {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/`, {
                credentials: 'include'
            });
            if (response.status === 401) return [];
            return await response.json();
        } catch (error) {
            console.error('Get cart API error:', error);
            return [];
        }
    },

    async addToCart(productId) {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/add`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ productId }),
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Add to cart API error:', error);
            return { success: false, message: 'Failed to add to cart' };
        }
    },

    async updateCartItem(productId, quantity) {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/update`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ productId, quantity }),
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Update cart API error:', error);
            return { success: false, message: 'Failed to update cart' };
        }
    },

    async removeFromCart(productId) {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/remove?productId=${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Remove from cart API error:', error);
            return { success: false, message: 'Failed to remove from cart' };
        }
    },

    // ========== ORDERS ==========
    async getOrders() {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                credentials: 'include'
            });
            if (response.status === 401) return [];
            return await response.json();
        } catch (error) {
            console.error('Get orders API error:', error);
            return [];
        }
    },

    async createOrder(orderData) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(orderData),
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Create order API error:', error);
            return { success: false, message: 'Failed to create order' };
        }
    },

    async updateOrderStatus(orderId, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ orderId, status }),
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Update order API error:', error);
            return { success: false, message: 'Failed to update order' };
        }
    },

    // ========== ADMIN ==========
    async getAdminStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/stats`, {
                credentials: 'include'
            });
            if (response.status === 403) return null;
            return await response.json();
        } catch (error) {
            console.error('Get admin stats API error:', error);
            return null;
        }
    },

    async getAdminProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/products`, {
                credentials: 'include'
            });
            if (response.status === 403) return [];
            return await response.json();
        } catch (error) {
            console.error('Get admin products API error:', error);
            return [];
        }
    },

    async getAdminOrders() {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/orders`, {
                credentials: 'include'
            });
            if (response.status === 403) return [];
            return await response.json();
        } catch (error) {
            console.error('Get admin orders API error:', error);
            return [];
        }
    },

    async getAdminUsers() {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users`, {
                credentials: 'include'
            });
            if (response.status === 403) return [];
            return await response.json();
        } catch (error) {
            console.error('Get admin users API error:', error);
            return [];
        }
    },

    async deleteProduct(productId) {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/products?id=${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            return await response.json();
        } catch (error) {
            console.error('Delete product API error:', error);
            return { success: false, message: 'Failed to delete product' };
        }
    },

    // ========== USER ==========
    async getUserProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                credentials: 'include'
            });
            if (response.status === 401) return null;
            return await response.json();
        } catch (error) {
            console.error('Get user profile API error:', error);
            return null;
        }
    }
};