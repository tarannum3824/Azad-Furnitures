// Language management
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('adminLanguage') || 'en';
        this.init();
    }

    init() {
        document.getElementById('languageSelect').value = this.currentLang;
        this.applyLanguage();
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.currentLang = e.target.value;
            localStorage.setItem('adminLanguage', this.currentLang);
            this.applyLanguage();
        });
    }

    applyLanguage() {
        document.querySelectorAll('[data-en]').forEach(element => {
            const text = element.getAttribute(`data-${this.currentLang}`);
            if (text) {
                if (element.tagName === 'OPTION') {
                    element.textContent = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }

    getText(enText, hiText) {
        return this.currentLang === 'hi' ? hiText : enText;
    }
}

// Product management system
class ProductManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('azadFurnitureProducts')) || [];
        this.languageManager = new LanguageManager();
        this.init();
    }

    init() {
        this.bindEvents();
        this.displayProducts();
        this.currentFilter = 'all';
    }

    bindEvents() {
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct();
        });
        
        document.getElementById('productImages').addEventListener('change', (e) => {
            this.previewImages(e.target.files);
        });
        
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.displayProducts();
        });
    }
    
    previewImages(files) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = '';
        
        if (files.length > 5) {
            const msg = this.languageManager.getText(
                'Maximum 5 images allowed',
                'अधिकतम 5 तस्वीरें अनुमतित हैं'
            );
            alert(msg);
            document.getElementById('productImages').value = '';
            return;
        }
        
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const div = document.createElement('div');
                div.className = 'preview-item';
                div.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button type="button" class="remove-image" onclick="productManager.removePreviewImage(${index})">&times;</button>
                `;
                preview.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    }
    
    removePreviewImage(index) {
        const input = document.getElementById('productImages');
        const dt = new DataTransfer();
        const files = Array.from(input.files);
        
        files.forEach((file, i) => {
            if (i !== index) dt.items.add(file);
        });
        
        input.files = dt.files;
        this.previewImages(input.files);
    }

    addProduct() {
        // Check if in edit mode
        if (this.editingProductId) {
            this.updateProduct(this.editingProductId);
            return;
        }
        
        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const description = document.getElementById('productDescription').value;
        const category = document.getElementById('productCategory').value;
        const imageFiles = document.getElementById('productImages').files;

        if (imageFiles.length === 0) {
            const msg = this.languageManager.getText('Please select at least one image', 'कृपया कम से कम एक तस्वीर चुनें');
            alert(msg);
            return;
        }

        if (imageFiles.length > 5) {
            const msg = this.languageManager.getText('Maximum 5 images allowed', 'अधिकतम 5 तस्वीरें अनुमतित हैं');
            alert(msg);
            return;
        }

        const images = [];
        let loadedCount = 0;

        Array.from(imageFiles).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                images[index] = e.target.result;
                loadedCount++;
                
                if (loadedCount === imageFiles.length) {
                    const product = {
                        id: Date.now(),
                        name,
                        price: parseInt(price),
                        description,
                        category,
                        images: images,
                        createdAt: new Date().toISOString(),
                        marketingStatus: {},
                        lastPosted: null
                    };

                    this.products.push(product);
                    this.saveProducts();
                    this.displayProducts();
                    this.clearForm();
                    
                    // Auto-marketing
                    if (document.getElementById('autoMarketing').checked) {
                        this.autoMarketNewProduct(product);
                    }
                    
                    const msg = this.languageManager.getText('Product added successfully!', 'उत्पाद सफलतापूर्वक जोड़ा गया!');
                    alert(msg);
                }
            };
            reader.readAsDataURL(file);
        });
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;
        
        // Fill form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productCategory').value = product.category;
        
        // Show current images
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = '';
        product.images.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `<img src="${img}" alt="Current ${index + 1}">`;
            preview.appendChild(div);
        });
        
        // Change form to edit mode
        const form = document.getElementById('productForm');
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.textContent = this.languageManager.getText('Update Product', 'उत्पाद अपडेट करें');
        submitBtn.onclick = (e) => {
            e.preventDefault();
            this.updateProduct(id);
        };
        
        // Add cancel button
        if (!form.querySelector('.cancel-btn')) {
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'cancel-btn';
            cancelBtn.textContent = this.languageManager.getText('Cancel', 'रद्द करें');
            cancelBtn.onclick = () => this.cancelEdit();
            form.appendChild(cancelBtn);
        }
        
        // Store editing product ID
        this.editingProductId = id;
    }
    
    updateProduct(id) {
        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const description = document.getElementById('productDescription').value;
        const category = document.getElementById('productCategory').value;
        const imageFiles = document.getElementById('productImages').files;
        
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex === -1) return;
        
        // Update basic info
        this.products[productIndex].name = name;
        this.products[productIndex].price = parseInt(price);
        this.products[productIndex].description = description;
        this.products[productIndex].category = category;
        
        // Update images if new ones selected
        if (imageFiles.length > 0) {
            const images = [];
            let loadedCount = 0;
            
            Array.from(imageFiles).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    images[index] = e.target.result;
                    loadedCount++;
                    
                    if (loadedCount === imageFiles.length) {
                        this.products[productIndex].images = images;
                        this.saveProducts();
                        this.displayProducts();
                        this.cancelEdit();
                        alert(this.languageManager.getText('Product updated!', 'उत्पाद अपडेट हो गया!'));
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            this.saveProducts();
            this.displayProducts();
            this.cancelEdit();
            alert(this.languageManager.getText('Product updated!', 'उत्पाद अपडेट हो गया!'));
        }
    }
    
    cancelEdit() {
        this.clearForm();
        const form = document.getElementById('productForm');
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.textContent = this.languageManager.getText('Add Product', 'उत्पाद जोड़ें');
        submitBtn.onclick = null;
        
        const cancelBtn = form.querySelector('.cancel-btn');
        if (cancelBtn) cancelBtn.remove();
        
        this.editingProductId = null;
    }

    deleteProduct(id) {
        const msg = this.languageManager.getText(
            'Are you sure you want to delete this product?',
            'क्या आप वाकई इस उत्पाद को हटाना चाहते हैं?'
        );
        if (confirm(msg)) {
            this.products = this.products.filter(product => product.id !== id);
            this.saveProducts();
            this.displayProducts();
        }
    }

    saveProducts() {
        localStorage.setItem('azadFurnitureProducts', JSON.stringify(this.products));
    }

    displayProducts() {
        const container = document.getElementById('productsList');
        
        // Filter products by category
        const filteredProducts = this.currentFilter === 'all' 
            ? this.products 
            : this.products.filter(product => product.category === this.currentFilter);
        
        if (filteredProducts.length === 0) {
            const msg = this.currentFilter === 'all' 
                ? this.languageManager.getText('No products added yet.', 'अभी तक कोई उत्पाद नहीं जोड़ा गया.')
                : this.languageManager.getText('No products in this category.', 'इस श्रेणी में कोई उत्पाद नहीं.');
            container.innerHTML = `<p style="text-align: center; color: #666;">${msg}</p>`;
            return;
        }

        container.innerHTML = filteredProducts.map(product => {
            const images = product.images || [product.image];
            const marketingStatus = product.marketingStatus || {};
            const isPosted = Object.keys(marketingStatus).some(platform => marketingStatus[platform].success);
            
            return `
                <div class="product-item">
                    <div class="product-images">
                        <img class="main-image" src="${images[0]}" alt="${product.name}" onclick="productManager.viewProduct(${product.id})">
                        ${images.length > 1 ? `<div class="image-count">${images.length} photos</div>` : ''}
                        ${isPosted ? '<div class="posted-badge">Posted</div>' : ''}
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="product-price">₹${product.price.toLocaleString()}</div>
                        <div class="product-category">${this.getCategoryName(product.category)}</div>
                        <div class="product-description">${product.description}</div>
                        
                        <div class="marketing-status-display">
                            ${this.getMarketingStatusHTML(marketingStatus)}
                        </div>
                        
                        <div class="product-actions">
                            <button class="edit-btn" onclick="productManager.editProduct(${product.id})">
                                ${this.languageManager.getText('Edit', 'संपादित करें')}
                            </button>
                            <button class="post-btn" onclick="productManager.manualMarketing(${product.id})" ${isPosted ? 'disabled' : ''}>
                                ${this.languageManager.getText(isPosted ? 'Posted' : 'Post Now', isPosted ? 'पोस्ट किया' : 'अभी पोस्ट करें')}
                            </button>
                            <button class="delete-btn" onclick="productManager.deleteProduct(${product.id})">
                                ${this.languageManager.getText('Delete', 'हटाएं')}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getCategoryName(category) {
        const categoriesEn = {
            'doors': 'Doors & Frames',
            'sofa': 'Sofa Sets',
            'beds': 'Beds',
            'dining': 'Dining Tables',
            'dressing': 'Dressing Tables',
            'custom': 'Custom Work'
        };
        
        const categoriesHi = {
            'doors': 'दरवाजे और फ्रेम',
            'sofa': 'सोफा सेट',
            'beds': 'बिस्तर',
            'dining': 'डाइनिंग टेबल',
            'dressing': 'ड्रेसिंग टेबल',
            'custom': 'कस्टम काम'
        };
        
        const categories = this.languageManager.currentLang === 'hi' ? categoriesHi : categoriesEn;
        return categories[category] || category;
    }
    
    // Get marketing status HTML
    getMarketingStatusHTML(marketingStatus) {
        if (!marketingStatus || Object.keys(marketingStatus).length === 0) {
            return `<span class="status-text">${this.languageManager.getText('Not posted', 'पोस्ट नहीं किया')}</span>`;
        }
        
        const platforms = ['facebook', 'instagram', 'linkedin', 'pinterest'];
        const statusIcons = platforms.map(platform => {
            const status = marketingStatus[platform];
            if (!status) return '';
            
            const icon = status.success ? '✓' : '✗';
            const className = status.success ? 'success' : 'failed';
            const title = `${platform}: ${status.success ? 'Posted' : 'Failed'}`;
            
            return `<span class="platform-status ${className}" title="${title}">${icon}</span>`;
        }).join('');
        
        return statusIcons;
    }
    
    // Manual marketing for existing products
    async manualMarketing(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const button = event.target;
        const originalText = button.textContent;
        
        button.disabled = true;
        button.innerHTML = `<span class="marketing-loading"></span> ${this.languageManager.getText('Posting...', 'पोस्ट कर रहे...')}`;
        
        try {
            const result = await autoMarketing.marketProduct(product);
            
            // Update product with marketing status
            product.marketingStatus = result.platformResults || {};
            product.lastPosted = new Date().toISOString();
            
            // Save updated product
            const productIndex = this.products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                this.products[productIndex] = product;
                this.saveProducts();
            }
            
            // Refresh display
            this.displayProducts();
            
            if (result.success) {
                alert(this.languageManager.getText(
                    `Posted to ${result.successful} platforms!`,
                    `${result.successful} प्लेटफॉर्म पर पोस्ट किया!`
                ));
            } else {
                alert(this.languageManager.getText(
                    'Posting failed. Check your settings.',
                    'पोस्टिंग विफल. अपनी सेटिंग जाँचें.'
                ));
            }
        } catch (error) {
            button.disabled = false;
            button.textContent = originalText;
            alert(this.languageManager.getText(
                'Error occurred while posting.',
                'पोस्टिंग में त्रुटि.'
            ));
        }
    }

    clearForm() {
        document.getElementById('productForm').reset();
        document.getElementById('imagePreview').innerHTML = '';
    }
    
    viewProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            window.showProductModal(product);
        }
    }
    
    // Marketing integration
    async marketProduct(product) {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'marketing-status loading';
        statusDiv.innerHTML = `<span class="marketing-loading"></span> ${this.languageManager.getText('Posting to social media...', 'सोशल मीडिया पर पोस्ट कर रहे हैं...')}`;
        statusDiv.style.display = 'block';
        
        const form = document.getElementById('productForm');
        form.appendChild(statusDiv);
        
        try {
            const result = await autoMarketing.marketProduct(product);
            
            if (result.success) {
                statusDiv.className = 'marketing-status success';
                statusDiv.innerHTML = this.languageManager.getText(
                    `Posted to ${result.successful} platforms successfully!`,
                    `${result.successful} प्लेटफॉर्म पर सफलतापूर्वक पोस्ट किया!`
                );
            } else {
                statusDiv.className = 'marketing-status error';
                statusDiv.innerHTML = this.languageManager.getText(
                    'Marketing failed. Check your API settings.',
                    'मार्केटिंग विफल. अपनी API सेटिंग्स जाँचें.'
                );
            }
        } catch (error) {
            statusDiv.className = 'marketing-status error';
            statusDiv.innerHTML = this.languageManager.getText(
                'Marketing error occurred.',
                'मार्केटिंग में त्रुटि हुई.'
            );
        }
        
        // Remove status after 5 seconds
        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.parentNode.removeChild(statusDiv);
            }
        }, 5000);
    }

    // Method to get products for main website
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    getAllProducts() {
        return this.products;
    }
}

// Marketing history modal
function showMarketingHistory() {
    const history = autoMarketing.getMarketingHistory();
    
    let modalHtml = `
        <div class="marketing-modal" onclick="closeMarketingModal()">
            <div class="marketing-modal-content" onclick="event.stopPropagation()">
                <span class="close-btn" onclick="closeMarketingModal()">&times;</span>
                <h2>Marketing History</h2>
    `;
    
    if (history.length === 0) {
        modalHtml += '<p>No marketing history yet.</p>';
    } else {
        history.reverse().forEach(item => {
            modalHtml += `
                <div class="marketing-history-item">
                    <h4>${item.productName}</h4>
                    <p><strong>Posted:</strong> ${new Date(item.timestamp).toLocaleString()}</p>
                    <p><strong>Description:</strong> ${item.description.substring(0, 100)}...</p>
                    <div class="marketing-platforms">
                        ${item.successful.map(platform => 
                            `<span class="platform-badge success">${platform}</span>`
                        ).join('')}
                        ${item.failed.map(platform => 
                            `<span class="platform-badge failed">${platform}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
        });
    }
    
    modalHtml += `
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeMarketingModal() {
    const modal = document.querySelector('.marketing-modal');
    if (modal) modal.remove();
}

// Initialize product manager
const productManager = new ProductManager();

// Initialize auto-marketing toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('autoMarketing');
    toggle.checked = autoMarketing.isEnabled;
    
    toggle.addEventListener('change', (e) => {
        autoMarketing.toggleAutoMarketing(e.target.checked);
    });
});