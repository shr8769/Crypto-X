# crypto-ml-service/data_collector.py
import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import time

class CryptoDataCollector:
    def __init__(self):
        self.coingecko_base = "https://api.coingecko.com/api/v3"
        self.cryptocompare_base = "https://min-api.cryptocompare.com/data/v2"
    
    def get_historical_data(self, symbol, days=365):
        """Collect historical price data for training"""
        try:
            # CoinGecko historical data
            url = f"{self.coingecko_base}/coins/{symbol}/market_chart"
            params = {
                'vs_currency': 'usd',
                'days': days,
                'interval': 'hourly'
            }
            
            print(f"Fetching from: {url}")
            response = requests.get(url, params=params)
            
            if response.status_code != 200:
                print(f"API Error: Status {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
            data = response.json()
            print(f"API Response keys: {data.keys()}")
            
            # Check if required data exists
            if 'prices' not in data or 'total_volumes' not in data:
                print(f"Missing data in response: {data}")
                return None
            
            # Convert to DataFrame
            prices = pd.DataFrame(data['prices'], columns=['timestamp', 'price'])
            volumes = pd.DataFrame(data['total_volumes'], columns=['timestamp', 'volume'])
            
            print(f"Collected {len(prices)} price points")
            
            # Merge data
            df = pd.merge(prices, volumes, on='timestamp')
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            df.set_index('timestamp', inplace=True)
            
            return df
            
        except Exception as e:
            print(f"Error collecting data for {symbol}: {e}")
            import traceback
            traceback.print_exc()
            return None
    
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

# Usage example
if __name__ == "__main__":
    collector = CryptoDataCollector()
    
    # Collect data for major cryptos
    symbols = ['bitcoin', 'ethereum', 'cardano', 'solana', 'polygon']
    
    for symbol in symbols:
        print(f"Collecting data for {symbol}...")
        df = collector.get_historical_data(symbol, days=730)  # 2 years
        
        if df is not None:
            df = collector.add_technical_indicators(df)
            df.to_csv(f'data/{symbol}_historical.csv')
            print(f"Saved {len(df)} records for {symbol}")
        
        time.sleep(1)  # Rate limiting