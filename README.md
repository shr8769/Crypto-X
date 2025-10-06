# 🚀 CryptoX - Advanced Cryptocurrency Trading Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen)](https://crypto-qfn9dr1x2-shr8769s-projects.vercel.app)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-purple)](https://vitejs.dev/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-orange)](https://clerk.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC)](https://tailwindcss.com/)

## 🌟 **Live Application**
**🔗 [View Live Demo](https://crypto-qfn9dr1x2-shr8769s-projects.vercel.app)**

---

## 📋 **Table of Contents**
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Authentication](#-authentication)
- [Machine Learning](#-machine-learning)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 **Overview**

CryptoX is a **full-stack cryptocurrency trading platform** that combines real-time market data, advanced machine learning predictions, and secure user authentication. Built with modern React and TypeScript, it provides traders with comprehensive tools for cryptocurrency analysis and portfolio management.

### **🎨 Key Highlights:**
- 🔐 **Enterprise-grade authentication** with Clerk
- 📊 **Real-time cryptocurrency prices** and market data
- 🤖 **AI-powered price predictions** using machine learning models
- 📈 **Advanced trading analytics** and portfolio tracking
- 🌐 **Responsive design** for all devices
- ⚡ **Lightning-fast performance** with Vite
- 🎭 **Beautiful UI/UX** with Tailwind CSS and shadcn/ui

---

## ✨ **Features**

### 🔒 **Authentication System**
- **Secure Sign Up/Sign In** with email verification
- **Social Authentication** (Google OAuth integration)
- **Protected Routes** for authenticated users only
- **User Profile Management** with avatar and settings
- **Session Management** with automatic token refresh
- **Password Reset** functionality
- ## 🧠 Machine Learning Models Used

Crypto-X leverages multiple machine learning approaches for cryptocurrency analytics and prediction:

| Purpose                  | Model Types Used                                                       |
|--------------------------|-----------------------------------------------------------------------|
| **Price Prediction**     | Random Forest, Gradient Boosting, Linear Regression, LSTM Neural Net  |
| **Market Sentiment**     | Random Forest, Custom Sentiment Analyzer                              |
| **Trading Signals**      | Random Forest, LSTM (details vary by implementation)                  |

**Model Details:**
- **Random Forest Regressor**: Used for time series price prediction and sentiment analysis.
- **Gradient Boosting Regressor**: Available as an alternative for price prediction.
- **Linear Regression**: Serves as a simple baseline.
- **LSTM Neural Network**: Deep learning approach for advanced time series forecasting.
- **Custom Sentiment Analyzer**: Combines news and social data for market sentiment scoring.

See [`ml-service/models/simple_ml_model.py`](ml-service/models/simple_ml_model.py), [`ml-service/models/market_sentiment_model.py`](ml-service/models/market_sentiment_model.py), and the [AI Models section](#ai-models-implemented) for architecture details.

### 📊 **Real-Time Market Data**
- **Live Cryptocurrency Prices** for major coins (BTC, ETH, ADA, SOL, MATIC)
- **24h Price Changes** with percentage indicators
- **Market Volume** and market cap tracking
- **Price Charts** with interactive visualizations
- **Historical Data** analysis and trends

### 🤖 **Machine Learning & AI Predictions**
- **Price Prediction Models** using LSTM neural networks
- **Market Sentiment Analysis** for informed decision making
- **Trading Signal Generation** (Buy/Hold/Sell recommendations)
- **Technical Analysis** with multiple indicators
- **Risk Assessment** algorithms

### 📈 **Trading Dashboard**
- **Portfolio Overview** with performance metrics
- **Spending Analytics** with monthly tracking
- **Market Activity** monitoring
- **Personalized Recommendations** based on user behavior
- **Real-time Notifications** for price alerts

### 🗞️ **Crypto News Integration**
- **Latest News** from reliable cryptocurrency sources
- **Market Analysis** articles and insights
- **Price Impact** correlation with news events
- **Categorized Content** (Bitcoin, Ethereum, DeFi, etc.)

---

## 🛠️ **Tech Stack**

### **Frontend**
- **⚛️ React 18.3.1** - Modern UI library
- **📘 TypeScript 5.8.3** - Type-safe development
- **⚡ Vite 5.4.19** - Lightning-fast build tool
- **🎨 Tailwind CSS** - Utility-first styling
- **🎭 shadcn/ui** - Beautiful component library
- **🧩 Radix UI** - Accessible component primitives
- **📊 Recharts** - Interactive chart library
- **🔄 React Query** - Data fetching and caching
- **🛣️ React Router DOM** - Client-side routing

### **Backend & Services**
- **🐍 Python Flask** - ML model API server
- **🤖 scikit-learn** - Machine learning models
- **📊 pandas & numpy** - Data processing
- **🔐 Clerk** - Authentication and user management
- **☁️ Vercel** - Deployment and hosting

### **Development Tools**
- **📦 npm/Node.js** - Package management
- **🔧 ESLint** - Code linting
- **🎯 TypeScript** - Type checking
- **🎨 PostCSS** - CSS processing
- **📱 Mobile-first** responsive design

---

## 🔐 **Authentication**

CryptoX uses **Clerk** for enterprise-grade authentication:

```typescript
// Protected route example
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// User profile access
const { user, isSignedIn } = useUser();
```

**Authentication Features:**
- ✅ Email/Password authentication
- ✅ Google OAuth integration
- ✅ Email verification
- ✅ Password reset
- ✅ Session management
- ✅ User profile management

---

## 🤖 **Machine Learning**

### **AI Models Implemented:**

#### **📈 Price Prediction Model**
```python
# LSTM Neural Network for price prediction
class CryptoPriceLSTM:
    def __init__(self, sequence_length=60):
        self.model = Sequential([
            LSTM(50, return_sequences=True),
            LSTM(50, return_sequences=True),
            LSTM(50),
            Dense(25),
            Dense(1)
        ])
```

#### **📊 Market Sentiment Analysis**
```python
# Sentiment analysis for market trends
def analyze_market_sentiment(news_data, social_data):
    sentiment_score = sentiment_analyzer.predict(combined_data)
    return {"sentiment": sentiment_score, "confidence": confidence_level}
```

#### **🎯 Trading Signal Generator**
```python
# Technical analysis for trading signals
def generate_trading_signals(price_data, volume_data):
    signals = technical_analyzer.analyze(price_data, volume_data)
    return {"signal": "BUY/HOLD/SELL", "strength": confidence}
```

**ML Features:**
- 🧠 **LSTM Neural Networks** for price prediction
- 📊 **Sentiment Analysis** using NLP
- 📈 **Technical Indicators** (RSI, MACD, Bollinger Bands)
- 🎯 **Trading Signals** with confidence scores
- 📉 **Risk Assessment** algorithms

---

## 🚀 **Installation**

### **Prerequisites**
- Node.js 18+ 
- Python 3.8+ (for ML service)
- Git

### **Frontend Setup**

```bash
# Clone the repository
git clone https://github.com/shr8769/Crypto-X.git
cd Crypto-X

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Clerk keys to .env

# Start development server
npm run dev
```

### **ML Service Setup**

```bash
# Navigate to ML service
cd ml-service

# Create virtual environment
python -m venv ml_env
source ml_env/bin/activate  # On Windows: ml_env\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Train models
python train_all_models.py

# Start ML API server
python api_server.py
```

---

## 🔑 **Environment Variables**

Create a `.env` file in the root directory:

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Optional: Custom URLs
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_CLERK_AFTER_SIGN_IN_URL=/dashboard
VITE_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Getting Clerk Keys:**
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application
3. Copy your publishable key and secret key
4. Add them to your `.env` file

---

## 🌐 **Deployment**

### **Vercel Deployment** (Recommended)

```bash
# Build the project
npm run build

# Deploy to Vercel
npx vercel --prod

# Or use Vercel dashboard:
# 1. Connect your GitHub repository
# 2. Add environment variables
# 3. Deploy automatically
```

### **Other Deployment Options**
- **Netlify**: Drag and drop `dist` folder
- **GitHub Pages**: Static site deployment
- **AWS S3**: Static website hosting
- **Docker**: Containerized deployment

---

## 🔌 **API Endpoints**

### **ML Service API**

```bash
# Health check
GET /health

# Get price prediction
POST /predict
{
  "symbol": "BTC",
  "days": 7
}

# Get trading signals
POST /signals
{
  "symbol": "ETH",
  "timeframe": "1h"
}

# Market sentiment
GET /sentiment/{symbol}
```

### **External APIs Used**
- **CoinGecko API**: Real-time cryptocurrency data
- **News APIs**: Latest crypto news and analysis
- **Technical Analysis APIs**: Chart data and indicators

---

## 📊 **Project Structure**

```
Crypto-X/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AuthModal.tsx   # Authentication modal
│   │   ├── CryptoTicker.tsx # Price ticker
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   └── Navigation.tsx  # Navigation bar
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── hooks/              # Custom React hooks
│   │   ├── useCryptoPrices.ts
│   │   ├── useMLService.ts
│   │   └── useScrollToSection.ts
│   ├── pages/              # Route components
│   │   ├── Auth.tsx       # Authentication page
│   │   ├── Dashboard.tsx  # User dashboard
│   │   └── Index.tsx      # Homepage
│   ├── services/          # API services
│   │   └── aiPrediction.ts
│   └── types/             # TypeScript type definitions
├── ml-service/            # Python ML backend
│   ├── models/           # Trained ML models
│   ├── data/            # Historical crypto data
│   ├── api_server.py    # Flask API server
│   └── train_models.py  # Model training scripts
├── public/              # Static assets
└── docs/               # Documentation
```

---

## 🤝 **Contributing**

Contributions are welcome! Here's how you can help:

### **🐛 Bug Reports**
- Use the issue template
- Provide detailed reproduction steps
- Include screenshots if applicable

### **✨ Feature Requests**
- Check existing issues first
- Provide clear use cases
- Explain the expected behavior

### **🔧 Development**
```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
git commit -m "Add amazing feature"

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

**[shr8769](https://github.com/shr8769)**
- 🌐 **Live Demo**: [CryptoX Platform](https://crypto-qfn9dr1x2-shr8769s-projects.vercel.app)
- 📧 **Email**: Contact via GitHub
- 💼 **Portfolio**: [GitHub Profile](https://github.com/shr8769)

---

## 🙏 **Acknowledgments**

- **Clerk** for authentication services
- **Vercel** for hosting and deployment
- **CoinGecko** for cryptocurrency data
- **shadcn/ui** for beautiful components
- **React Team** for the amazing framework
- **Open Source Community** for inspiration and tools

---

## ⭐ **Show Your Support**

If you found this project helpful, please consider:
- ⭐ **Starring** the repository
- 🍴 **Forking** for your own projects
- 🐛 **Reporting** issues and bugs
- 💡 **Suggesting** new features
- 📢 **Sharing** with others

---

<div align="center">

**🚀 [Launch CryptoX Platform](https://crypto-qfn9dr1x2-shr8769s-projects.vercel.app) 🚀**

*Built with ❤️ by [shr8769](https://github.com/shr8769)*

</div>
