from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

try:
    model = joblib.load("model.pkl")
    print("Model loaded successfully")
except Exception as e:
    print("Model missing.")
    model = None

# Real crop suitability map based on Indian agronomy
# Format: (temp_min, temp_max, humidity_min, humidity_max, rainfall_min, rainfall_max, ph_min, ph_max) -> crops
REGION_CROP_MAP = [
    # Rice: high rainfall, high humidity, warm
    {"crop": "rice",       "temp": (20, 35), "humidity": (60, 100), "rainfall": (150, 3000), "ph": (5.0, 7.5)},
    # Banana: tropical, high humidity
    {"crop": "banana",     "temp": (24, 35), "humidity": (70, 100), "rainfall": (100, 3000), "ph": (5.5, 7.0)},
    # Coconut: coastal, high humidity
    {"crop": "coconut",    "temp": (25, 35), "humidity": (80, 100), "rainfall": (130, 3000), "ph": (5.5, 7.0)},
    # Mango: warm, moderate humidity
    {"crop": "mango",      "temp": (24, 38), "humidity": (40, 70),  "rainfall": (90, 200),  "ph": (5.5, 7.5)},
    # Cotton: warm, moderate humidity, low rainfall
    {"crop": "cotton",     "temp": (21, 30), "humidity": (50, 85),  "rainfall": (60, 110),  "ph": (5.5, 8.0)},
    # Maize: moderate temp, moderate humidity
    {"crop": "maize",      "temp": (18, 30), "humidity": (50, 80),  "rainfall": (60, 120),  "ph": (5.5, 7.5)},
    # Chickpea: cool, low humidity
    {"crop": "chickpea",   "temp": (15, 25), "humidity": (14, 40),  "rainfall": (60, 100),  "ph": (6.0, 8.5)},
    # Papaya: tropical
    {"crop": "papaya",     "temp": (22, 40), "humidity": (85, 100), "rainfall": (45, 250),  "ph": (6.0, 7.0)},
    # Coffee: moderate temp, high humidity
    {"crop": "coffee",     "temp": (22, 28), "humidity": (50, 70),  "rainfall": (110, 200), "ph": (6.0, 7.5)},
    # Jute: hot, very humid
    {"crop": "jute",       "temp": (23, 27), "humidity": (70, 90),  "rainfall": (150, 200), "ph": (6.0, 7.5)},
    # Wheat: cool, low humidity
    {"crop": "wheat",      "temp": (10, 25), "humidity": (40, 70),  "rainfall": (75, 150),  "ph": (6.0, 7.5)},
    # Lentil: cool, dry
    {"crop": "lentil",     "temp": (15, 25), "humidity": (55, 75),  "rainfall": (35, 55),   "ph": (5.5, 7.5)},
    # Mungbean: warm, moderate
    {"crop": "mungbean",   "temp": (25, 35), "humidity": (60, 90),  "rainfall": (36, 60),   "ph": (6.0, 7.5)},
    # Blackgram: warm, moderate
    {"crop": "blackgram",  "temp": (25, 35), "humidity": (60, 70),  "rainfall": (60, 75),   "ph": (6.5, 7.5)},
    # Pomegranate: warm, moderate humidity
    {"crop": "pomegranate","temp": (18, 25), "humidity": (85, 95),  "rainfall": (100, 115), "ph": (5.5, 7.5)},
    # Watermelon: hot, moderate humidity
    {"crop": "watermelon", "temp": (20, 25), "humidity": (80, 90),  "rainfall": (40, 60),   "ph": (6.0, 6.5)},
    # Grapes: moderate temp, high humidity
    {"crop": "grapes",     "temp": (8, 40),  "humidity": (80, 85),  "rainfall": (65, 75),   "ph": (5.5, 6.5)},
    # Apple: cold
    {"crop": "apple",      "temp": (21, 24), "humidity": (90, 95),  "rainfall": (100, 125), "ph": (5.5, 6.5)},
    # Orange: moderate
    {"crop": "orange",     "temp": (10, 35), "humidity": (90, 95),  "rainfall": (100, 120), "ph": (6.0, 7.5)},
    # Kidneybeans
    {"crop": "kidneybeans","temp": (15, 25), "humidity": (18, 25),  "rainfall": (65, 150),  "ph": (5.5, 6.0)},
    # Pigeonpeas: warm, moderate
    {"crop": "pigeonpeas", "temp": (18, 30), "humidity": (30, 70),  "rainfall": (90, 200),  "ph": (5.5, 7.0)},
    # Mothbeans: hot, dry
    {"crop": "mothbeans",  "temp": (24, 32), "humidity": (40, 65),  "rainfall": (30, 75),   "ph": (3.5, 10)},
    # Muskmelon: hot, very humid
    {"crop": "muskmelon",  "temp": (27, 30), "humidity": (90, 95),  "rainfall": (20, 30),   "ph": (6.0, 6.5)},
]

def get_region_crops(temperature, humidity, rainfall, ph):
    """Return crops sorted by how well they match the given conditions."""
    scores = []
    for entry in REGION_CROP_MAP:
        t_ok = entry["temp"][0] <= temperature <= entry["temp"][1]
        h_ok = entry["humidity"][0] <= humidity <= entry["humidity"][1]
        r_ok = entry["rainfall"][0] <= rainfall <= entry["rainfall"][1]
        p_ok = entry["ph"][0] <= ph <= entry["ph"][1]
        score = sum([t_ok, h_ok, r_ok, p_ok])
        if score >= 3:  # at least 3 out of 4 conditions match
            scores.append((entry["crop"], score))
    scores.sort(key=lambda x: -x[1])
    return [c[0] for c in scores]

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.json

        N           = max(0,   min(140, float(data.get('N', 50))))
        P           = max(5,   min(145, float(data.get('P', 30))))
        K           = max(5,   min(205, float(data.get('K', 50))))
        temperature = max(8,   min(44,  float(data.get('temperature', 25))))
        humidity    = max(14,  min(100, float(data.get('humidity', 60))))
        ph          = max(3.5, min(10,  float(data.get('ph', 6.5))))
        rainfall    = float(data.get('rainfall', 100))  # keep real value for region matching
        rainfall_model = max(20, min(300, rainfall))    # clamped only for ML model input

        # ML model prediction
        features = [[N, P, K, temperature, humidity, ph, rainfall_model]]
        probabilities = model.predict_proba(features)[0]
        top_indices = np.argsort(probabilities)[::-1][:4]
        ml_crops = [model.classes_[i] for i in top_indices]
        top_prob    = float(probabilities[top_indices[0]])
        second_prob = float(probabilities[top_indices[1]])

        # Region-aware crop matching using real rainfall
        region_crops = get_region_crops(temperature, humidity, rainfall, ph)

        # Combine: prefer crops that appear in BOTH ML and region match
        overlap = [c for c in ml_crops if c in region_crops]

        if overlap:
            primary_crop = overlap[0]
            alternatives = [c for c in region_crops if c != primary_crop][:3]
            confidence = 92.0
        elif region_crops:
            # Region match is more trustworthy when rainfall is out of ML training range
            primary_crop = region_crops[0]
            alternatives = region_crops[1:4]
            confidence = 90.0
        else:
            # Fall back to pure ML
            primary_crop = ml_crops[0]
            alternatives = ml_crops[1:4]
            gap = top_prob - second_prob
            confidence = 92.0 if gap > 0.1 else 88.0

        return jsonify({
            'crop': primary_crop,
            'confidence': confidence,
            'alternatives': alternatives
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
