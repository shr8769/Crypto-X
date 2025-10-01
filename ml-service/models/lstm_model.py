# crypto-ml-service/models/lstm_model.py
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import pandas as pd
import joblib

class CryptoLSTMModel:
    def __init__(self, sequence_length=60):
        self.sequence_length = sequence_length
        self.model = None
        self.scaler = MinMaxScaler()
        
    def prepare_data(self, df, target_column='price'):
        """Prepare data for LSTM training"""
        # Scale the data
        scaled_data = self.scaler.fit_transform(df[[target_column]])
        
        # Create sequences
        X, y = [], []
        for i in range(self.sequence_length, len(scaled_data)):
            X.append(scaled_data[i-self.sequence_length:i, 0])
            y.append(scaled_data[i, 0])
        
        return np.array(X), np.array(y)
    
    def build_model(self, input_shape):
        """Build LSTM model architecture"""
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(50, return_sequences=True),
            Dropout(0.2),
            LSTM(50),
            Dropout(0.2),
            Dense(1)
        ])
        
        model.compile(optimizer='adam', loss='mean_squared_error')
        self.model = model
        return model
    
    def train(self, df, epochs=50, batch_size=32):
        """Train the LSTM model"""
        X, y = self.prepare_data(df)
        
        # Reshape for LSTM
        X = X.reshape((X.shape[0], X.shape[1], 1))
        
        # Split data
        split = int(0.8 * len(X))
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]
        
        # Build model
        if self.model is None:
            self.build_model((X.shape[1], 1))
        
        # Train model
        history = self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_data=(X_test, y_test),
            verbose=1
        )
        
        return history
    
    def predict(self, recent_data, steps_ahead=1):
        """Make predictions"""
        if len(recent_data) < self.sequence_length:
            raise ValueError(f"Need at least {self.sequence_length} data points")
        
        # Scale the input data
        scaled_data = self.scaler.transform(recent_data[['price']])
        
        # Take last sequence_length points
        last_sequence = scaled_data[-self.sequence_length:]
        last_sequence = last_sequence.reshape((1, self.sequence_length, 1))
        
        predictions = []
        current_sequence = last_sequence.copy()
        
        for _ in range(steps_ahead):
            # Predict next value
            next_pred = self.model.predict(current_sequence, verbose=0)
            predictions.append(next_pred[0, 0])
            
            # Update sequence for next prediction
            current_sequence = np.roll(current_sequence, -1, axis=1)
            current_sequence[0, -1, 0] = next_pred[0, 0]
        
        # Inverse transform predictions
        predictions = np.array(predictions).reshape(-1, 1)
        predictions = self.scaler.inverse_transform(predictions)
        
        return predictions.flatten()
    
    def save_model(self, filepath):
        """Save the trained model"""
        if self.model:
            self.model.save(f"{filepath}_model.h5")
            joblib.dump(self.scaler, f"{filepath}_scaler.pkl")
    
    def load_model(self, filepath):
        """Load a trained model"""
        self.model = tf.keras.models.load_model(f"{filepath}_model.h5")
        self.scaler = joblib.load(f"{filepath}_scaler.pkl")

# Training script
if __name__ == "__main__":
    # Load data
    df = pd.read_csv('data/bitcoin_historical.csv', index_col='timestamp', parse_dates=True)
    
    # Initialize and train model
    lstm_model = CryptoLSTMModel(sequence_length=60)
    
    print("Training LSTM model...")
    history = lstm_model.train(df, epochs=100)
    
    # Save model
    lstm_model.save_model('models/bitcoin_lstm')
    print("Model saved successfully!")
    
    # Test prediction
    recent_data = df.tail(100)
    predictions = lstm_model.predict(recent_data, steps_ahead=5)
    print(f"Next 5 predictions: {predictions}")