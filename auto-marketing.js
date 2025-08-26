// Auto Marketing System
class AutoMarketing {
    constructor() {
        this.config = MARKETING_CONFIG;
        this.isEnabled = localStorage.getItem('autoMarketingEnabled') === 'true';
    }

    // Generate AI description for product
    async generateDescription(product) {
        try {
            const prompt = `Create an engaging social media post for ${product.name}, a ${this.getCategoryName(product.category)} priced at ₹${product.price}. 
            Business: Azad Furniture, Narsinghpur. 
            Focus on: quality, craftsmanship, wooden furniture.
            Keep it under 200 characters.`;

            // Using free AI service (you can replace with OpenAI, Gemini, etc.)
            const response = await this.callAIService(prompt);
            return this.enhanceDescription(response, product);
        } catch (error) {
            console.error('AI Description generation failed:', error);
            return this.getFallbackDescription(product);
        }
    }

    // Call AI service (using Hugging Face as example)
    async callAIService(prompt) {
        try {
            const response = await fetch(this.config.AI_SERVICE.API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.AI_SERVICE.API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_length: 200,
                        temperature: 0.7
                    }
                })
            });

            const result = await response.json();
            return result[0]?.generated_text || this.getFallbackDescription();
        } catch (error) {
            throw new Error('AI service unavailable');
        }
    }

    // Enhance description with hashtags and business info
    enhanceDescription(aiText, product) {
        const categoryHashtags = this.config.TEMPLATES.HASHTAGS[product.category.toUpperCase()] || [];
        const generalHashtags = this.config.TEMPLATES.HASHTAGS.GENERAL;
        
        const hashtags = [...categoryHashtags, ...generalHashtags].slice(0, 8).join(' ');
        
        return `${aiText}

🏠 Azad Furniture, Narsinghpur
📞 +91 70001 44345
💰 ₹${product.price.toLocaleString()}

${hashtags}`;
    }

    // Fallback description if AI fails
    getFallbackDescription(product) {
        const templates = {
            doors: `Beautiful handcrafted ${product.name}! Premium wooden doors that add elegance to your home. Quality craftsmanship since 2011.`,
            sofa: `Comfortable ${product.name} for your living room! Handcrafted with premium wood for lasting comfort and style.`,
            beds: `Sleep in comfort with our ${product.name}! Sturdy wooden construction meets elegant design.`,
            dining: `Gather around our beautiful ${product.name}! Perfect for family meals and special occasions.`,
            dressing: `Elegant ${product.name} for your bedroom! Combines style with practical storage solutions.`,
            custom: `Custom ${product.name} made just for you! Personalized furniture that fits your space perfectly.`
        };

        return this.enhanceDescription(
            templates[product.category] || `Premium ${product.name} - Quality wooden furniture handcrafted with care.`,
            product
        );
    }

    // Post to Facebook
    async postToFacebook(product, description, imageUrl) {
        try {
            const response = await fetch(`https://graph.facebook.com/v18.0/${this.config.SOCIAL_PLATFORMS.FACEBOOK.PAGE_ID}/photos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: imageUrl,
                    caption: description,
                    access_token: this.config.SOCIAL_PLATFORMS.FACEBOOK.ACCESS_TOKEN
                })
            });

            const result = await response.json();
            return { success: true, platform: 'Facebook', id: result.id };
        } catch (error) {
            return { success: false, platform: 'Facebook', error: error.message };
        }
    }

    // Post to Instagram
    async postToInstagram(product, description, imageUrl) {
        try {
            // Step 1: Create media container
            const containerResponse = await fetch(`https://graph.facebook.com/v18.0/${this.config.SOCIAL_PLATFORMS.INSTAGRAM.ACCOUNT_ID}/media`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image_url: imageUrl,
                    caption: description,
                    access_token: this.config.SOCIAL_PLATFORMS.INSTAGRAM.ACCESS_TOKEN
                })
            });

            const container = await containerResponse.json();

            // Step 2: Publish media
            const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${this.config.SOCIAL_PLATFORMS.INSTAGRAM.ACCOUNT_ID}/media_publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    creation_id: container.id,
                    access_token: this.config.SOCIAL_PLATFORMS.INSTAGRAM.ACCESS_TOKEN
                })
            });

            const result = await publishResponse.json();
            return { success: true, platform: 'Instagram', id: result.id };
        } catch (error) {
            return { success: false, platform: 'Instagram', error: error.message };
        }
    }

    // Post to LinkedIn
    async postToLinkedIn(product, description, imageUrl) {
        try {
            const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.SOCIAL_PLATFORMS.LINKEDIN.ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    author: `urn:li:organization:${this.config.SOCIAL_PLATFORMS.LINKEDIN.COMPANY_ID}`,
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        'com.linkedin.ugc.ShareContent': {
                            shareCommentary: {
                                text: description
                            },
                            shareMediaCategory: 'IMAGE',
                            media: [{
                                status: 'READY',
                                media: imageUrl
                            }]
                        }
                    },
                    visibility: {
                        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                    }
                })
            });

            const result = await response.json();
            return { success: true, platform: 'LinkedIn', id: result.id };
        } catch (error) {
            return { success: false, platform: 'LinkedIn', error: error.message };
        }
    }

    // Post to Pinterest
    async postToPinterest(product, description, imageUrl) {
        try {
            const response = await fetch('https://api.pinterest.com/v5/pins', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.SOCIAL_PLATFORMS.PINTEREST.ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    board_id: this.config.SOCIAL_PLATFORMS.PINTEREST.BOARD_ID,
                    media_source: {
                        source_type: 'image_url',
                        url: imageUrl
                    },
                    description: description,
                    title: product.name,
                    link: 'https://wa.me/917000144345'
                })
            });

            const result = await response.json();
            return { success: true, platform: 'Pinterest', id: result.data.id };
        } catch (error) {
            return { success: false, platform: 'Pinterest', error: error.message };
        }
    }

    // Main marketing function
    async marketProduct(product) {
        if (!this.isEnabled) {
            return { success: false, message: 'Auto-marketing is disabled' };
        }

        try {
            // Generate AI description
            const description = await this.generateDescription(product);
            
            // Get first image
            const images = product.images || [product.image];
            const imageUrl = images[0];

            // Post to all platforms
            const results = await Promise.allSettled([
                this.postToFacebook(product, description, imageUrl),
                this.postToInstagram(product, description, imageUrl),
                this.postToLinkedIn(product, description, imageUrl),
                this.postToPinterest(product, description, imageUrl)
            ]);

            const successfulPosts = results.filter(r => r.status === 'fulfilled' && r.value.success);
            const failedPosts = results.filter(r => r.status === 'rejected' || !r.value.success);

            // Store marketing history
            this.saveMarketingHistory(product, description, successfulPosts, failedPosts);

            // Create platform results object
            const platformResults = {};
            const platforms = ['facebook', 'instagram', 'linkedin', 'pinterest'];
            
            results.forEach((result, index) => {
                const platform = platforms[index];
                if (result.status === 'fulfilled') {
                    platformResults[platform] = {
                        success: result.value.success,
                        id: result.value.id,
                        error: result.value.error
                    };
                } else {
                    platformResults[platform] = {
                        success: false,
                        error: result.reason.message
                    };
                }
            });
            
            return {
                success: successfulPosts.length > 0,
                description,
                successful: successfulPosts.length,
                failed: failedPosts.length,
                platformResults,
                results: results.map(r => r.status === 'fulfilled' ? r.value : r.reason)
            };

        } catch (error) {
            console.error('Marketing failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Save marketing history
    saveMarketingHistory(product, description, successful, failed) {
        const history = JSON.parse(localStorage.getItem('marketingHistory')) || [];
        
        history.push({
            productId: product.id,
            productName: product.name,
            description,
            timestamp: new Date().toISOString(),
            successful: successful.map(s => s.value?.platform),
            failed: failed.map(f => f.value?.platform || f.reason)
        });

        // Keep only last 50 entries
        if (history.length > 50) {
            history.splice(0, history.length - 50);
        }

        localStorage.setItem('marketingHistory', JSON.stringify(history));
    }

    // Get category name
    getCategoryName(category) {
        const categories = {
            'doors': 'wooden door',
            'sofa': 'sofa set',
            'beds': 'wooden bed',
            'dining': 'dining table',
            'dressing': 'dressing table',
            'custom': 'custom furniture'
        };
        return categories[category] || 'furniture';
    }

    // Toggle auto-marketing
    toggleAutoMarketing(enabled) {
        this.isEnabled = enabled;
        localStorage.setItem('autoMarketingEnabled', enabled.toString());
    }

    // Get marketing history
    getMarketingHistory() {
        return JSON.parse(localStorage.getItem('marketingHistory')) || [];
    }
}

// Initialize auto-marketing
const autoMarketing = new AutoMarketing();