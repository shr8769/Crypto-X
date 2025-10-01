# market_sentiment_model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import pickle

class MarketSentimentModel:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=150,
            max_depth=8,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.feature_columns = []
        
    def create_sentiment_features(self, df):
        """Create features for market sentiment prediction"""
        features = pd.DataFrame(index=df.index)
        
        # Price momentum features (key sentiment drivers)
        features['price_change_1h'] = df['price'].pct_change(1)
        features['price_change_4h'] = df['price'].pct_change(4)
        features['price_change_24h'] = df['price'].pct_change(24)
        features['price_change_7d'] = df['price'].pct_change(168)  # 7 days
        
        # Volatility features (fear/greed indicators)
        features['volatility_short'] = df['price'].rolling(12).std() / df['price'].rolling(12).mean()
        features['volatility_medium'] = df['price'].rolling(48).std() / df['price'].rolling(48).mean()
        features['volatility_ratio'] = features['volatility_short'] / features['volatility_medium']
        
        # Volume sentiment indicators
        features['volume'] = np.log1p(df['volume'])
        features['volume_change'] = df['volume'].pct_change(24)
        features['volume_momentum'] = df['volume'].rolling(24).mean() / df['volume'].rolling(168).mean()
        
        # Technical sentiment indicators
        features['rsi'] = df['rsi']
        features['rsi_momentum'] = df['rsi'].diff(1)
        features['rsi_divergence'] = (df['rsi'].diff(1) * features['price_change_1h']) < 0
        
        # MACD sentiment
        features['macd'] = df['macd']
        features['macd_signal'] = df['macd_signal']
        features['macd_histogram'] = df['macd'] - df['macd_signal']
        features['macd_crossover'] = (df['macd'] > df['macd_signal']).astype(int)
        
        # Bollinger Bands sentiment
        features['bb_position'] = (df['price'] - df['bb_lower']) / (df['bb_upper'] - df['bb_lower'])
        features['bb_squeeze'] = (df['bb_upper'] - df['bb_lower']) / df['price']
        features['bb_breakout'] = ((df['price'] > df['bb_upper']) | (df['price'] < df['bb_lower'])).astype(int)
        
        # Trend strength indicators
        features['sma_12'] = df['price'].rolling(12).mean()
        features['sma_48'] = df['price'].rolling(48).mean()
        features['trend_alignment'] = (df['price'] > features['sma_12']) & (features['sma_12'] > features['sma_48'])
        features['trend_strength'] = abs(features['sma_12'] - features['sma_48']) / df['price']
        
        # Market structure sentiment
        features['higher_highs'] = (df['price'].rolling(24).max().diff(1) > 0).astype(int)
        features['higher_lows'] = (df['price'].rolling(24).min().diff(1) > 0).astype(int)
        features['market_structure'] = features['higher_highs'] + features['higher_lows']  # 0-2 scale
        
        # Fear & Greed proxies
        features['extreme_rsi'] = ((df['rsi'] < 20) | (df['rsi'] > 80)).astype(int)
        features['volume_spike'] = (df['volume'] > df['volume'].rolling(168).mean() * 2).astype(int)
        features['price_spike'] = (abs(features['price_change_1h']) > 0.05).astype(int)
        
        # Time-based sentiment patterns
        features['hour'] = df.index.hour
        features['day_of_week'] = df.index.dayofweek
        features['is_weekend'] = (df.index.dayofweek >= 5).astype(int)
        features['is_market_hours'] = ((df.index.hour >= 9) & (df.index.hour <= 16)).astype(int)
        
        return features.dropna()
    
    def create_sentiment_labels(self, df):
        """Create sentiment labels based on multiple market factors"""
        sentiment_scores = []
        
        for i in range(len(df)):
            score = 0
            
            # Price momentum contribution (40% weight)
            price_1h = df['price'].pct_change(1).iloc[i] if i > 0 else 0
            price_24h = df['price'].pct_change(24).iloc[i] if i > 23 else 0
            momentum_score = (price_1h * 100 + price_24h * 20) * 0.4
            
            # Technical indicators contribution (30% weight)
            rsi = df['rsi'].iloc[i] if i < len(df) else 50
            rsi_score = (rsi - 50) / 50 * 30  # -30 to +30
            
            macd = df['macd'].iloc[i] if i < len(df) else 0
            macd_signal = df['macd_signal'].iloc[i] if i < len(df) else 0
            macd_score = np.sign(macd - macd_signal) * min(abs(macd - macd_signal) * 1000, 20)
            
            technical_score = (rsi_score + macd_score) * 0.3
            
            # Volume contribution (20% weight)
            if i > 23:
                volume_avg = df['volume'].iloc[i-24:i].mean()
                current_volume = df['volume'].iloc[i]
                volume_score = min((current_volume / volume_avg - 1) * 50, 30) * 0.2
            else:
                volume_score = 0
            
            # Volatility contribution (10% weight) - inverse relationship
            if i > 11:
                volatility = df['price'].iloc[i-12:i].std() / df['price'].iloc[i-12:i].mean()
                volatility_score = -min(volatility * 200, 40) * 0.1  # High volatility = negative sentiment
            else:
                volatility_score = 0
            
            # Combine all factors
            total_score = momentum_score + technical_score + volume_score + volatility_score
            
            # Normalize to -100 to +100 range
            sentiment_scores.append(np.clip(total_score, -100, 100))
        
        return np.array(sentiment_scores)
    
    def train(self, df, test_size=0.2):
        """Train the market sentiment model"""
        print("🔄 Creating sentiment features...")
        features = self.create_sentiment_features(df)
        
        print("🔄 Creating sentiment labels...")
        labels = self.create_sentiment_labels(df)
        
        # Align features and labels
        min_length = min(len(features), len(labels))
        features = features.iloc[:min_length]
        labels = labels[:min_length]
        
        # Store feature columns
        self.feature_columns = features.columns.tolist()
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            features, labels, test_size=test_size, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        print("🔄 Training market sentiment model...")
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"✅ Market sentiment model trained!")
        print(f"📊 R² Score: {r2:.3f}")
        print(f"📊 RMSE: {np.sqrt(mse):.2f}")
        print(f"📊 Feature importance (top 5):")
        
        # Feature importance
        importances = self.model.feature_importances_
        feature_importance = sorted(zip(features.columns, importances), 
                                  key=lambda x: x[1], reverse=True)
        
        for i, (feature, importance) in enumerate(feature_importance[:5]):
            print(f"   {i+1}. {feature}: {importance:.3f}")
        
        return {
            'r2_score': r2,
            'rmse': np.sqrt(mse),
            'train_size': len(X_train),
            'test_size': len(X_test)
        }
    
    def predict_sentiment(self, df):
        """Predict market sentiment for current conditions"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        
        features = self.create_sentiment_features(df)
        
        # Use the last row for prediction
        latest_features = features.iloc[-1:][self.feature_columns]
        latest_scaled = self.scaler.transform(latest_features)
        
        # Get prediction
        sentiment_score = self.model.predict(latest_scaled)[0]
        
        # Classify sentiment
        if sentiment_score > 20:
            overall = 'BULLISH'
        elif sentiment_score < -20:
            overall = 'BEARISH'
        else:
            overall = 'NEUTRAL'
        
        # Generate component scores (simulated breakdown)
        news_score = sentiment_score * (0.8 + np.random.normal(0, 0.2))
        social_score = sentiment_score * (0.9 + np.random.normal(0, 0.15))
        onchain_score = sentiment_score * (1.1 + np.random.normal(0, 0.1))
        technical_score = sentiment_score * (1.0 + np.random.normal(0, 0.05))
        
        # Normalize component scores
        news_score = np.clip(news_score, -100, 100)
        social_score = np.clip(social_score, -100, 100)
        onchain_score = np.clip(onchain_score, -100, 100)
        technical_score = np.clip(technical_score, -100, 100)
        
        return {
            'overall': overall,
            'score': sentiment_score,
            'sources': {
                'news': news_score,
                'social': social_score,
                'onchain': onchain_score,
                'technical': technical_score
            }
        }
    
    def save_model(self, filepath):
        """Save the trained model"""
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'feature_columns': self.feature_columns
        }
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        print(f"✅ Market sentiment model saved to {filepath}")
    
    def load_model(self, filepath):
        """Load a trained model"""
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.feature_columns = model_data['feature_columns']
        print(f"✅ Market sentiment model loaded from {filepath}")