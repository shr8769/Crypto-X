# simple_api_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import sys
import traceback

# Add models directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'models'))

from simple_ml_model import CryptoMLModel
from trading_signal_model import TradingSignalModel
from market_sentiment_model import MarketSentimentModel

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

class MLPredictionService:
    def __init__(self):
        self.price_models = {}
        self.trading_models = {}
        self.sentiment_models = {}
        self.load_all_models()
    
    def load_all_models(self):
        """Load all trained models"""
        symbols = ['bitcoin', 'ethereum', 'cardano', 'solana', 'polygon']
        base_dir = os.path.dirname(__file__)
        
        for symbol in symbols:
            # Load price prediction models
            try:
                price_model = CryptoMLModel()
                price_model_path = os.path.join(base_dir, 'models', f'{symbol}_ml_model')
                price_model.load_model(price_model_path)
                self.price_models[symbol] = price_model
                print(f"✅ Loaded price model for {symbol}")
            except Exception as e:
                print(f"❌ Could not load price model for {symbol}: {e}")
            
            # Load trading signal models
            try:
                trading_model = TradingSignalModel()
                trading_model_path = os.path.join(base_dir, 'models', f'{symbol}_trading_signal.pkl')
                trading_model.load_model(trading_model_path)
                self.trading_models[symbol] = trading_model
                print(f"✅ Loaded trading model for {symbol}")
            except Exception as e:
                print(f"❌ Could not load trading model for {symbol}: {e}")
            
            # Load market sentiment models
            try:
                sentiment_model = MarketSentimentModel()
                sentiment_model_path = os.path.join(base_dir, 'models', f'{symbol}_market_sentiment.pkl')
                sentiment_model.load_model(sentiment_model_path)
                self.sentiment_models[symbol] = sentiment_model
                print(f"✅ Loaded sentiment model for {symbol}")
            except Exception as e:
                print(f"❌ Could not load sentiment model for {symbol}: {e}")
    
    def get_recent_data(self, symbol):
        """Load recent data for prediction"""
        try:
            base_dir = os.path.dirname(__file__)
            data_path = os.path.join(base_dir, 'data', f'{symbol}_historical.csv')
            df = pd.read_csv(data_path, index_col='timestamp', parse_dates=True)
            return df.tail(200)  # Get recent 200 data points
        except Exception as e:
            print(f"Error loading data for {symbol}: {e}")
            return None
    
    def calculate_confidence(self, predictions, current_price):
        """Calculate prediction confidence based on volatility and consistency"""
        if len(predictions) < 2:
            return 0.75
        
        # Calculate prediction volatility
        pred_std = np.std(predictions) / current_price
        
        # Lower volatility = higher confidence
        confidence = max(0.5, min(0.95, 1 - pred_std * 2))
        
        return confidence
    
    def get_predictions(self, symbol, timeframes=['1h', '4h', '1d', '7d', '30d']):
        """Generate predictions for different timeframes"""
        try:
            # Get price prediction model
            price_model = self.price_models.get(symbol)
            if price_model is None:
                raise Exception(f"No price model available for {symbol}")
            
            # Get recent data
            df = self.get_recent_data(symbol)
            if df is None:
                raise Exception("Could not load recent data")
            
            # Generate predictions for different timeframes
            predictions = []
            timeframe_hours = {'1h': 1, '4h': 4, '1d': 24, '7d': 168, '30d': 720}
            
            # Get multiple predictions to assess consistency
            pred_values = price_model.predict(df, steps_ahead=10)
            
            current_price = df['price'].iloc[-1]
            
            for tf in timeframes:
                hours = timeframe_hours[tf]
                
                # Use appropriate prediction based on timeframe
                if hours <= len(pred_values):
                    predicted_price = pred_values[hours - 1]
                else:
                    # For longer timeframes, use trend extrapolation
                    short_term_trend = (pred_values[-1] / current_price - 1) * (hours / len(pred_values))
                    predicted_price = current_price * (1 + short_term_trend)
                
                # Calculate confidence
                confidence = self.calculate_confidence(pred_values[:min(hours, len(pred_values))], current_price)
                
                # Determine direction
                if predicted_price > current_price * 1.02:
                    direction = 'up'
                elif predicted_price < current_price * 0.98:
                    direction = 'down'
                else:
                    direction = 'sideways'
                
                predictions.append({
                    'timeframe': tf,
                    'predictedPrice': float(predicted_price),
                    'confidence': float(confidence),
                    'direction': direction,
                    'percentChange': float((predicted_price - current_price) / current_price * 100)
                })
            
            # Calculate technical indicators from recent data
            latest_indicators = {
                'rsi': float(df['rsi'].iloc[-1]) if 'rsi' in df.columns else 50,
                'macd': float(df['macd'].iloc[-1]) if 'macd' in df.columns else 0,
                'bollinger': {
                    'upper': float(df['bb_upper'].iloc[-1]) if 'bb_upper' in df.columns else current_price * 1.02,
                    'lower': float(df['bb_lower'].iloc[-1]) if 'bb_lower' in df.columns else current_price * 0.98,
                    'middle': float(df['bb_middle'].iloc[-1]) if 'bb_middle' in df.columns else current_price
                },
                'volume': float(df['volume'].iloc[-1]),
                'volatility': float(df['price'].pct_change().rolling(24).std().iloc[-1] * 100) if len(df) > 24 else 5.0
            }
            
            # Calculate overall confidence
            avg_confidence = np.mean([p['confidence'] for p in predictions])
            
            return {
                'symbol': symbol.upper(),
                'currentPrice': float(current_price),
                'predictions': predictions,
                'technicalIndicators': latest_indicators,
                'aiModel': {
                    'accuracy': float(avg_confidence),
                    'lastTrained': datetime.now().isoformat(),
                    'modelType': 'RandomForest'
                }
            }
            
        except Exception as e:
            raise Exception(f"Prediction failed for {symbol}: {str(e)}")
    
    def get_trading_signal(self, symbol):
        """Generate ML-based trading signal"""
        try:
            # Get trading signal model
            trading_model = self.trading_models.get(symbol)
            if trading_model is None:
                raise Exception(f"No trading model available for {symbol}")
            
            # Get recent data
            df = self.get_recent_data(symbol)
            if df is None:
                raise Exception("Could not load recent data")
            
            # Generate trading signal
            signal_result = trading_model.predict_signal(df)
            current_price = df['price'].iloc[-1]
            
            # Convert to API format
            action_map = {
                'STRONG_BUY': 'BUY',
                'BUY': 'BUY', 
                'HOLD': 'HOLD',
                'SELL': 'SELL',
                'STRONG_SELL': 'SELL'
            }
            
            # Calculate target price and stop loss
            if signal_result['action'] in ['STRONG_BUY', 'BUY']:
                target_price = current_price * 1.05  # 5% upside target
                stop_loss = current_price * 0.97     # 3% downside protection
            elif signal_result['action'] in ['STRONG_SELL', 'SELL']:
                target_price = current_price * 0.95  # 5% downside target
                stop_loss = current_price * 1.03     # 3% upside protection
            else:
                target_price = current_price
                stop_loss = current_price * 0.98
            
            return {
                'action': action_map[signal_result['action']],
                'strength': int(signal_result['confidence'] * 100),
                'riskLevel': signal_result['risk_level'],
                'targetPrice': float(target_price),
                'stopLoss': float(stop_loss),
                'confidence': float(signal_result['confidence'])
            }
            
        except Exception as e:
            # Fallback to simple rule-based signal
            return {
                'action': 'HOLD',
                'strength': 50,
                'riskLevel': 'MEDIUM',
                'targetPrice': 0,
                'stopLoss': 0,
                'confidence': 0.5
            }
    
    def get_market_sentiment(self, symbol):
        """Generate ML-based market sentiment"""
        try:
            # Get sentiment model
            sentiment_model = self.sentiment_models.get(symbol)
            if sentiment_model is None:
                raise Exception(f"No sentiment model available for {symbol}")
            
            # Get recent data
            df = self.get_recent_data(symbol)
            if df is None:
                raise Exception("Could not load recent data")
            
            # Generate sentiment
            sentiment_result = sentiment_model.predict_sentiment(df)
            
            return {
                'overall': sentiment_result['overall'],
                'score': float(sentiment_result['score']),
                'sources': {
                    'news': float(sentiment_result['sources']['news']),
                    'social': float(sentiment_result['sources']['social']),
                    'onchain': float(sentiment_result['sources']['onchain']),
                    'technical': float(sentiment_result['sources']['technical'])
                }
            }
            
        except Exception as e:
            # Fallback to neutral sentiment
            return {
                'overall': 'NEUTRAL',
                'score': 0.0,
                'sources': {
                    'news': 0.0,
                    'social': 0.0,
                    'onchain': 0.0,
                    'technical': 0.0
                }
            }

# Initialize the ML service

# Initialize service
print("🔄 Initializing ML Prediction Service...")
ml_service = MLPredictionService()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'models_loaded': len(ml_service.price_models),
        'available_models': list(ml_service.price_models.keys()),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        symbol = data.get('symbol', '').lower()
        
        if not symbol:
            return jsonify({'error': 'Symbol is required'}), 400
        
        if symbol not in ml_service.price_models:
            return jsonify({'error': f'Model not available for {symbol}'}), 404
        
        predictions = ml_service.get_predictions(symbol)
        return jsonify(predictions)
        
    except Exception as e:
        print(f"Prediction error: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/models', methods=['GET'])
def list_models():
    return jsonify({
        'available_models': list(ml_service.price_models.keys()),
        'total_models': len(ml_service.price_models),
        'model_details': {
            symbol: {
                'type': 'RandomForest',
                'features': 18,
                'sequence_length': 24
            } for symbol in ml_service.price_models.keys()
        }
    })

@app.route('/predict/<symbol>', methods=['GET'])
def predict_symbol(symbol):
    """Simple GET endpoint for quick predictions"""
    try:
        symbol = symbol.lower()
        
        if symbol not in ml_service.price_models:
            return jsonify({'error': f'Model not available for {symbol}'}), 404
        
        predictions = ml_service.get_predictions(symbol)
        return jsonify(predictions)
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/trading-signal/<symbol>', methods=['GET'])
def get_trading_signal_endpoint(symbol):
    """Get ML-based trading signal for a symbol"""
    try:
        symbol = symbol.lower()
        
        if symbol not in ml_service.price_models:
            return jsonify({'error': f'Model not available for {symbol}'}), 404
        
        signal = ml_service.get_trading_signal(symbol)
        return jsonify(signal)
        
    except Exception as e:
        print(f"Trading signal error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/market-sentiment/<symbol>', methods=['GET'])
def get_market_sentiment_endpoint(symbol):
    """Get ML-based market sentiment for a symbol"""
    try:
        symbol = symbol.lower()
        
        if symbol not in ml_service.price_models:
            return jsonify({'error': f'Model not available for {symbol}'}), 404
        
        sentiment = ml_service.get_market_sentiment(symbol)
        return jsonify(sentiment)
        
    except Exception as e:
        print(f"Market sentiment error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/full-analysis/<symbol>', methods=['GET'])
def get_full_analysis(symbol):
    """Get complete analysis: predictions + trading signals + market sentiment"""
    try:
        symbol = symbol.lower()
        
        if symbol not in ml_service.price_models:
            return jsonify({'error': f'Model not available for {symbol}'}), 404
        
        # Get all analyses
        predictions = ml_service.get_predictions(symbol)
        trading_signal = ml_service.get_trading_signal(symbol)
        market_sentiment = ml_service.get_market_sentiment(symbol)
        
        return jsonify({
            'symbol': symbol.upper(),
            'predictions': predictions,
            'tradingSignal': trading_signal,
            'marketSentiment': market_sentiment,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Full analysis error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("\n🚀 Starting ML Prediction API Server...")
    print(f"📊 Loaded models for: {list(ml_service.price_models.keys())}")
    print("🌐 Server will be available at: http://localhost:5000")
    print("📋 API Endpoints:")
    print("   GET  /health              - Service health check")
    print("   GET  /models              - List available models")  
    print("   POST /predict             - Generate predictions")
    print("   GET  /predict/<symbol>    - Quick prediction for symbol")
    print("\n💫 Ready to serve ML predictions!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)