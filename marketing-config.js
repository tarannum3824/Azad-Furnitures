// Marketing Configuration
const MARKETING_CONFIG = {
    // AI Service for generating descriptions
    AI_SERVICE: {
        // Using free Hugging Face API for text generation
        API_URL: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        API_KEY: 'YOUR_HUGGING_FACE_API_KEY', // Get free from huggingface.co
    },
    
    // Social Media APIs
    SOCIAL_PLATFORMS: {
        FACEBOOK: {
            APP_ID: 'YOUR_FACEBOOK_APP_ID',
            ACCESS_TOKEN: 'YOUR_FACEBOOK_ACCESS_TOKEN',
            PAGE_ID: 'YOUR_FACEBOOK_PAGE_ID'
        },
        INSTAGRAM: {
            ACCESS_TOKEN: 'YOUR_INSTAGRAM_ACCESS_TOKEN',
            ACCOUNT_ID: 'YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID'
        },
        LINKEDIN: {
            ACCESS_TOKEN: 'YOUR_LINKEDIN_ACCESS_TOKEN',
            COMPANY_ID: 'YOUR_LINKEDIN_COMPANY_ID'
        },
        PINTEREST: {
            ACCESS_TOKEN: 'YOUR_PINTEREST_ACCESS_TOKEN',
            BOARD_ID: 'YOUR_PINTEREST_BOARD_ID'
        }
    },
    
    // Marketing templates
    TEMPLATES: {
        FURNITURE_KEYWORDS: [
            'handcrafted', 'premium wood', 'custom furniture', 'wooden furniture',
            'home decor', 'interior design', 'quality craftsmanship', 'durable',
            'elegant design', 'traditional', 'modern', 'affordable luxury'
        ],
        
        HASHTAGS: {
            GENERAL: ['#furniture', '#woodwork', '#homedecor', '#interiordesign', '#handmade'],
            DOORS: ['#doors', '#woodendoors', '#homedoors', '#customdoors'],
            SOFA: ['#sofa', '#livingroom', '#comfort', '#sofaset'],
            BEDS: ['#beds', '#bedroom', '#sleep', '#woodenbed'],
            DINING: ['#diningtable', '#familytime', '#diningroom'],
            DRESSING: ['#dressingtable', '#bedroom', '#storage'],
            CUSTOM: ['#custom', '#bespoke', '#personalized']
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MARKETING_CONFIG;
}