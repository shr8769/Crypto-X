# train_advanced_models.py
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'models'))

from synthetic_data_generator import SyntheticCryptoData
from models.simple_ml_model import CryptoMLModel
from models.trading_signal_model import TradingSignalModel
from models.market_sentiment_model import MarketSentimentModel

def train_all_advanced_models():
    """Train all advanced ML models including trading signals and market sentiment"""
    
    # Initialize data generator
    data_generator = SyntheticCryptoData()
    
    # Cryptocurrencies to train models for
    symbols = ['bitcoin', 'ethereum', 'cardano', 'solana', 'polygon']
    
    print("🚀 Starting Advanced ML Model Training")
    print("=" * 60)
    
    for symbol in symbols:
        print(f"\n🔄 Training models for {symbol.upper()}")
        print("-" * 40)
        
        # Generate training data
        print(f"📊 Generating synthetic data for {symbol}...")
        df = data_generator.generate_realistic_data(symbol, days=730)
        
        # Add technical indicators
        df = data_generator.add_technical_indicators(df)
        
        print(f"📈 Generated {len(df)} data points")
        print(f"📈 Date range: {df.index[0]} to {df.index[-1]}")
        
        # 1. Train Price Prediction Model (already exists, but retrain)
        print(f"\n1️⃣ Training Price Prediction Model for {symbol}...")
        price_model = CryptoMLModel()
        price_results = price_model.train(df)
        
        # Save price prediction model
        base_dir = os.path.dirname(__file__)
        price_model_path = os.path.join(base_dir, 'models', f'{symbol}_ml_model')
        price_model.save_model(price_model_path)
        
        # 2. Train Trading Signal Model
        print(f"\n2️⃣ Training Trading Signal Model for {symbol}...")
        trading_model = TradingSignalModel()
        trading_results = trading_model.train(df)
        
        # Save trading signal model
        trading_model_path = os.path.join(base_dir, 'models', f'{symbol}_trading_signal.pkl')
        trading_model.save_model(trading_model_path)
        
        # 3. Train Market Sentiment Model
        print(f"\n3️⃣ Training Market Sentiment Model for {symbol}...")
        sentiment_model = MarketSentimentModel()
        sentiment_results = sentiment_model.train(df)
        
        # Save market sentiment model  
        sentiment_model_path = os.path.join(base_dir, 'models', f'{symbol}_market_sentiment.pkl')
        sentiment_model.save_model(sentiment_model_path)
        
        # Display results summary
        print(f"\n📊 RESULTS SUMMARY for {symbol.upper()}:")
        print(f"   💰 Price Prediction - Accuracy: {price_results['accuracy']:.1%}")
        print(f"   📈 Trading Signals - Accuracy: {trading_results['accuracy']:.1%}")
        print(f"   🎯 Market Sentiment - R² Score: {sentiment_results['r2_score']:.3f}")
        
        # Test the models with sample predictions
        print(f"\n🧪 Testing models with recent data...")
        
        try:
            # Test price prediction - use more data points
            recent_data = df.tail(200)  # Ensure we have enough data
            price_pred = price_model.predict(recent_data, steps_ahead=5)
            print(f"   💰 Price prediction (5h ahead): ${price_pred[-1]:,.2f}")
            
            # Test trading signal
            trading_signal = trading_model.predict_signal(recent_data)
            print(f"   📈 Trading signal: {trading_signal['action']} (Confidence: {trading_signal['confidence']:.1%})")
            
            # Test market sentiment
            market_sentiment = sentiment_model.predict_sentiment(recent_data)
            print(f"   🎯 Market sentiment: {market_sentiment['overall']} (Score: {market_sentiment['score']:.1f})")
        except Exception as e:
            print(f"   ⚠️ Testing skipped: {e}")
        
        print(f"\n✅ All models trained successfully for {symbol}!")
    
    print(f"\n🎉 TRAINING COMPLETE!")
    print("=" * 60)
    print("📁 Saved Models:")
    print("   • Price Prediction Models: models/{symbol}_ml_model.pkl")
    print("   • Trading Signal Models: models/{symbol}_trading_signal.pkl")  
    print("   • Market Sentiment Models: models/{symbol}_market_sentiment.pkl")
    print("\n🚀 Ready to deploy advanced ML-powered predictions!")

if __name__ == "__main__":
    train_all_advanced_models()