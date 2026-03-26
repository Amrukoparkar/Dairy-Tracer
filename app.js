// App State
let currentUser = null;
let products = [];
let cart = [];
let orders = [];
let sellRequests = [];
let users = [];

// Initialize sample data
function initializeData() {
    // Load users from localStorage or create default
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        users = [
            {
                id: 1,
                name: "Amruta",
                email: "amrutakoparkar1@gmail.com",
                password: "Amruta123",
                role: "admin",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Demo User",
                email: "demo@example.com",
                password: "password",
                role: "user",
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Load products from localStorage or use default
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = [
            {
                id: 1,
                name: "Fresh Cow Milk",
                price: 60,
                quantity: 50,
                category: "milk",
                description: "Pure fresh cow milk, rich in calcium and protein. Directly sourced from local farms.",
                image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300",
                sellerId: 1,
                sellerName: "Amruta",
                approved: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Cheddar Cheese",
                price: 350,
                quantity: 30,
                category: "cheese",
                description: "Aged cheddar cheese, perfect for sandwiches and cooking. Made with traditional methods.",
                image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=300",
                sellerId: 1,
                sellerName: "Amruta",
                approved: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: "Salted Butter",
                price: 280,
                quantity: 40,
                category: "butter",
                description: "Creamy salted butter, ideal for baking and spreading. Made from fresh cream.",
                image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300",
                sellerId: 1,
                sellerName: "Amruta",
                approved: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                name: "Plain Curd",
                price: 45,
                quantity: 60,
                category: "curd",
                description: "Fresh homemade curd, probiotic rich. Great for digestion and health.",
                image: "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=300",
                sellerId: 1,
                sellerName: "Amruta",
                approved: true,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Load sell requests
    const savedSellRequests = localStorage.getItem('sellRequests');
    if (savedSellRequests) {
        sellRequests = JSON.parse(savedSellRequests);
    } else {
        sellRequests = [];
    }

    // Load saved data from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
    
    updateAuthUI();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('sellRequests', JSON.stringify(sellRequests));
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('users', JSON.stringify(users));
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Update UI based on authentication
function updateAuthUI() {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const cartLink = document.getElementById('cartLink');
    const sellLink = document.getElementById('sellLink');
    const ordersLink = document.getElementById('ordersLink');
    const dashboardLink = document.getElementById('dashboardLink');
    const adminLink = document.getElementById('adminLink');
    const myProductsLink = document.getElementById('myProductsLink');
    
    if (currentUser) {
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        logoutLink.style.display = 'block';
        cartLink.style.display = 'block';
        sellLink.style.display = 'block';
        ordersLink.style.display = 'block';
        dashboardLink.style.display = 'block';
        
        if (myProductsLink) myProductsLink.style.display = 'block';
        
        // Show admin panel only for admin users
        if (currentUser.role === 'admin') {
            if (adminLink) adminLink.style.display = 'block';
        } else {
            if (adminLink) adminLink.style.display = 'none';
        }
    } else {
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
        logoutLink.style.display = 'none';
        cartLink.style.display = 'none';
        sellLink.style.display = 'none';
        ordersLink.style.display = 'none';
        dashboardLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
        if (myProductsLink) myProductsLink.style.display = 'none';
    }
    updateCartCount();
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Navigation function
function navigateTo(page) {
    const mainContent = document.getElementById('mainContent');
    
    switch(page) {
        case 'home':
            renderHome();
            break;
        case 'products':
            renderProducts();
            break;
        case 'cart':
            if (currentUser) renderCart();
            else navigateTo('login');
            break;
        case 'login':
            renderLogin();
            break;
        case 'register':
            renderRegister();
            break;
        case 'sell':
            if (currentUser) renderSell();
            else navigateTo('login');
            break;
        case 'orders':
            if (currentUser) renderOrders();
            else navigateTo('login');
            break;
        case 'dashboard':
            if (currentUser) renderDashboard();
            else navigateTo('login');
            break;
        case 'admin':
            if (currentUser && currentUser.role === 'admin') renderAdminPanel();
            else navigateTo('home');
            break;
        case 'my-products':
            if (currentUser) renderMyProducts();
            else navigateTo('login');
            break;
    }
    
    // Close mobile menu if open
    const navLinks = document.getElementById('navLinks');
    if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
}

// Render Home Page
function renderHome() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container">
            <div class="hero">
                <h1>Welcome to Dairy Tracer</h1>
                <p>Your one-stop destination for buying and selling fresh dairy products</p>
                <div class="button-group">
                    <button class="btn-primary" onclick="navigateTo('products')">Browse Products</button>
                    ${!currentUser ? '<button class="btn-secondary" onclick="navigateTo(\'register\')">Get Started</button>' : ''}
                </div>
            </div>
            
            <div class="features">
                <h2>Why Choose Dairy Tracer?</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🥛</div>
                        <h3>Fresh Products</h3>
                        <p>Get the freshest dairy products directly from local farms</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">💰</div>
                        <h3>Sell Your Products</h3>
                        <p>List your dairy products and reach thousands of customers</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🚚</div>
                        <h3>Fast Delivery</h3>
                        <p>Quick and reliable delivery to your doorstep</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🛡️</div>
                        <h3>Quality Guarantee</h3>
                        <p>100% quality assured dairy products</p>
                    </div>
                </div>
            </div>
            
            <div class="categories">
                <h2>Our Categories</h2>
                <div class="categories-grid">
                    <div class="category-card" onclick="renderProducts('milk')">
                        <div class="category-icon">🥛</div>
                        <h3>Milk</h3>
                    </div>
                    <div class="category-card" onclick="renderProducts('cheese')">
                        <div class="category-icon">🧀</div>
                        <h3>Cheese</h3>
                    </div>
                    <div class="category-card" onclick="renderProducts('butter')">
                        <div class="category-icon">🧈</div>
                        <h3>Butter</h3>
                    </div>
                    <div class="category-card" onclick="renderProducts('curd')">
                        <div class="category-icon">🥄</div>
                        <h3>Curd</h3>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render Products Page
let currentCategory = 'all';
let currentSearch = '';

function renderProducts(category = 'all', search = '') {
    currentCategory = category;
    currentSearch = search;
    
    // Only show approved products
    let filteredProducts = products.filter(p => p.approved === true);
    
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (search) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container">
            <div class="products-header">
                <h1>Our Dairy Products</h1>
                <p>Fresh, pure, and delicious dairy products from trusted sellers</p>
            </div>
            
            <div class="filters">
                <div class="search-form">
                    <input type="text" id="searchInput" class="search-input" placeholder="Search products..." value="${search}">
                    <button class="search-btn" onclick="searchProducts()">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                
                <div class="category-filters">
                    <button class="category-btn ${category === 'all' ? 'active' : ''}" onclick="renderProducts('all', '${search}')">All</button>
                    <button class="category-btn ${category === 'milk' ? 'active' : ''}" onclick="renderProducts('milk', '${search}')">Milk</button>
                    <button class="category-btn ${category === 'cheese' ? 'active' : ''}" onclick="renderProducts('cheese', '${search}')">Cheese</button>
                    <button class="category-btn ${category === 'butter' ? 'active' : ''}" onclick="renderProducts('butter', '${search}')">Butter</button>
                    <button class="category-btn ${category === 'curd' ? 'active' : ''}" onclick="renderProducts('curd', '${search}')">Curd</button>
                </div>
            </div>
            
            <div class="products-grid" id="productsGrid">
                ${filteredProducts.map(product => `
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300?text=${product.name}'">
                            <span class="product-category" style="background-color: ${getCategoryColor(product.category)}">
                                ${product.category.toUpperCase()}
                            </span>
                            ${product.sellerName ? `<span class="product-seller" style="position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 2px 8px; border-radius: 20px; font-size: 10px;">by ${product.sellerName}</span>` : ''}
                        </div>
                        <div class="product-content">
                            <h3 class="product-name">${product.name}</h3>
                            <p class="product-price">₹${product.price}</p>
                            <p class="product-quantity">Stock: ${product.quantity} units</p>
                            <div class="product-buttons">
                                <button class="btn-add" onclick="addToCart(${product.id})">
                                    <i class="fas fa-cart-plus"></i> Add to Cart
                                </button>
                                <button class="btn-details" onclick="showProductDetails(${product.id})">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            ${filteredProducts.length === 0 ? '<div class="empty-state"><i class="fas fa-search"></i><h2>No products found</h2><p>Try adjusting your search or filter</p></div>' : ''}
        </div>
    `;
}

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    renderProducts(currentCategory, searchInput.value);
}

function getCategoryColor(category) {
    const colors = {
        milk: '#3b82f6',
        cheese: '#f59e0b',
        butter: '#ef4444',
        curd: '#10b981',
        other: '#8b5cf6'
    };
    return colors[category] || '#6b7280';
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${product.name}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;" onerror="this.src='https://via.placeholder.com/400?text=${product.name}'">
            <p><strong>Price:</strong> ₹${product.price}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Stock:</strong> ${product.quantity} units</p>
            <p><strong>Seller:</strong> ${product.sellerName || 'Dairy Tracer'}</p>
            <p><strong>Description:</strong> ${product.description || 'No description available'}</p>
            <button class="btn-primary" style="margin-top: 1rem; width: 100%;" onclick="addToCart(${product.id}); this.closest('.modal').remove();">
                Add to Cart
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Cart Functions
function addToCart(productId) {
    if (!currentUser) {
        showToast('Please login to add items to cart', 'error');
        navigateTo('login');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        if (existingItem.quantity + 1 > product.quantity) {
            showToast('Insufficient stock!', 'error');
            return;
        }
        existingItem.quantity++;
    } else {
        if (product.quantity < 1) {
            showToast('Out of stock!', 'error');
            return;
        }
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            sellerId: product.sellerId,
            sellerName: product.sellerName
        });
    }
    
    saveData();
    updateCartCount();
    showToast(`${product.name} added to cart!`);
}

function renderCart() {
    const mainContent = document.getElementById('mainContent');
    
    if (cart.length === 0) {
        mainContent.innerHTML = `
            <div class="container">
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Your Cart is Empty</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <button class="btn-primary" onclick="navigateTo('products')">Start Shopping</button>
                </div>
            </div>
        `;
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    
    mainContent.innerHTML = `
        <div class="container">
            <h1 style="margin-bottom: 2rem;">Shopping Cart</h1>
            <div class="cart-container">
                <div class="cart-items">
                    ${cart.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80?text=${item.name}'">
                            <div class="cart-item-details">
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-price">₹${item.price}</div>
                                <div class="cart-item-seller" style="font-size: 0.75rem; color: #718096;">Seller: ${item.sellerName}</div>
                            </div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, ${item.quantity - 1})">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, ${item.quantity + 1})">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div class="cart-item-total">
                                ₹${item.price * item.quantity}
                            </div>
                            <button class="remove-btn" onclick="removeFromCart(${item.productId})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('')}
                    <button class="btn-secondary" style="margin-top: 1rem;" onclick="clearCart()">Clear Cart</button>
                </div>
                
                <div class="cart-summary">
                    <h3 class="summary-title">Order Summary</h3>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>₹${subtotal}</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (5%)</span>
                        <span>₹${tax.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Delivery</span>
                        <span>Free</span>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-total">
                        <span>Total</span>
                        <span class="total-amount">₹${total.toFixed(2)}</span>
                    </div>
                    <button class="checkout-btn" onclick="showPaymentModal()">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    `;
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(i => i.productId === productId);
    const product = products.find(p => p.id === productId);
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > product.quantity) {
        showToast('Insufficient stock!', 'error');
        return;
    }
    
    item.quantity = newQuantity;
    saveData();
    renderCart();
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveData();
    renderCart();
    updateCartCount();
    showToast('Item removed from cart');
}

function clearCart() {
    cart = [];
    saveData();
    renderCart();
    updateCartCount();
    showToast('Cart cleared');
}

function showPaymentModal() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Payment Details</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="payment-methods">
                <div class="payment-method selected" onclick="selectPaymentMethod(this, 'card')">
                    <i class="fas fa-credit-card"></i>
                    <div>Credit/Debit Card</div>
                </div>
                <div class="payment-method" onclick="selectPaymentMethod(this, 'upi')">
                    <i class="fas fa-mobile-alt"></i>
                    <div>UPI</div>
                </div>
                <div class="payment-method" onclick="selectPaymentMethod(this, 'netbanking')">
                    <i class="fas fa-university"></i>
                    <div>Net Banking</div>
                </div>
            </div>
            <div id="paymentForm">
                <div class="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" id="cardNumber">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry Date</label>
                        <input type="text" placeholder="MM/YY" id="expiryDate">
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <input type="password" placeholder="123" id="cvv">
                    </div>
                </div>
                <div class="form-group">
                    <label>Cardholder Name</label>
                    <input type="text" placeholder="${currentUser.name}" id="cardName">
                </div>
            </div>
            <div class="summary-row" style="margin-top: 1rem;">
                <span><strong>Total Amount</strong></span>
                <span><strong>₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.05}</strong></span>
            </div>
            <button class="btn-primary" style="margin-top: 1rem; width: 100%;" onclick="processPayment(this)">Pay Now</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function selectPaymentMethod(element, method) {
    const methods = document.querySelectorAll('.payment-method');
    methods.forEach(m => m.classList.remove('selected'));
    element.classList.add('selected');
    
    const paymentForm = document.getElementById('paymentForm');
    if (method === 'upi') {
        paymentForm.innerHTML = `
            <div class="form-group">
                <label>UPI ID</label>
                <input type="text" placeholder="username@okhdfcbank" id="upiId">
            </div>
        `;
    } else if (method === 'netbanking') {
        paymentForm.innerHTML = `
            <div class="form-group">
                <label>Select Bank</label>
                <select id="bank">
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                </select>
            </div>
        `;
    } else {
        paymentForm.innerHTML = `
            <div class="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" id="cardNumber">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" id="expiryDate">
                </div>
                <div class="form-group">
                    <label>CVV</label>
                    <input type="password" placeholder="123" id="cvv">
                </div>
            </div>
            <div class="form-group">
                <label>Cardholder Name</label>
                <input type="text" placeholder="${currentUser.name}" id="cardName">
            </div>
        `;
    }
}

function processPayment(button) {
    button.disabled = true;
    button.textContent = 'Processing...';
    
    // Simulate payment processing
    setTimeout(() => {
        button.disabled = false;
        button.textContent = 'Pay Now';
        const modal = button.closest('.modal');
        if (modal) modal.remove();
        checkout();
    }, 2000);
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    // Check stock availability
    for (const item of cart) {
        const product = products.find(p => p.id === item.productId);
        if (product.quantity < item.quantity) {
            showToast(`Insufficient stock for ${item.name}`, 'error');
            return;
        }
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    
    // Create order
    const order = {
        id: Date.now(),
        invoiceNumber: `INV-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        items: cart.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            sellerId: item.sellerId,
            sellerName: item.sellerName
        })),
        subtotal: subtotal,
        tax: tax,
        totalAmount: total,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    orders.push(order);
    
    // Update product quantities
    for (const item of cart) {
        const product = products.find(p => p.id === item.productId);
        product.quantity -= item.quantity;
    }
    
    // Clear cart
    cart = [];
    saveData();
    updateCartCount();
    
    showToast('Payment successful! Order placed successfully!');
    renderInvoice(order);
    navigateTo('orders');
}

function renderInvoice(order) {
    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.write(`
        <html>
            <head>
                <title>Invoice ${order.invoiceNumber}</title>
                <style>
                    body { font-family: 'Inter', sans-serif; padding: 2rem; background: #f7fafc; }
                    .invoice { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { text-align: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #667eea; }
                    .company { color: #667eea; font-size: 1.5rem; font-weight: bold; }
                    .invoice-title { font-size: 1.25rem; color: #4a5568; margin-top: 0.5rem; }
                    .details { margin-bottom: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                    .details p { margin: 0.25rem 0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
                    th, td { border: 1px solid #e2e8f0; padding: 0.75rem; text-align: left; }
                    th { background-color: #f7fafc; font-weight: 600; }
                    .total { text-align: right; font-size: 1.25rem; font-weight: bold; margin-top: 1rem; }
                    .footer { text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; color: #718096; }
                    .status { display: inline-block; padding: 0.25rem 0.75rem; background: #48bb78; color: white; border-radius: 20px; font-size: 0.75rem; }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <div class="company">Dairy Tracer</div>
                        <div class="invoice-title">Tax Invoice</div>
                    </div>
                    <div class="details">
                        <div>
                            <p><strong>Invoice Number:</strong> ${order.invoiceNumber}</p>
                            <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                            <p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p><strong>Customer:</strong> ${order.userName}</p>
                            <p><strong>Email:</strong> ${currentUser.email}</p>
                            <p><strong>Status:</strong> <span class="status">${order.status.toUpperCase()}</span></p>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${item.price}</td>
                                    <td>₹${item.price * item.quantity}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="total">
                        <p>Subtotal: ₹${order.subtotal.toFixed(2)}</p>
                        <p>Tax (5%): ₹${order.tax.toFixed(2)}</p>
                        <p style="font-size: 1.5rem; color: #667eea;">Grand Total: ₹${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div class="footer">
                        <p>Thank you for shopping with Dairy Tracer!</p>
                        <p>For any queries, contact us at support@dairytracer.com</p>
                    </div>
                </div>
            </body>
        </html>
    `);
    invoiceWindow.document.close();
}

// Authentication Functions
function renderLogin() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container">
            <div class="form-container">
                <h2>Login to Your Account</h2>
                <form onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="loginEmail" required placeholder="demo@example.com">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="loginPassword" required placeholder="password">
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Login</button>
                </form>
                <p style="text-align: center; margin-top: 1rem;">
                    Don't have an account? <a href="#" onclick="navigateTo('register')">Register</a>
                </p>
                <p style="text-align: center; margin-top: 0.5rem; font-size: 0.875rem; color: #718096;">
                    Demo User: demo@example.com / password<br>
                    Admin: amrutakoparkar1@gmail.com / Amruta123
                </p>
            </div>
        </div>
    `;
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { ...user };
        delete currentUser.password;
        saveData();
        updateAuthUI();
        showToast(`Welcome back, ${currentUser.name}!`);
        navigateTo('home');
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function renderRegister() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container">
            <div class="form-container">
                <h2>Create Account</h2>
                <form onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="regName" required placeholder="John Doe">
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="regEmail" required placeholder="john@example.com">
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" id="regPhone" placeholder="+91 1234567890">
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <textarea id="regAddress" rows="2" placeholder="Your full address"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="regPassword" required placeholder="At least 6 characters">
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" id="regConfirmPassword" required>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">Register</button>
                </form>
                <p style="text-align: center; margin-top: 1rem;">
                    Already have an account? <a href="#" onclick="navigateTo('login')">Login</a>
                </p>
            </div>
        </div>
    `;
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const address = document.getElementById('regAddress').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showToast('Email already registered', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        address: address,
        password: password,
        role: 'user',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    currentUser = { ...newUser };
    delete currentUser.password;
    saveData();
    updateAuthUI();
    showToast('Registration successful! Welcome to Dairy Tracer!');
    navigateTo('home');
}

function logout() {
    currentUser = null;
    cart = [];
    saveData();
    updateAuthUI();
    showToast('Logged out successfully');
    navigateTo('home');
}

// Enhanced Sell Functions - Products get listed immediately
function renderSell() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container">
            <div class="form-container">
                <h2>List Your Dairy Products for Sale</h2>
                <p style="text-align: center; color: #718096; margin-bottom: 1rem;">Your products will be listed immediately for customers to buy!</p>
                <form onsubmit="handleSellProduct(event)">
                    <div class="form-group">
                        <label>Product Name *</label>
                        <input type="text" id="sellProductName" required placeholder="e.g., Organic Goat Milk">
                    </div>
                    <div class="form-group">
                        <label>Category *</label>
                        <select id="sellCategory" required>
                            <option value="">Select Category</option>
                            <option value="milk">Milk</option>
                            <option value="cheese">Cheese</option>
                            <option value="butter">Butter</option>
                            <option value="curd">Curd</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Quantity (units) *</label>
                            <input type="number" id="sellQuantity" required min="1" placeholder="e.g., 100">
                        </div>
                        <div class="form-group">
                            <label>Price per unit (₹) *</label>
                            <input type="number" id="sellPrice" required min="1" placeholder="e.g., 50">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Product Image URL</label>
                        <input type="url" id="sellImage" placeholder="https://example.com/image.jpg">
                        <small style="color: #718096;">Leave empty for default image</small>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="sellDescription" rows="4" placeholder="Describe your product, its quality, sourcing, etc."></textarea>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%;">List Product for Sale</button>
                </form>
            </div>
        </div>
    `;
}

function handleSellProduct(event) {
    event.preventDefault();
    
    const productName = document.getElementById('sellProductName').value;
    const category = document.getElementById('sellCategory').value;
    const quantity = parseInt(document.getElementById('sellQuantity').value);
    const price = parseInt(document.getElementById('sellPrice').value);
    const imageUrl = document.getElementById('sellImage').value;
    const description = document.getElementById('sellDescription').value;
    
    // Create new product - immediately available for sale
    const newProduct = {
        id: Date.now(),
        name: productName,
        price: price,
        quantity: quantity,
        category: category,
        description: description || `Fresh ${productName} from ${currentUser.name}`,
        image: imageUrl || `https://via.placeholder.com/300?text=${encodeURIComponent(productName)}`,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        approved: true,
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    // Create a sell record for tracking
    const sellRecord = {
        id: Date.now(),
        userId: currentUser.id,
        productId: newProduct.id,
        productName: productName,
        category: category,
        quantity: quantity,
        price: price,
        status: 'listed',
        createdAt: new Date().toISOString()
    };
    
    sellRequests.push(sellRecord);
    saveData();
    
    showToast(`"${productName}" has been listed for sale! Customers can now buy it.`);
    navigateTo('my-products');
}

// Render My Products
function renderMyProducts() {
    const userProducts = products.filter(p => p.sellerId === currentUser.id);
    const userSellRecords = sellRequests.filter(r => r.userId === currentUser.id);
    
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h1>My Products</h1>
                <button class="btn-primary" onclick="navigateTo('sell')">+ Add New Product</button>
            </div>
            
            ${userProducts.length > 0 ? `
                <div class="products-grid">
                    ${userProducts.map(product => `
                        <div class="product-card">
                            <div class="product-image">
                                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300?text=${product.name}'">
                                <span class="product-category" style="background-color: ${getCategoryColor(product.category)}">
                                    ${product.category.toUpperCase()}
                                </span>
                            </div>
                            <div class="product-content">
                                <h3 class="product-name">${product.name}</h3>
                                <p class="product-price">₹${product.price}</p>
                                <p class="product-quantity">Stock: ${product.quantity} units</p>
                                <div class="product-buttons">
                                    <button class="btn-add" onclick="editProduct(${product.id})">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <button class="btn-danger" onclick="deleteProduct(${product.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h2>No Products Listed</h2>
                    <p>You haven't listed any products for sale yet.</p>
                    <button class="btn-primary" onclick="navigateTo('sell')">List Your First Product</button>
                </div>
            `}
            
            ${userSellRecords.length > 0 ? `
                <h2 style="margin-top: 3rem; margin-bottom: 1rem;">Sales History</h2>
                <div class="orders-list">
                    ${userSellRecords.map(record => `
                        <div class="order-card">
                            <div class="order-header">
                                <div>
                                    <strong>${record.productName}</strong>
                                    <div style="font-size: 0.875rem; color: #718096;">
                                        Listed on ${new Date(record.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <span class="order-status" style="background: #c6f6d5;">
                                    ${record.status.toUpperCase()}
                                </span>
                            </div>
                            <div class="order-items">
                                <div class="order-item">
                                    <span>Quantity: ${record.quantity} units</span>
                                    <span>Price: ₹${record.price} per unit</span>
                                    <span>Total Value: ₹${record.quantity * record.price}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.sellerId !== currentUser.id) {
        showToast('You can only edit your own products', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Edit Product</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <form onsubmit="updateProduct(event, ${productId})">
                <div class="form-group">
                    <label>Product Name</label>
                    <input type="text" id="editName" value="${product.name}" required>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select id="editCategory" required>
                        <option value="milk" ${product.category === 'milk' ? 'selected' : ''}>Milk</option>
                        <option value="cheese" ${product.category === 'cheese' ? 'selected' : ''}>Cheese</option>
                        <option value="butter" ${product.category === 'butter' ? 'selected' : ''}>Butter</option>
                        <option value="curd" ${product.category === 'curd' ? 'selected' : ''}>Curd</option>
                        <option value="other" ${product.category === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Quantity</label>
                        <input type="number" id="editQuantity" value="${product.quantity}" required min="0">
                    </div>
                    <div class="form-group">
                        <label>Price (₹)</label>
                        <input type="number" id="editPrice" value="${product.price}" required min="1">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="editDescription" rows="3">${product.description || ''}</textarea>
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Update Product</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function updateProduct(event, productId) {
    event.preventDefault();
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    product.name = document.getElementById('editName').value;
    product.category = document.getElementById('editCategory').value;
    product.quantity = parseInt(document.getElementById('editQuantity').value);
    product.price = parseInt(document.getElementById('editPrice').value);
    product.description = document.getElementById('editDescription').value;
    
    saveData();
    showToast('Product updated successfully!');
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
    renderMyProducts();
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        const product = products.find(p => p.id === productId);
        if (product && product.sellerId === currentUser.id) {
            products = products.filter(p => p.id !== productId);
            saveData();
            showToast('Product deleted successfully!');
            renderMyProducts();
        } else {
            showToast('You can only delete your own products', 'error');
        }
    }
}

// Admin Panel Functions
function renderAdminPanel() {
    const allUsers = users;
    const allOrders = orders;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalProducts = products.length;
    
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container">
            <h1 style="margin-bottom: 2rem;">Admin Dashboard</h1>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div><div class="stat-value">${allUsers.length}</div><div class="stat-label">Total Users</div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-box"></i></div>
                    <div><div class="stat-value">${totalProducts}</div><div class="stat-label">Total Products</div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div><div class="stat-value">${allOrders.length}</div><div class="stat-label">Total Orders</div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-rupee-sign"></i></div>
                    <div><div class="stat-value">₹${totalRevenue.toFixed(2)}</div><div class="stat-label">Total Revenue</div></div>
                </div>
            </div>
            
            <div class="admin-tabs" style="display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid #e2e8f0;">
                <button class="tab-btn active" onclick="showAdminTab('products')">All Products</button>
                <button class="tab-btn" onclick="showAdminTab('users')">Users</button>
                <button class="tab-btn" onclick="showAdminTab('orders')">Orders</button>
            </div>
            
            <div id="adminTabContent">
                ${renderAdminProducts()}
            </div>
        </div>
    `;
}

function renderAdminProducts() {
    return `
        <div>
            <h2>All Products</h2>
            <div class="products-grid">
                ${products.map(product => `
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300?text=${product.name}'">
                        </div>
                        <div class="product-content">
                            <h3 class="product-name">${product.name}</h3>
                            <p class="product-price">₹${product.price}</p>
                            <p>Seller: ${product.sellerName || 'Admin'}</p>
                            <p>Stock: ${product.quantity}</p>
                            <button class="btn-danger" onclick="adminDeleteProduct(${product.id})">Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAdminUsers() {
    return `
        <div>
            <h2>All Users</h2>
            <div class="orders-list">
                ${users.map(user => `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <strong>${user.name}</strong>
                                <div style="font-size: 0.875rem; color: #718096;">${user.email}</div>
                            </div>
                            <span class="order-status" style="background: ${user.role === 'admin' ? '#fed7e2' : '#c6f6d5'}">
                                ${user.role.toUpperCase()}
                            </span>
                        </div>
                        <div class="order-items">
                            ${user.phone ? `<div>Phone: ${user.phone}</div>` : ''}
                            ${user.address ? `<div>Address: ${user.address}</div>` : ''}
                            <div>Joined: ${new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAdminOrders() {
    return `
        <div>
            <h2>All Orders</h2>
            <div class="orders-list">
                ${orders.map(order => `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <strong>${order.invoiceNumber}</strong>
                                <div style="font-size: 0.875rem; color: #718096;">${new Date(order.orderDate).toLocaleString()}</div>
                            </div>
                            <span class="order-status">${order.status.toUpperCase()}</span>
                        </div>
                        <div class="order-items">
                            <div>Customer: ${order.userName}</div>
                            <div>Total: ₹${order.totalAmount.toFixed(2)}</div>
                            <div>Items: ${order.items.length}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function showAdminTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    const content = document.getElementById('adminTabContent');
    if (tab === 'products') {
        content.innerHTML = renderAdminProducts();
    } else if (tab === 'users') {
        content.innerHTML = renderAdminUsers();
    } else if (tab === 'orders') {
        content.innerHTML = renderAdminOrders();
    }
}

function adminDeleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveData();
        showToast('Product deleted successfully!');
        renderAdminPanel();
    }
}

// Orders Functions
function renderOrders() {
    const userOrders = orders.filter(order => order.userId === currentUser.id).sort((a, b) => b.id - a.id);
    
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container">
            <h1 style="margin-bottom: 2rem;">My Orders</h1>
            ${userOrders.length > 0 ? `
                <div class="orders-list">
                    ${userOrders.map(order => `
                        <div class="order-card">
                            <div class="order-header">
                                <div>
                                    <strong>Order #${order.invoiceNumber}</strong>
                                    <div style="font-size: 0.875rem; color: #718096;">
                                        ${new Date(order.orderDate).toLocaleString()}
                                    </div>
                                </div>
                                <span class="order-status" style="background: ${getStatusColor(order.status)}; color: #2d3748;">
                                    ${order.status.toUpperCase()}
                                </span>
                            </div>
                            <div class="order-items">
                                ${order.items.map(item => `
                                    <div class="order-item">
                                        <span>${item.name}</span>
                                        <span>x${item.quantity}</span>
                                        <span>₹${item.price * item.quantity}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="order-footer">
                                <div>
                                    <div><strong>Total: ₹${order.totalAmount.toFixed(2)}</strong></div>
                                    <div style="font-size: 0.875rem; color: #48bb78;">Payment: ${order.paymentStatus}</div>
                                </div>
                                <button class="invoice-btn" onclick='renderInvoice(${JSON.stringify(order)})'>
                                    <i class="fas fa-receipt"></i> Get Invoice
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h2>No Orders Yet</h2>
                    <p>Start shopping to see your orders here!</p>
                    <button class="btn-primary" onclick="navigateTo('products')">Browse Products</button>
                </div>
            `}
        </div>
    `;
}

function getStatusColor(status) {
    const colors = {
        pending: '#feebc8',
        confirmed: '#bee3f8',
        shipped: '#fed7e2',
        delivered: '#c6f6d5'
    };
    return colors[status] || '#e2e8f0';
}

// Dashboard Functions
function renderDashboard() {
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    const totalSpent = userOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const cartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const userProducts = products.filter(p => p.sellerId === currentUser.id);
    const userSales = orders.reduce((sum, order) => {
        const userItems = order.items.filter(item => item.sellerId === currentUser.id);
        return sum + userItems.reduce((s, item) => s + (item.price * item.quantity), 0);
    }, 0);
    
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="container">
            <div class="hero" style="margin-bottom: 2rem;">
                <h2>Welcome back, ${currentUser.name}!</h2>
                <p>Here's your activity summary</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-shopping-bag"></i></div>
                    <div><div class="stat-value">${userOrders.length}</div><div class="stat-label">Total Orders</div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-rupee-sign"></i></div>
                    <div><div class="stat-value">₹${totalSpent.toFixed(2)}</div><div class="stat-label">Total Spent</div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div><div class="stat-value">${cartItems}</div><div class="stat-label">Cart Items</div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-box-open"></i></div>
                    <div><div class="stat-value">${userProducts.length}</div><div class="stat-label">Products Listed</div></div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                    <div><div class="stat-value">₹${userSales.toFixed(2)}</div><div class="stat-label">Total Sales</div></div>
                </div>
            </div>
            
            <div class="actions-grid">
                <button class="btn-primary" onclick="navigateTo('products')">Browse Products</button>
                <button class="btn-primary" onclick="navigateTo('sell')">List New Product</button>
                <button class="btn-primary" onclick="navigateTo('my-products')">My Products</button>
                <button class="btn-primary" onclick="navigateTo('cart')">View Cart</button>
                <button class="btn-primary" onclick="navigateTo('orders')">View Orders</button>
            </div>
        </div>
    `;
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.toggle('active');
}

// Initialize the app
initializeData();
renderHome();