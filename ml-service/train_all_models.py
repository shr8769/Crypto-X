# crypto-ml-service/train_all_models.py
import os
import sys
import pandas as pd
from data_collector import CryptoDataCollector
from models.lstm_model import CryptoLSTMModel

def train_all_models():
    """Train models for all supported cryptocurrencies"""
    
    # Create directories
    os.makedirs('data', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    # Initialize collector
    collector = CryptoDataCollector()
    
    # Cryptocurrencies to train models for
    crypto_configs = {
        'bitcoin': 'bitcoin',
        'ethereum': 'ethereum', 
        'cardano': 'cardano',
        'solana': 'solana',
        'polygon': 'matic-network'
    }
    
    for symbol, coingecko_id in crypto_configs.items():
        print(f"\n{'='*50}")
        print(f"Training model for {symbol.upper()}")
        print(f"{'='*50}")
        
        try:
            # Step 1: Collect data
            print("1. Collecting historical data...")
            df = collector.get_historical_data(coingecko_id, days=730)  # 2 years
            
            if df is None or len(df) < 100:
                print(f"❌ Insufficient data for {symbol}")
                continue
            
            # Step 2: Add technical indicators
            print("2. Adding technical indicators...")
            df = collector.add_technical_indicators(df)
            
            # Save raw data
            df.to_csv(f'data/{symbol}_historical.csv')
            print(f"💾 Saved {len(df)} records to data/{symbol}_historical.csv")
            
            # Step 3: Train LSTM model
            print("3. Training LSTM model...")
            lstm_model = CryptoLSTMModel(sequence_length=60)
            
            # Train with different parameters based on data size
            epochs = 100 if len(df) > 1000 else 50
            batch_size = 32 if len(df) > 1000 else 16
            
            history = lstm_model.train(df, epochs=epochs, batch_size=batch_size)
            
            # Step 4: Save model
            model_path = f'models/{symbol}_lstm'
            lstm_model.save_model(model_path)
            print(f"✅ Model saved to {model_path}")
            
            # Step 5: Test prediction
            print("4. Testing prediction...")
            recent_data = df.tail(100)
            test_predictions = lstm_model.predict(recent_data, steps_ahead=5)
            print(f"📈 Test predictions: {test_predictions}")
            
            print(f"✅ Successfully trained model for {symbol}")
            
        except Exception as e:
            print(f"❌ Failed to train model for {symbol}: {e}")
            continue
    
    print(f"\n{'='*50}")
    print("Training completed!")
    print(f"{'='*50}")

if __name__ == "__main__":
    print("🚀 Starting ML model training pipeline...")
    train_all_models()