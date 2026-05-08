# Setup & Startup Instructions

## Prerequisites
- Node.js installed
- Python 3 installed
- MongoDB installed and running locally on port 27017

## 1. Setup ML Server

Open Terminal 1:
```bash
cd ml
# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python generate_data.py
python train_model.py
```

## 2. Setup Backend Server

Open Terminal 2:
```bash
cd server
npm install
# Ensure .env is set correctly and MongoDB is running
npm start
```

## 3. Setup Frontend

Open Terminal 3:
```bash
cd client
npm install
npm run dev
```

## Running the Complete App
With all 3 servers running simultaneously:
1. Wait for `ml/train_model.py` to finish saving `model.pkl`.
2. Ensure Flask runs on `:5001`.
3. Ensure Express runs on `:5000`.
4. Ensure Vite React app runs on frontend port (e.g. `:5173`).
5. Open your browser to the Vite URL, click a location on the map, input soil data, and get recommendations!
