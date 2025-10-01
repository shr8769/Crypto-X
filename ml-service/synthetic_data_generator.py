# synthetic_data_generator.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

class SyntheticCryptoData:
    def __init__(self):
        self.crypto_configs = {
            'bitcoin': {'base_price': 42000, 'volatility': 0.05, 'trend': 0.0002},
            'ethereum': {'base_price': 2800, 'volatility': 0.06, 'trend': 0.0003},
            'cardano': {'base_price': 0.45, 'volatility': 0.08, 'trend': 0.0001},
            'solana': {'base_price': 85, 'volatility': 0.12, 'trend': 0.0004},
            'polygon': {'base_price': 0.75, 'volatility': 0.07, 'trend': 0.0002}
        }
    
    def generate_realistic_data(self, symbol, days=730, hours_per_day=24):
        """Generate realistic synthetic crypto data"""
        config = self.crypto_configs[symbol]
        base_price = config['base_price']
        volatility = config['volatility']
        trend = config['trend']
        
        total_hours = days * hours_per_day
        timestamps = []
        prices = []
        volumes = []
        
        # Start from days ago
        start_time = datetime.now() - timedelta(days=days)
        
        # Initialize price
        current_price = base_price
        
        for i in range(total_hours):
            # Generate timestamp
            timestamp = start_time + timedelta(hours=i)
            timestamps.append(timestamp)
            
            # Generate price with trend and volatility
            # Add daily cycle (higher volatility during certain hours)
            hour_factor = 1 + 0.2 * np.sin(2 * np.pi * (i % 24) / 24)
            
            # Add weekly cycle (lower activity on weekends)
            day_of_week = (i // 24) % 7
            weekly_factor = 0.8 if day_of_week in [5, 6] else 1.0
            
            # Generate price change
            trend_change = trend * hour_factor
            random_change = np.random.normal(0, volatility * hour_factor * weekly_factor)
            
            # Apply mean reversion (prices tend to revert to base over time)
            reversion_factor = 0.001 * (base_price - current_price) / base_price
            
            price_change = trend_change + random_change + reversion_factor
            current_price *= (1 + price_change)
            
            # Ensure price doesn't go negative
            current_price = max(current_price, base_price * 0.1)
            
            prices.append(current_price)
            
            # Generate volume (correlated with price volatility)
            base_volume = np.random.exponential(1000000)  # Base volume
            volatility_volume = abs(price_change) * 10000000  # Higher volume during big moves
            volume = base_volume + volatility_volume
            volumes.append(volume)
        
        # Create DataFrame
        df = pd.DataFrame({
            'timestamp': timestamps,
            'price': prices,
            'volume': volumes
        })
        
        df.set_index('timestamp', inplace=True)
        return df
    
    def add_technical_indicators(self, df):
        """Add technical indicators to the dataset"""
        # Moving averages
        df['ma_7'] = df['price'].rolling(window=7).mean()
        df['ma_25'] = df['price'].rolling(window=25).mean()
        df['ma_50'] = df['price'].rolling(window=50).mean()
        
        # RSI
        delta = df['price'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['rsi'] = 100 - (100 / (1 + rs))
        
        # MACD
        exp1 = df['price'].ewm(span=12).mean()
        exp2 = df['price'].ewm(span=26).mean()
        df['macd'] = exp1 - exp2
        df['macd_signal'] = df['macd'].ewm(span=9).mean()
        
        # Bollinger Bands
        df['bb_middle'] = df['price'].rolling(window=20).mean()
        bb_std = df['price'].rolling(window=20).std()
        df['bb_upper'] = df['bb_middle'] + (bb_std * 2)
        df['bb_lower'] = df['bb_middle'] - (bb_std * 2)
        
        # Volume indicators
        df['volume_ma'] = df['volume'].rolling(window=10).mean()
        df['volume_ratio'] = df['volume'] / df['volume_ma']
        
        return df.dropna()

if __name__ == "__main__":
    print("🚀 Generating synthetic crypto training data...")
    
    # Create directories
    os.makedirs('data', exist_ok=True)
    
    # Initialize generator
    generator = SyntheticCryptoData()
    
    # Generate data for all cryptocurrencies
    for symbol in generator.crypto_configs.keys():
        print(f"\n📊 Generating data for {symbol.upper()}...")
        
        # Generate 2 years of hourly data
        df = generator.generate_realistic_data(symbol, days=730)
        print(f"Generated {len(df)} data points")
        
        # Add technical indicators
        df = generator.add_technical_indicators(df)
        print(f"Added technical indicators, final dataset: {len(df)} points")
        
        # Save to CSV
        filepath = f'data/{symbol}_historical.csv'
        df.to_csv(filepath)
        print(f"💾 Saved to {filepath}")
        
        # Show sample data
        print(f"Price range: ${df['price'].min():.2f} - ${df['price'].max():.2f}")
        print(f"Latest price: ${df['price'].iloc[-1]:.2f}")
    
    print(f"\n✅ Successfully generated training data for all cryptocurrencies!")
    print("📁 Data saved in the 'data' directory")