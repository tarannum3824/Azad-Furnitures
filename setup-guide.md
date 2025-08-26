# Auto-Marketing Setup Guide

## 🚀 Complete Auto-Marketing System for Azad Furniture

Your admin panel now includes **AI-powered auto-marketing** that automatically posts to social media when you add products!

## ✅ Features Added:

### **AI Description Generation**
- Automatically creates engaging social media posts
- Uses product details to generate relevant content
- Includes business information and hashtags
- Supports both English and Hindi

### **Multi-Platform Posting**
- **Facebook** - Business page posts
- **Instagram** - Business account posts  
- **LinkedIn** - Company page posts
- **Pinterest** - Board pins
- **Auto-hashtags** for better reach

### **Smart Features**
- Toggle on/off auto-marketing
- Marketing history tracking
- Success/failure notifications
- Fallback descriptions if AI fails

## 🔧 Setup Instructions:

### **Step 1: Get API Keys**

#### **1. Hugging Face (Free AI Service)**
1. Go to [huggingface.co](https://huggingface.co)
2. Create free account
3. Go to Settings → Access Tokens
4. Create new token
5. Copy token to `marketing-config.js`

#### **2. Facebook/Instagram APIs**
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create app → Business type
3. Add Facebook Login and Instagram Basic Display
4. Get Page Access Token and Instagram Account ID
5. Add to `marketing-config.js`

#### **3. LinkedIn API**
1. Go to [developer.linkedin.com](https://developer.linkedin.com)
2. Create app for your company
3. Request Marketing Developer Platform access
4. Get access token
5. Add to `marketing-config.js`

#### **4. Pinterest API**
1. Go to [developers.pinterest.com](https://developers.pinterest.com)
2. Create app
3. Get access token and board ID
4. Add to `marketing-config.js`

### **Step 2: Configure APIs**

Edit `marketing-config.js` file:

```javascript
const MARKETING_CONFIG = {
    AI_SERVICE: {
        API_KEY: 'hf_your_hugging_face_token_here',
    },
    SOCIAL_PLATFORMS: {
        FACEBOOK: {
            ACCESS_TOKEN: 'your_facebook_page_token',
            PAGE_ID: 'your_facebook_page_id'
        },
        INSTAGRAM: {
            ACCESS_TOKEN: 'your_instagram_token',
            ACCOUNT_ID: 'your_instagram_business_id'
        },
        // ... add other platforms
    }
};
```

### **Step 3: Test the System**

1. Open admin panel
2. Enable "Auto-post to social media" toggle
3. Add a test product
4. Check marketing status messages
5. Verify posts on social platforms

## 📱 How It Works:

### **When You Add a Product:**
1. **AI generates** engaging description
2. **Adds hashtags** relevant to category
3. **Posts to all platforms** simultaneously
4. **Shows success/failure** status
5. **Saves history** for tracking

### **Generated Post Example:**
```
Beautiful handcrafted Wooden Door! 
Premium quality that adds elegance to your home. 
Quality craftsmanship since 2011.

🏠 Azad Furniture, Narsinghpur
📞 +91 70001 44345
💰 ₹15,000

#doors #woodendoors #homedoors #furniture #woodwork #homedecor #interiordesign #handmade
```

## 🎯 Marketing Features:

### **Smart Hashtags by Category:**
- **Doors**: #doors #woodendoors #homedoors
- **Sofa**: #sofa #livingroom #comfort #sofaset
- **Beds**: #beds #bedroom #sleep #woodenbed
- **Dining**: #diningtable #familytime #diningroom

### **Auto-Generated Content:**
- Product name and price
- Category-specific descriptions
- Business contact information
- Relevant hashtags
- Call-to-action phrases

### **Marketing History:**
- Track all posted products
- See which platforms succeeded/failed
- View generated descriptions
- Monitor posting timestamps

## 🔒 Privacy & Security:

- All data stored locally in browser
- No sensitive information shared
- API keys stored in config file only
- Marketing can be disabled anytime

## 💡 Pro Tips:

1. **Start with one platform** (Facebook) to test
2. **Use high-quality images** for better engagement
3. **Check marketing history** regularly
4. **Adjust descriptions** if needed
5. **Monitor social media** for customer responses

## 🆘 Troubleshooting:

### **If Marketing Fails:**
1. Check API keys in `marketing-config.js`
2. Verify internet connection
3. Check platform-specific requirements
4. Review error messages in browser console

### **Common Issues:**
- **"API key invalid"** → Update tokens in config
- **"Platform failed"** → Check individual platform settings
- **"AI service unavailable"** → Uses fallback descriptions

## 🚀 Ready to Use!

Your auto-marketing system is now ready! Every time you add a product, it will automatically:

✅ Generate AI-powered descriptions  
✅ Post to multiple social platforms  
✅ Include relevant hashtags  
✅ Track marketing success  
✅ Build your online presence  

**Start adding products and watch your social media grow automatically!**