// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.product-card, .feature, .review-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Get products from admin panel
function getProductsByCategory(category) {
    const allProducts = JSON.parse(localStorage.getItem('azadFurnitureProducts')) || [];
    return allProducts.filter(product => product.category === category);
}

function getAllProducts() {
    return JSON.parse(localStorage.getItem('azadFurnitureProducts')) || [];
}

// Open product page
function openProductPage(category) {
    const products = getProductsByCategory(category);
    const categoryNames = {
        'doors': 'Doors & Frames',
        'sofa': 'Sofa Sets',
        'beds': 'Beds',
        'dining': 'Dining Tables', 
        'dressing': 'Creative Wooden Furniture',
        'custom': 'Custom Work'
    };
    
    let modalHtml = `
        <div class="product-modal" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <span class="close-btn" onclick="closeModal()">&times;</span>
                <h2>${categoryNames[category]}</h2>
                <div class="modal-products-grid">
    `;
    
    if (products.length === 0) {
        modalHtml += `<p style="text-align: center; padding: 20px; color: #666;">No products in this category yet.<br><a href="admin.html" style="color: #8B4513;">Add products from admin panel</a></p>`;
    } else {
        products.forEach(product => {
            modalHtml += `
                <div class="modal-product-card" onclick="showProductModal(${product.id}); event.stopPropagation();">
                    <div class="card-image-container">
                        <img src="${product.images[0]}" alt="${product.name}">
                        ${product.images.length > 1 ? `<div class="image-count">${product.images.length} photos</div>` : ''}
                    </div>
                    <h3>${product.name}</h3>
                    <div class="price">₹${product.price.toLocaleString()}</div>
                    <p>${product.description}</p>
                    <div class="card-actions">
                        <button class="view-details-btn" onclick="event.stopPropagation();">View Details</button>
                        <button class="whatsapp-btn" onclick="shareToWhatsApp(${product.id}); event.stopPropagation();">WhatsApp</button>
                    </div>
                </div>
            `;
        });
    }
    
    modalHtml += `
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';
}

// Show product details
function showProductModal(productId) {
    const allProducts = getAllProducts();
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) return;
    
    const modalHtml = `
        <div class="product-detail-modal" onclick="closeProductModal()">
            <div class="detail-modal-content" onclick="event.stopPropagation()">
                <span class="close-btn" onclick="closeProductModal()">&times;</span>
                <div class="product-detail-grid">
                    <div class="product-images-section">
                        <div class="main-image-container">
                            <img id="mainProductImage" src="${product.images[0]}" alt="${product.name}" onclick="zoomImage(this)">
                            ${product.images.length > 1 ? `
                                <button class="nav-btn prev-btn" onclick="changeImage(-1)">‹</button>
                                <button class="nav-btn next-btn" onclick="changeImage(1)">›</button>
                            ` : ''}
                        </div>
                        ${product.images.length > 1 ? `
                            <div class="thumbnail-container">
                                ${product.images.map((img, index) => `
                                    <img class="thumbnail ${index === 0 ? 'active' : ''}" 
                                         src="${img}" 
                                         onclick="setMainImage(${index})" 
                                         data-index="${index}">
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <div class="product-info-section">
                        <h2>${product.name}</h2>
                        <div class="product-price-large">₹${product.price.toLocaleString()}</div>
                        <div class="product-description-full">${product.description}</div>
                        <div class="product-actions">
                            <button class="whatsapp-btn-large" onclick="shareToWhatsApp(${product.id})">Share on WhatsApp</button>
                            <button class="call-btn" onclick="shareAndCall(${product.id})">Call & Share Info</button>
                        </div>
                    </div>
                </div>
                ${getRelatedProducts(product)}
            </div>
        </div>
        
        <div id="imageZoomModal" class="zoom-modal" onclick="closeZoom()" style="display: none;">
            <img id="zoomedImage" src="" alt="Zoomed view">
            <span class="zoom-close" onclick="closeZoom()">&times;</span>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    window.currentProductImages = product.images;
    window.currentImageIndex = 0;
    document.body.style.overflow = 'hidden';
}

// Navigate images
function changeImage(direction) {
    if (!window.currentProductImages) return;
    
    window.currentImageIndex += direction;
    
    if (window.currentImageIndex >= window.currentProductImages.length) {
        window.currentImageIndex = 0;
    } else if (window.currentImageIndex < 0) {
        window.currentImageIndex = window.currentProductImages.length - 1;
    }
    
    const mainImg = document.getElementById('mainProductImage');
    mainImg.src = window.currentProductImages[window.currentImageIndex];
    
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === window.currentImageIndex);
    });
}

function setMainImage(index) {
    window.currentImageIndex = index;
    const mainImg = document.getElementById('mainProductImage');
    mainImg.src = window.currentProductImages[index];
    
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function setMainImage(index) {
    window.currentImageIndex = index;
    const mainImg = document.getElementById('mainProductImage');
    mainImg.src = window.currentProductImages[index];
    
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Zoom image
function zoomImage(img) {
    const zoomModal = document.getElementById('imageZoomModal');
    const zoomedImg = document.getElementById('zoomedImage');
    zoomedImg.src = img.src;
    zoomModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeZoom() {
    const zoomModal = document.getElementById('imageZoomModal');
    zoomModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeProductModal() {
    const modal = document.querySelector('.product-detail-modal');
    const zoomModal = document.getElementById('imageZoomModal');
    if (modal) modal.remove();
    if (zoomModal) zoomModal.remove();
    document.body.style.overflow = 'auto';
}

// Test function to verify clicking works
function testClick() {
    alert('Click is working!');
}

// Make all functions globally available
window.showProductModal = showProductModal;
window.showCategoryProducts = showCategoryProducts;
window.closeModal = closeModal;
window.closeProductModal = closeProductModal;
window.changeImage = changeImage;
window.setMainImage = setMainImage;
window.zoomImage = zoomImage;
window.closeZoom = closeZoom;
window.testClick = testClick;

function closeModal() {
    const modal = document.querySelector('.product-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
            closeModal();
            closeZoom();
        }
        if (e.key === 'ArrowLeft' && window.currentProductImages) {
            changeImage(-1);
        }
        if (e.key === 'ArrowRight' && window.currentProductImages) {
            changeImage(1);
        }
    });
});

// Get related products
function getRelatedProducts(currentProduct) {
    const allProducts = getAllProducts();
    const priceRange = currentProduct.price * 0.3;
    
    const related = allProducts.filter(p => 
        p.id !== currentProduct.id && 
        p.category === currentProduct.category &&
        Math.abs(p.price - currentProduct.price) <= priceRange
    ).slice(0, 3);
    
    if (related.length === 0) return '';
    
    return `
        <div class="related-products">
            <h3>Similar Products</h3>
            <div class="related-grid">
                ${related.map(product => `
                    <div class="related-item" onclick="showProductModal(${product.id})">
                        <img src="${product.images[0]}" alt="${product.name}">
                        <h4>${product.name}</h4>
                        <div class="related-price">₹${product.price.toLocaleString()}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Share product to WhatsApp with image and details
function shareToWhatsApp(productId) {
    const allProducts = getAllProducts();
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) return;
    
    // Send notification to father first
    notifyFatherAboutInquiry(product, 'WhatsApp');
    
    // Create detailed message
    const message = `🪑 *Azad Furniture - Product Details*

📦 *Product:* ${product.name}
💰 *Price:* ₹${product.price.toLocaleString()}
📝 *Description:* ${product.description}

📍 *Visit our showroom:*
1, Housing Board Colony, Opposite Gupta Iron Store
Narsinghpur, MP 487001

📞 *Contact:* +91 70001 44345
⏰ *Open:* 9:00 AM - 9:00 PM (Every Day)

*Image attached below* 👇`;
    
    // Open WhatsApp with message
    const whatsappUrl = `https://wa.me/917000144345?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Show image sharing instruction
    setTimeout(() => {
        showImageShareModal(product);
    }, 1000);
}

// Share and call function
function shareAndCall(productId) {
    const allProducts = getAllProducts();
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) return;
    
    // Send notification to father
    notifyFatherAboutInquiry(product, 'Call');
    
    // Then initiate call
    setTimeout(() => {
        window.open('tel:+917000144345');
    }, 1000);
}

// Notify father about customer inquiry
function notifyFatherAboutInquiry(product, contactMethod) {
    const now = new Date();
    const time = now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    const date = now.toLocaleDateString('en-IN');
    
    // Show alert with product photo
    showInquiryAlert(product, contactMethod, time, date);
    
    // Create notification message for father
    const notificationMessage = `Hi, I came from Azad Furniture website and want to enquire about this product:

📦 *${product.name}*
💰 *Price: ₹${product.price.toLocaleString()}*

Please provide more details about this product.`;
    
    // Send notification to father's WhatsApp
    const fatherNotificationUrl = `https://wa.me/919630721750?text=${encodeURIComponent(notificationMessage)}`;
    
    // Open in background (new tab that closes quickly)
    const notificationTab = window.open(fatherNotificationUrl, '_blank');
    
    // Close notification tab after 3 seconds
    setTimeout(() => {
        if (notificationTab) {
            notificationTab.close();
        }
    }, 3000);
    
    // Store inquiry for tracking
    storeInquiry(product, contactMethod);
}

// Show inquiry alert with product photo
function showInquiryAlert(product, contactMethod, time, date) {
    const alertHtml = `
        <div class="inquiry-alert" onclick="closeInquiryAlert()">
            <div class="alert-content" onclick="event.stopPropagation()">
                <span class="close-btn" onclick="closeInquiryAlert()">&times;</span>
                <div class="alert-header">
                    <h3>🔔 Customer Inquiry Alert</h3>
                </div>
                <div class="alert-body">
                    <img src="${product.images[0]}" alt="${product.name}" class="alert-product-image">
                    <div class="alert-details">
                        <h4>${product.name}</h4>
                        <p class="alert-price">₹${product.price.toLocaleString()}</p>
                        <p class="alert-method">📞 Contact: ${contactMethod}</p>
                        <p class="alert-time">🕰️ ${time} | 📅 ${date}</p>
                    </div>
                </div>
                <div class="alert-message">
                    💬 Someone is interested in this product!
                </div>
                <button class="alert-ok-btn" onclick="closeInquiryAlert()">Got it!</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', alertHtml);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeInquiryAlert();
    }, 5000);
}

// Close inquiry alert
function closeInquiryAlert() {
    const alert = document.querySelector('.inquiry-alert');
    if (alert) {
        alert.remove();
    }
}

// Store inquiry for admin tracking
function storeInquiry(product, contactMethod) {
    const inquiries = JSON.parse(localStorage.getItem('customerInquiries')) || [];
    
    const inquiry = {
        id: Date.now(),
        productId: product.id,
        productName: product.name,
        price: product.price,
        contactMethod: contactMethod,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-IN'),
        time: new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        })
    };
    
    inquiries.push(inquiry);
    
    // Keep only last 50 inquiries
    if (inquiries.length > 50) {
        inquiries.splice(0, inquiries.length - 50);
    }
    
    localStorage.setItem('customerInquiries', JSON.stringify(inquiries));
}

// Show modal with image sharing instruction
function showImageShareModal(product) {
    const modalHtml = `
        <div class="share-modal" onclick="closeShareModal()">
            <div class="share-modal-content" onclick="event.stopPropagation()">
                <span class="close-btn" onclick="closeShareModal()">&times;</span>
                <h3>📱 Share Product Image</h3>
                <div class="share-instructions">
                    <img src="${product.images[0]}" alt="${product.name}" class="share-image">
                    <p><strong>Instructions:</strong></p>
                    <ol>
                        <li>Long press the image above</li>
                        <li>Select "Save Image" or "Copy Image"</li>
                        <li>Go to WhatsApp chat</li>
                        <li>Attach and send the image</li>
                    </ol>
                    <div class="share-actions">
                        <button onclick="downloadImage('${product.images[0]}', '${product.name}')">Download Image</button>
                        <button onclick="closeShareModal()">Done</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';
}

// Download image function
function downloadImage(imageUrl, productName) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${productName.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Close share modal
function closeShareModal() {
    const modal = document.querySelector('.share-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Global functions
window.openProductPage = openProductPage;
window.showProductModal = showProductModal;
window.closeModal = closeModal;
window.closeProductModal = closeProductModal;
window.changeImage = changeImage;
window.setMainImage = setMainImage;
window.zoomImage = zoomImage;
window.closeZoom = closeZoom;
window.getRelatedProducts = getRelatedProducts;
window.shareToWhatsApp = shareToWhatsApp;
window.shareAndCall = shareAndCall;
window.closeShareModal = closeShareModal;
window.downloadImage = downloadImage;
window.notifyFatherAboutInquiry = notifyFatherAboutInquiry;
window.storeInquiry = storeInquiry;
window.showInquiryAlert = showInquiryAlert;
window.closeInquiryAlert = closeInquiryAlert;