# Complete Squarespace Setup for Eromify

## Overview
This guide will help you set up Eromify entirely on Squarespace using the `eromify.com` domain.

## Domain Structure
- **Landing Page**: `eromify.com/` (Squarespace)
- **Application**: `eromify.com/app/` (Squarespace)
- **API**: `eromify.com/api/` (Squarespace)

## Step 1: Enable Squarespace Developer Platform

### 1.1 Access Developer Platform
1. Log into your Squarespace account
2. Go to **Settings** > **Advanced** > **Developer Platform**
3. Click **Enable Developer Platform**
4. Accept the terms and conditions

### 1.2 Create Developer Site
1. Click **Create Developer Site**
2. Choose a template (you can customize later)
3. Name your site: "Eromify"
4. Click **Create Site**

## Step 2: Install Squarespace CLI

### 2.1 Install CLI
```bash
# Install Squarespace CLI globally
npm install -g @squarespace/cli

# Verify installation
sqs --version
```

### 2.2 Login to Squarespace
```bash
# Login to your Squarespace account
sqs login

# Follow the prompts to authenticate
```

## Step 3: Initialize Project

### 3.1 Create Project Directory
```bash
# Create project directory
mkdir eromify-squarespace
cd eromify-squarespace

# Initialize Squarespace project
sqs init
```

### 3.2 Project Structure
Your project should look like this:
```
eromify-squarespace/
├── site/
│   ├── pages/
│   │   ├── index.html (Landing Page)
│   │   └── app.html (Application)
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css
│   │   ├── js/
│   │   │   └── main.js
│   │   └── images/
│   └── api/
│       └── server.js (Backend API)
├── package.json
└── sqs.config.json
```

## Step 4: Create Landing Page

### 4.1 Landing Page HTML
Create `site/pages/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eromify - AI Influencer Generator</title>
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <img src="/assets/images/logo.png" alt="Eromify" class="logo">
            </div>
            <div class="nav-menu">
                <a href="#features" class="nav-link">Features</a>
                <a href="#pricing" class="nav-link">Pricing</a>
                <a href="#faq" class="nav-link">FAQ</a>
            </div>
            <div class="nav-actions">
                <a href="/app/login" class="nav-link">Sign In</a>
                <a href="/app/register" class="btn-primary">Get Started</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">
                    Create Your<br>
                    <span class="gradient-text">AI Influencer</span>
                </h1>
                <p class="hero-description">
                    Build, customize and monetize stunning AI personas that look and sound like real influencers. 
                    Create authentic UGC ads that drive <span class="highlight">3x higher</span> conversion rates.
                </p>
                <div class="hero-actions">
                    <a href="/app/register" class="btn-primary">Create Your AI Persona</a>
                    <a href="#features" class="btn-secondary">Learn More</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
        <div class="container">
            <h2 class="section-title">Everything You Need to Succeed</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🤖</div>
                    <h3>AI Persona Creation</h3>
                    <p>Craft unique AI influencers with custom personalities, styles, and voices.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3>Content Generation</h3>
                    <p>Generate high-quality images, videos, and text content in seconds.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💰</div>
                    <h3>Monetization</h3>
                    <p>Turn your AI influencers into revenue-generating assets.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing">
        <div class="container">
            <h2 class="section-title">Choose Your Plan</h2>
            <div class="pricing-grid">
                <div class="pricing-card">
                    <h3>Builder</h3>
                    <div class="price">$12<span>/mo</span></div>
                    <ul class="features-list">
                        <li>500 credits/mo</li>
                        <li>1 influencer training</li>
                        <li>Image & video generation</li>
                        <li>Standard support</li>
                    </ul>
                    <a href="/app/register" class="btn-primary">Get Started</a>
                </div>
                <div class="pricing-card featured">
                    <h3>Launch</h3>
                    <div class="price">$25<span>/mo</span></div>
                    <ul class="features-list">
                        <li>2,000 credits/mo</li>
                        <li>2 influencer trainings</li>
                        <li>Image & video generation</li>
                        <li>Priority support</li>
                    </ul>
                    <a href="/app/register" class="btn-primary">Get Started</a>
                </div>
                <div class="pricing-card">
                    <h3>Growth</h3>
                    <div class="price">$79<span>/mo</span></div>
                    <ul class="features-list">
                        <li>8,000 credits/mo</li>
                        <li>5 influencer trainings</li>
                        <li>Image & video generation</li>
                        <li>Priority support</li>
                    </ul>
                    <a href="/app/register" class="btn-primary">Get Started</a>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="faq">
        <div class="container">
            <h2 class="section-title">Frequently Asked Questions</h2>
            <div class="faq-list">
                <div class="faq-item">
                    <h3>What is an AI influencer?</h3>
                    <p>An AI influencer is a computer-generated persona that can create content, interact with audiences, and promote products just like a human influencer.</p>
                </div>
                <div class="faq-item">
                    <h3>How much does it cost?</h3>
                    <p>We offer flexible pricing plans starting at $12/month. Each plan includes credits for content generation and influencer training.</p>
                </div>
                <div class="faq-item">
                    <h3>Can I monetize my AI influencers?</h3>
                    <p>Yes! You can use your AI influencers to create sponsored content, promote products, and generate revenue through various monetization strategies.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <img src="/assets/images/logo.png" alt="Eromify" class="logo">
                </div>
                <div class="footer-links">
                    <a href="#features">Features</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#faq">FAQ</a>
                    <a href="/app/support">Support</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Eromify. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="/assets/js/main.js"></script>
</body>
</html>
```

## Step 5: Create Application Page

### 5.1 Application HTML
Create `site/pages/app.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eromify App - AI Influencer Generator</title>
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/css/app.css">
</head>
<body>
    <div id="app">
        <!-- React app will be mounted here -->
    </div>
    
    <!-- Load React and your app -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="/assets/js/app.js"></script>
</body>
</html>
```

## Step 6: Create API Backend

### 6.1 API Server
Create `site/api/server.js`:
```javascript
// Simple API server for Squarespace
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../assets')));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Eromify API is running' });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
    // Handle user registration
    res.json({ message: 'Registration endpoint' });
});

app.post('/api/auth/login', (req, res) => {
    // Handle user login
    res.json({ message: 'Login endpoint' });
});

// Content generation routes
app.post('/api/content/generate', (req, res) => {
    // Handle content generation
    res.json({ message: 'Content generation endpoint' });
});

// Serve pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/index.html'));
});

app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/app.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Eromify API running on port ${PORT}`);
});
```

## Step 7: Create CSS Styles

### 7.1 Main CSS
Create `site/assets/css/main.css`:
```css
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #000;
    color: #fff;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid #333;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.nav-logo .logo {
    height: 40px;
}

.nav-menu {
    display: flex;
    gap: 2rem;
}

.nav-link {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s;
}

.nav-link:hover {
    color: #a78bfa;
}

.nav-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
}

/* Buttons */
.btn-primary {
    background: linear-gradient(135deg, #ec4899, #a78bfa);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: transform 0.3s;
}

.btn-primary:hover {
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: white;
    padding: 0.75rem 1.5rem;
    border: 1px solid #333;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-secondary:hover {
    background: #333;
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #000 0%, #1a1a2e 100%);
}

.hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.hero-title {
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.1;
}

.gradient-text {
    background: linear-gradient(135deg, #ec4899, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-description {
    font-size: 1.25rem;
    color: #ccc;
    margin-bottom: 2rem;
    max-width: 600px;
}

.highlight {
    color: #a78bfa;
    font-weight: 600;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

/* Sections */
.section-title {
    font-size: 3rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    background: linear-gradient(135deg, #ec4899, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Features */
.features {
    padding: 5rem 0;
    background: #111;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: #1a1a1a;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    border: 1px solid #333;
    transition: transform 0.3s;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #a78bfa;
}

/* Pricing */
.pricing {
    padding: 5rem 0;
    background: #000;
}

.pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
}

.pricing-card {
    background: #1a1a1a;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    border: 1px solid #333;
    position: relative;
}

.pricing-card.featured {
    border-color: #a78bfa;
    transform: scale(1.05);
}

.price {
    font-size: 3rem;
    font-weight: 700;
    color: #a78bfa;
    margin: 1rem 0;
}

.price span {
    font-size: 1rem;
    color: #ccc;
}

.features-list {
    list-style: none;
    margin: 2rem 0;
}

.features-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #333;
}

/* FAQ */
.faq {
    padding: 5rem 0;
    background: #111;
}

.faq-list {
    max-width: 800px;
    margin: 0 auto;
}

.faq-item {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #1a1a1a;
    border-radius: 0.5rem;
    border: 1px solid #333;
}

.faq-item h3 {
    color: #a78bfa;
    margin-bottom: 1rem;
}

/* Footer */
.footer {
    background: #000;
    padding: 3rem 0 1rem;
    border-top: 1px solid #333;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.footer-links {
    display: flex;
    gap: 2rem;
}

.footer-links a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.3s;
}

.footer-links a:hover {
    color: #a78bfa;
}

.footer-bottom {
    text-align: center;
    color: #666;
    padding-top: 2rem;
    border-top: 1px solid #333;
}

/* Responsive */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .nav-menu {
        display: none;
    }
    
    .hero-actions {
        flex-direction: column;
    }
    
    .pricing-card.featured {
        transform: none;
    }
}
```

## Step 8: Create JavaScript

### 8.1 Main JavaScript
Create `site/assets/js/main.js`:
```javascript
// Smooth scrolling for anchor links
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

// Mobile menu toggle (if needed)
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('h3');
    const answer = item.querySelector('p');
    
    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            otherItem.classList.remove('open');
        });
        
        // Toggle current item
        if (!isOpen) {
            item.classList.add('open');
        }
    });
});
```

## Step 9: Deploy to Squarespace

### 9.1 Build and Deploy
```bash
# Build the project
sqs build

# Deploy to Squarespace
sqs deploy

# Or use watch mode for development
sqs watch
```

### 9.2 Configure Domain
1. Go to Squarespace Settings
2. Navigate to **Domains**
3. Connect your `eromify.com` domain
4. Set as primary domain

## Step 10: Environment Variables

### 10.1 Add Environment Variables
In Squarespace Settings > Advanced > Code Injection, add:
```html
<script>
window.EROMIFY_CONFIG = {
    supabaseUrl: 'your_supabase_project_url',
    supabaseKey: 'your_supabase_anon_key',
    apiUrl: 'https://eromify.com/api'
};
</script>
```

## Step 11: Test Everything

### 11.1 Test URLs
- Landing page: `https://eromify.com`
- Application: `https://eromify.com/app`
- API health: `https://eromify.com/api/health`

### 11.2 Test Features
1. Navigation between pages
2. Responsive design
3. Form submissions
4. API endpoints
5. SSL certificate

## Benefits of This Setup

1. **Single Domain**: Everything on `eromify.com`
2. **Automatic SSL**: Squarespace provides SSL certificates
3. **CDN**: Global content delivery network
4. **Scalability**: Easy to scale with Squarespace infrastructure
5. **SEO**: Built-in SEO optimization
6. **Analytics**: Built-in analytics and insights
7. **Maintenance**: Minimal maintenance required

## Next Steps

1. Customize the design to match your brand
2. Add more features and pages
3. Integrate with Supabase for database
4. Add payment processing
5. Set up analytics and tracking
6. Test thoroughly before launch










