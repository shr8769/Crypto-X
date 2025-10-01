# test_server.py - Simple test Flask API server
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'message': 'Test ML API server is running'
    })

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    symbol = data.get('symbol', 'bitcoin')
    
    # Return mock prediction data
    return jsonify({
        'symbol': symbol,
        'predictions': [
            {'timeframe': '1h', 'direction': 'up', 'confidence': 0.75, 'price_change': 2.5},
            {'timeframe': '4h', 'direction': 'up', 'confidence': 0.68, 'price_change': 5.2},
            {'timeframe': '1d', 'direction': 'down', 'confidence': 0.72, 'price_change': -3.1}
        ],
        'timestamp': '2024-01-15T10:30:00Z'
    })

@app.route('/models', methods=['GET'])
def models():
    return jsonify({
        'available_models': ['bitcoin', 'ethereum', 'cardano', 'solana', 'polygon'],
        'total_models': 5
    })

if __name__ == '__main__':
    print("🚀 Starting Test ML API Server...")
    print("🌐 Server available at: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)