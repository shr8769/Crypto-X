# models/simple_ml_model.py
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import joblib
import warnings
warnings.filterwarnings('ignore')

class CryptoMLModel:
    def __init__(self, model_type='random_forest', sequence_length=60):
        self.sequence_length = sequence_length
        self.model = None
        self.scaler = StandardScaler()
        self.feature_scaler = StandardScaler()
        self.model_type = model_type
        
        # Initialize model based on type
        if model_type == 'random_forest':
            self.model = RandomForestRegressor(
                n_estimators=100, 
                max_depth=10, 
                random_state=42,
                n_jobs=-1
            )
        elif model_type == 'gradient_boost':
            self.model = GradientBoostingRegressor(
                n_estimators=100,
                max_depth=6,
                random_state=42
            )
        else:
            self.model = LinearRegression()
    
    def create_features(self, df):
        """Create features from price data"""
        features = pd.DataFrame(index=df.index)
        
        # Price-based features
        features['price'] = df['price']
        features['price_ma_7'] = df['ma_7']
        features['price_ma_25'] = df['ma_25']
        features['price_ma_50'] = df['ma_50']
        
        # Technical indicators
        features['rsi'] = df['rsi']
        features['macd'] = df['macd']
        features['macd_signal'] = df['macd_signal']
        features['bb_position'] = (df['price'] - df['bb_lower']) / (df['bb_upper'] - df['bb_lower'])
        
        # Volume features
        features['volume'] = np.log1p(df['volume'])  # Log transform volume
        features['volume_ratio'] = df['volume_ratio']
        
        # Price momentum features
        features['price_change_1h'] = df['price'].pct_change(1)
        features['price_change_4h'] = df['price'].pct_change(4)
        features['price_change_24h'] = df['price'].pct_change(24)
        
        # Volatility features
        features['volatility_24h'] = df['price'].rolling(24).std()
        features['volatility_168h'] = df['price'].rolling(168).std()  # Weekly volatility
        
        # Time-based features
        features['hour'] = df.index.hour
        features['day_of_week'] = df.index.dayofweek
        features['day_of_month'] = df.index.day
        
        return features.dropna()
    
    def create_sequences(self, features, target_col='price'):
        """Create sequences for time series prediction"""
        X, y = [], []
        
        feature_cols = [col for col in features.columns if col != target_col]
        
        for i in range(self.sequence_length, len(features)):
            # Use features from the last sequence_length time steps
            sequence_features = features[feature_cols].iloc[i-self.sequence_length:i].values
            
            # Flatten the sequence
            X.append(sequence_features.flatten())
            
            # Target is the next price
            y.append(features[target_col].iloc[i])
        
        return np.array(X), np.array(y)
    
    def train(self, df, test_size=0.2):
        """Train the model"""
        print(f"Creating features from {len(df)} data points...")
        
        # Create features
        features = self.create_features(df)
        print(f"Created {len(features)} feature rows with {len(features.columns)} features")
        
        # Create sequences
        X, y = self.create_sequences(features)
        print(f"Created {len(X)} sequences of length {self.sequence_length}")
        
        # Split data
        split_idx = int(len(X) * (1 - test_size))
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]
        
        # Scale features
        X_train_scaled = self.feature_scaler.fit_transform(X_train)
        X_test_scaled = self.feature_scaler.transform(X_test)
        
        # Scale target
        y_train_scaled = self.scaler.fit_transform(y_train.reshape(-1, 1)).flatten()
        
        print(f"Training {self.model_type} model...")
        
        # Train model
        self.model.fit(X_train_scaled, y_train_scaled)
        
        # Make predictions for evaluation
        y_pred_scaled = self.model.predict(X_test_scaled)
        y_pred = self.scaler.inverse_transform(y_pred_scaled.reshape(-1, 1)).flatten()
        
        # Calculate metrics
        mse = mean_squared_error(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        
        # Calculate accuracy (percentage of predictions within 5% of actual)
        accuracy = np.mean(np.abs(y_pred - y_test) / y_test < 0.05)
        
        print(f"Model trained successfully!")
        print(f"MSE: {mse:.2f}")
        print(f"MAE: {mae:.2f}")
        print(f"Accuracy (within 5%): {accuracy:.1%}")
        
        return {
            'mse': mse,
            'mae': mae,
            'accuracy': accuracy,
            'train_size': len(X_train),
            'test_size': len(X_test)
        }
    
    def predict(self, df, steps_ahead=1):
        """Make predictions"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        
        # Create features
        features = self.create_features(df)
        
        if len(features) < self.sequence_length:
            raise ValueError(f"Need at least {self.sequence_length} data points")
        
        predictions = []
        current_features = features.copy()
        
        for step in range(steps_ahead):
            # Get the last sequence
            feature_cols = [col for col in current_features.columns if col != 'price']
            last_sequence = current_features[feature_cols].tail(self.sequence_length).values.flatten()
            
            # Scale features
            last_sequence_scaled = self.feature_scaler.transform([last_sequence])
            
            # Make prediction
            pred_scaled = self.model.predict(last_sequence_scaled)
            pred_price = self.scaler.inverse_transform(pred_scaled.reshape(-1, 1))[0, 0]
            
            predictions.append(pred_price)
            
            # For multi-step prediction, we'd need to update features
            # For now, we'll just use the same feature pattern
            if step < steps_ahead - 1:
                # This is simplified - in practice you'd update all features
                current_features = current_features.copy()
        
        return np.array(predictions)
    
    def save_model(self, filepath):
        """Save the trained model"""
        if self.model:
            joblib.dump({
                'model': self.model,
                'scaler': self.scaler,
                'feature_scaler': self.feature_scaler,
                'sequence_length': self.sequence_length,
                'model_type': self.model_type
            }, f"{filepath}.pkl")
    
    def load_model(self, filepath):
        """Load a trained model"""
        data = joblib.load(f"{filepath}.pkl")
        self.model = data['model']
        self.scaler = data['scaler']
        self.feature_scaler = data['feature_scaler']
        self.sequence_length = data['sequence_length']
        self.model_type = data['model_type']

# Training script
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python simple_ml_model.py <crypto_symbol>")
        sys.exit(1)
    
    symbol = sys.argv[1]
    
    # Load data
    try:
        df = pd.read_csv(f'../data/{symbol}_historical.csv', index_col='timestamp', parse_dates=True)
        print(f"Loaded {len(df)} data points for {symbol}")
    except FileNotFoundError:
        print(f"Data file not found for {symbol}")
        sys.exit(1)
    
    # Initialize and train model
    model = CryptoMLModel(model_type='random_forest', sequence_length=24)  # 24 hours
    
    print(f"Training model for {symbol}...")
    metrics = model.train(df)
    
    # Save model
    model.save_model(f'{symbol}_ml_model')
    print(f"Model saved successfully!")
    
    # Test prediction
    recent_data = df.tail(100)
    predictions = model.predict(recent_data, steps_ahead=5)
    print(f"Next 5 predictions: {predictions}")
    print(f"Current price: {df['price'].iloc[-1]:.2f}")
    print(f"Predicted change: {((predictions[0] / df['price'].iloc[-1]) - 1) * 100:.1f}%")