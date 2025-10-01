@echo off
echo 🚀 CryptoX ML Service Setup and Training

echo.
echo 1. Setting up Python environment...
python -m venv ml_env
call ml_env\Scripts\activate

echo.
echo 2. Installing requirements...
pip install -r requirements.txt

echo.
echo 3. Creating necessary directories...
mkdir data
mkdir models

echo.
echo 4. Starting data collection and model training...
python train_all_models.py

echo.
echo 5. Starting ML API server...
python api_server.py

pause