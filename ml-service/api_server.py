# crypto-ml-service/api_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys
import os

# Add models directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'models'))

from lstm_model import CryptoLSTMModel
from data_collector import CryptoDataCollector

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

class MLPredictionService:
    def __init__(self):
        self.models = {}
        self.data_collector = CryptoDataCollector()
        self.load_all_models()
    
    def load_all_models(self):
        """Load all trained models"""
        symbols = ['bitcoin', 'ethereum', 'cardano', 'solana']
        
        for symbol in symbols:
            try:
                model = CryptoLSTMModel()
                model.load_model(f'models/{symbol}_lstm')
                self.models[symbol] = model
                print(f"Loaded model for {symbol}")
            except Exception as e:
                print(f"Could not load model for {symbol}: {e}")
    
    def get_predictions(self, symbol, timeframes=['1h', '4h', '1d', '7d', '30d']):
        """Generate predictions for different timeframes"""
        try:
            # Get recent data
            df = self.data_collector.get_historical_data(symbol, days=90)
            if df is None:
                raise Exception("Could not fetch recent data")
            
            df = self.data_collector.add_technical_indicators(df)
            
            # Get model
            model = self.models.get(symbol)
            if model is None:
                raise Exception(f"No model available for {symbol}")
            
            # Generate predictions
            predictions = []
            timeframe_hours = {'1h': 1, '4h': 4, '1d': 24, '7d': 168, '30d': 720}
            
            for tf in timeframes:
                hours = timeframe_hours[tf]
                pred_values = model.predict(df, steps_ahead=hours)
                
                # Calculate confidence based on model accuracy
                confidence = self.calculate_confidence(df, model, hours)
                
                # Determine direction
                current_price = df['price'].iloc[-1]
                predicted_price = pred_values[-1]
                direction = 'up' if predicted_price > current_price else 'down'
                if abs(predicted_price - current_price) / current_price < 0.02:
                    direction = 'sideways'
                
                predictions.append({
                    'timeframe': tf,
                    'predictedPrice': float(predicted_price),
                    'confidence': float(confidence),
                    'direction': direction,
                    'percentChange': float((predicted_price - current_price) / current_price * 100)
                })
            
            # Get technical indicators
            latest_indicators = {
                'rsi': float(df['rsi'].iloc[-1]),
                'macd': float(df['macd'].iloc[-1]),
                'bollinger': {
                    'upper': float(df['bb_upper'].iloc[-1]),
                    'lower': float(df['bb_lower'].iloc[-1]),
                    'middle': float(df['bb_middle'].iloc[-1])
                },
                'volume': float(df['volume'].iloc[-1]),
                'volatility': float(df['price'].pct_change().rolling(20).std().iloc[-1] * 100)
            }
            
            return {
                'symbol': symbol.upper(),
                'currentPrice': float(df['price'].iloc[-1]),
                'predictions': predictions,
                'technicalIndicators': latest_indicators,
                'aiModel': {
                    'accuracy': float(confidence),
                    'lastTrained': datetime.now().isoformat(),
                    'modelType': 'LSTM'
                }
            }
            
        except Exception as e:
            raise Exception(f"Prediction failed: {str(e)}")
    
    def calculate_confidence(self, df, model, hours):
        """Calculate prediction confidence based on historical accuracy"""
        try:
            # Use recent data to test model accuracy
            test_data = df.tail(100)
            actual_prices = test_data['price'].values
            
            # Make predictions on historical data
            predictions = model.predict(test_data.head(80), steps_ahead=min(hours, 20))
            actual_future = actual_prices[-len(predictions):]
            
            # Calculate accuracy
            errors = np.abs(predictions - actual_future) / actual_future
            accuracy = 1 - np.mean(errors)
            
            return max(0.5, min(0.95, accuracy))  # Clamp between 50-95%
            
        except:
            return 0.75  # Default confidence

# Initialize service
ml_service = MLPredictionService()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'models_loaded': len(ml_service.models)})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        symbol = data.get('symbol', '').lower()
        
        if not symbol:
            return jsonify({'error': 'Symbol is required'}), 400
        
        if symbol not in ml_service.models:
            return jsonify({'error': f'Model not available for {symbol}'}), 404
        
        predictions = ml_service.get_predictions(symbol)
        return jsonify(predictions)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/models', methods=['GET'])
def list_models():
    return jsonify({
        'available_models': list(ml_service.models.keys()),
        'total_models': len(ml_service.models)
    })

if __name__ == '__main__':
    print("Starting ML Prediction API Server...")
    print(f"Loaded models: {list(ml_service.models.keys())}")
    app.run(debug=True, host='0.0.0.0', port=5000)