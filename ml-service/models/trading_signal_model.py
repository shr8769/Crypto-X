# trading_signal_model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import pickle
import os
from datetime import datetime, timedelta

class TradingSignalModel:
    def __init__(self):
        self.model = GradientBoostingClassifier(
            n_estimators=200,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.feature_columns = []
        
    def create_trading_features(self, df):
        """Create comprehensive features for trading signal prediction"""
        features = pd.DataFrame(index=df.index)
        
        # Price-based features
        features['price'] = df['price']
        features['price_sma_12'] = df['price'].rolling(12).mean()
        features['price_sma_26'] = df['price'].rolling(26).mean()
        features['price_ema_12'] = df['price'].ewm(span=12).mean()
        features['price_ema_26'] = df['price'].ewm(span=26).mean()
        
        # Technical indicators
        features['rsi'] = df['rsi']
        features['macd'] = df['macd']
        features['macd_signal'] = df['macd_signal']
        features['macd_histogram'] = df['macd'] - df['macd_signal']
        
        # Bollinger Bands
        features['bb_upper'] = df['bb_upper']
        features['bb_lower'] = df['bb_lower']
        features['bb_position'] = (df['price'] - df['bb_lower']) / (df['bb_upper'] - df['bb_lower'])
        features['bb_squeeze'] = (df['bb_upper'] - df['bb_lower']) / df['price']
        
        # Volume analysis
        features['volume'] = np.log1p(df['volume'])
        features['volume_sma'] = df['volume'].rolling(20).mean()
        features['volume_ratio'] = df['volume'] / features['volume_sma']
        
        # Volatility features
        features['volatility_5'] = df['price'].rolling(5).std() / df['price'].rolling(5).mean()
        features['volatility_20'] = df['price'].rolling(20).std() / df['price'].rolling(20).mean()
        
        # Momentum features
        features['momentum_5'] = df['price'].pct_change(5)
        features['momentum_10'] = df['price'].pct_change(10)
        features['momentum_20'] = df['price'].pct_change(20)
        
        # Support/Resistance levels
        features['support_level'] = df['price'].rolling(20).min()
        features['resistance_level'] = df['price'].rolling(20).max()
        features['support_distance'] = (df['price'] - features['support_level']) / df['price']
        features['resistance_distance'] = (features['resistance_level'] - df['price']) / df['price']
        
        # Market microstructure
        features['price_acceleration'] = features['momentum_5'] - features['momentum_10']
        features['trend_strength'] = abs(features['price_ema_12'] - features['price_ema_26']) / df['price']
        
        # Time-based features
        features['hour'] = df.index.hour
        features['day_of_week'] = df.index.dayofweek
        features['is_weekend'] = (df.index.dayofweek >= 5).astype(int)
        
        return features.dropna()
    
    def create_trading_labels(self, df, future_periods=4):
        """Create trading signal labels based on future price movements"""
        labels = []
        
        for i in range(len(df) - future_periods):
            current_price = df['price'].iloc[i]
            future_prices = df['price'].iloc[i+1:i+future_periods+1]
            
            max_future_price = future_prices.max()
            min_future_price = future_prices.min()
            
            # Calculate potential profit/loss
            max_gain = (max_future_price - current_price) / current_price
            max_loss = (min_future_price - current_price) / current_price
            
            # Define trading signals based on risk-reward ratio
            if max_gain > 0.03 and abs(max_loss) < 0.02:  # Good risk-reward for BUY
                labels.append(2)  # Strong BUY
            elif max_gain > 0.015 and abs(max_loss) < 0.015:  # Moderate BUY
                labels.append(1)  # BUY
            elif max_loss < -0.03 and max_gain < 0.02:  # Good risk-reward for SELL
                labels.append(-2)  # Strong SELL
            elif max_loss < -0.015 and max_gain < 0.015:  # Moderate SELL
                labels.append(-1)  # SELL
            else:
                labels.append(0)  # HOLD
        
        # Pad with neutral signals for the last few periods
        labels.extend([0] * future_periods)
        
        return np.array(labels)
    
    def train(self, df, test_size=0.2):
        """Train the trading signal model"""
        print("🔄 Creating trading features...")
        features = self.create_trading_features(df)
        
        print("🔄 Creating trading labels...")
        labels = self.create_trading_labels(df)
        
        # Align features and labels
        min_length = min(len(features), len(labels))
        features = features.iloc[:min_length]
        labels = labels[:min_length]
        
        # Store feature columns
        self.feature_columns = features.columns.tolist()
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            features, labels, test_size=test_size, random_state=42, stratify=labels
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        print("🔄 Training trading signal model...")
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"✅ Trading signal model trained!")
        print(f"📊 Accuracy: {accuracy:.1%}")
        print(f"📊 Feature importance (top 5):")
        
        # Feature importance
        importances = self.model.feature_importances_
        feature_importance = sorted(zip(features.columns, importances), 
                                  key=lambda x: x[1], reverse=True)
        
        for i, (feature, importance) in enumerate(feature_importance[:5]):
            print(f"   {i+1}. {feature}: {importance:.3f}")
        
        return {
            'accuracy': accuracy,
            'train_size': len(X_train),
            'test_size': len(X_test),
            'signal_distribution': dict(zip(*np.unique(labels, return_counts=True)))
        }
    
    def predict_signal(self, df):
        """Generate trading signal for current market conditions"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        
        features = self.create_trading_features(df)
        
        # Use the last row for prediction
        latest_features = features.iloc[-1:][self.feature_columns]
        latest_scaled = self.scaler.transform(latest_features)
        
        # Get prediction and probability
        signal = self.model.predict(latest_scaled)[0]
        probabilities = self.model.predict_proba(latest_scaled)[0]
        
        # Convert to trading recommendation
        signal_map = {-2: 'STRONG_SELL', -1: 'SELL', 0: 'HOLD', 1: 'BUY', 2: 'STRONG_BUY'}
        action = signal_map[signal]
        
        # Calculate confidence (max probability)
        confidence = max(probabilities)
        
        # Risk assessment based on volatility
        current_volatility = features['volatility_20'].iloc[-1]
        if current_volatility > 0.05:
            risk_level = 'HIGH'
        elif current_volatility > 0.025:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'LOW'
        
        return {
            'action': action,
            'signal_value': signal,
            'confidence': confidence,
            'risk_level': risk_level,
            'probabilities': dict(zip(signal_map.values(), probabilities))
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
        print(f"✅ Trading signal model saved to {filepath}")
    
    def load_model(self, filepath):
        """Load a trained model"""
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.feature_columns = model_data['feature_columns']
        print(f"✅ Trading signal model loaded from {filepath}")