# train_simple_models.py
import os
import sys
import pandas as pd
from models.simple_ml_model import CryptoMLModel

def train_all_models():
    """Train ML models for all supported cryptocurrencies"""
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Cryptocurrencies to train models for
    symbols = ['bitcoin', 'ethereum', 'cardano', 'solana', 'polygon']
    
    results = {}
    
    for symbol in symbols:
        print(f"\n{'='*60}")
        print(f"Training model for {symbol.upper()}")
        print(f"{'='*60}")
        
        try:
            # Step 1: Load data
            print("1. Loading historical data...")
            df = pd.read_csv(f'data/{symbol}_historical.csv', index_col='timestamp', parse_dates=True)
            
            if len(df) < 100:
                print(f"❌ Insufficient data for {symbol}")
                continue
            
            print(f"✅ Loaded {len(df)} data points")
            
            # Step 2: Train model
            print("2. Training Random Forest model...")
            model = CryptoMLModel(model_type='random_forest', sequence_length=24)
            
            metrics = model.train(df, test_size=0.2)
            
            # Step 3: Save model
            model_path = f'models/{symbol}_ml_model'
            model.save_model(model_path)
            print(f"✅ Model saved to {model_path}.pkl")
            
            # Step 4: Test prediction
            print("3. Testing predictions...")
            recent_data = df.tail(200)  # Use more data for prediction
            test_predictions = model.predict(recent_data, steps_ahead=5)
            
            current_price = df['price'].iloc[-1]
            predicted_change = ((test_predictions[0] / current_price) - 1) * 100
            
            print(f"📈 Current price: ${current_price:.2f}")
            print(f"📈 Next price prediction: ${test_predictions[0]:.2f}")
            print(f"📈 Predicted change: {predicted_change:+.1f}%")
            
            results[symbol] = {
                'accuracy': metrics['accuracy'],
                'mae': metrics['mae'],
                'current_price': current_price,
                'predicted_price': test_predictions[0],
                'predicted_change': predicted_change
            }
            
            print(f"✅ Successfully trained model for {symbol}")
            
        except Exception as e:
            print(f"❌ Failed to train model for {symbol}: {e}")
            import traceback
            traceback.print_exc()
            continue
    
    # Summary
    print(f"\n{'='*60}")
    print("TRAINING SUMMARY")
    print(f"{'='*60}")
    
    for symbol, result in results.items():
        print(f"{symbol.upper():>10}: Accuracy={result['accuracy']:.1%}, "
              f"MAE=${result['mae']:.2f}, "
              f"Prediction={result['predicted_change']:+.1f}%")
    
    print(f"\n✅ Training completed for {len(results)} cryptocurrencies!")
    return results

if __name__ == "__main__":
    print("🚀 Starting ML model training pipeline...")
    train_all_models()