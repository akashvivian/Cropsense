import pandas as pd
import numpy as np
import random

# Columns: N,P,K,temperature,humidity,ph,rainfall,label
crops = [
    "rice", "maize", "chickpea", "kidneybeans", "pigeonpeas", "mothbeans", 
    "mungbean", "blackgram", "lentil", "pomegranate", "banana", "mango", 
    "grapes", "watermelon", "muskmelon", "apple", "orange", "papaya", 
    "coconut", "cotton", "jute", "coffee"
]

# Define ranges for each crop to make it realistic (approximation of the Kaggle dataset)
crop_ranges = {
    "rice": {"N": (60, 100), "P": (35, 60), "K": (35, 45), "temperature": (20, 28), "humidity": (80, 85), "ph": (5, 7.5), "rainfall": (150, 300)},
    "maize": {"N": (60, 100), "P": (35, 60), "K": (15, 25), "temperature": (18, 27), "humidity": (55, 75), "ph": (5.5, 7.5), "rainfall": (60, 110)},
    "chickpea": {"N": (20, 60), "P": (55, 80), "K": (75, 85), "temperature": (17, 21), "humidity": (14, 20), "ph": (5.5, 8.5), "rainfall": (65, 95)},
    "kidneybeans": {"N": (0, 40), "P": (55, 80), "K": (15, 25), "temperature": (15, 25), "humidity": (18, 25), "ph": (5.5, 6.0), "rainfall": (65, 150)},
    "pigeonpeas": {"N": (0, 40), "P": (55, 80), "K": (15, 25), "temperature": (18, 30), "humidity": (30, 70), "ph": (5.5, 7.0), "rainfall": (90, 200)},
    "mothbeans": {"N": (0, 40), "P": (35, 60), "K": (15, 25), "temperature": (24, 32), "humidity": (40, 65), "ph": (3.5, 10.0), "rainfall": (30, 75)},
    "mungbean": {"N": (0, 40), "P": (35, 60), "K": (15, 25), "temperature": (27, 30), "humidity": (80, 90), "ph": (6.0, 7.5), "rainfall": (35, 60)},
    "blackgram": {"N": (20, 60), "P": (55, 80), "K": (15, 25), "temperature": (25, 35), "humidity": (60, 70), "ph": (6.5, 7.5), "rainfall": (60, 75)},
    "lentil": {"N": (0, 40), "P": (55, 80), "K": (15, 25), "temperature": (18, 30), "humidity": (60, 70), "ph": (5.5, 7.5), "rainfall": (35, 55)},
    "pomegranate": {"N": (0, 40), "P": (5, 30), "K": (35, 45), "temperature": (18, 25), "humidity": (85, 95), "ph": (5.5, 7.5), "rainfall": (100, 115)},
    "banana": {"N": (80, 120), "P": (70, 95), "K": (45, 55), "temperature": (25, 30), "humidity": (75, 85), "ph": (5.5, 6.5), "rainfall": (90, 120)},
    "mango": {"N": (0, 40), "P": (15, 40), "K": (25, 35), "temperature": (27, 36), "humidity": (45, 55), "ph": (4.5, 7.0), "rainfall": (90, 100)},
    "grapes": {"N": (0, 40), "P": (120, 145), "K": (195, 205), "temperature": (8, 40), "humidity": (80, 85), "ph": (5.5, 6.5), "rainfall": (65, 75)},
    "watermelon": {"N": (80, 120), "P": (5, 30), "K": (45, 55), "temperature": (20, 25), "humidity": (80, 90), "ph": (6.0, 6.5), "rainfall": (40, 60)},
    "muskmelon": {"N": (80, 120), "P": (5, 30), "K": (45, 55), "temperature": (27, 30), "humidity": (90, 95), "ph": (6.0, 6.5), "rainfall": (20, 30)},
    "apple": {"N": (0, 40), "P": (120, 145), "K": (195, 205), "temperature": (21, 24), "humidity": (90, 95), "ph": (5.5, 6.5), "rainfall": (100, 125)},
    "orange": {"N": (0, 40), "P": (5, 30), "K": (5, 15), "temperature": (10, 35), "humidity": (90, 95), "ph": (6.0, 7.5), "rainfall": (100, 120)},
    "papaya": {"N": (30, 70), "P": (45, 70), "K": (45, 55), "temperature": (23, 44), "humidity": (90, 95), "ph": (6.5, 7.0), "rainfall": (40, 250)},
    "coconut": {"N": (0, 40), "P": (5, 30), "K": (25, 35), "temperature": (25, 30), "humidity": (90, 100), "ph": (5.5, 6.5), "rainfall": (130, 230)},
    "cotton": {"N": (100, 140), "P": (35, 60), "K": (15, 25), "temperature": (22, 26), "humidity": (75, 85), "ph": (5.0, 8.0), "rainfall": (60, 100)},
    "jute": {"N": (60, 100), "P": (35, 60), "K": (35, 45), "temperature": (23, 27), "humidity": (70, 90), "ph": (6.0, 7.5), "rainfall": (150, 200)},
    "coffee": {"N": (80, 120), "P": (15, 40), "K": (25, 35), "temperature": (23, 28), "humidity": (50, 70), "ph": (6.0, 7.5), "rainfall": (110, 200)},
}

data = []
# Create 100 rows per crop to get 2200 rows total
for crop in crops:
    ranges = crop_ranges[crop]
    for _ in range(100):
        row = {
            "N": round(random.uniform(ranges["N"][0], ranges["N"][1]), 0),
            "P": round(random.uniform(ranges["P"][0], ranges["P"][1]), 0),
            "K": round(random.uniform(ranges["K"][0], ranges["K"][1]), 0),
            "temperature": round(random.uniform(ranges["temperature"][0], ranges["temperature"][1]), 2),
            "humidity": round(random.uniform(ranges["humidity"][0], ranges["humidity"][1]), 2),
            "ph": round(random.uniform(ranges["ph"][0], ranges["ph"][1]), 2),
            "rainfall": round(random.uniform(ranges["rainfall"][0], ranges["rainfall"][1]), 2),
            "label": crop
        }
        data.append(row)

df = pd.DataFrame(data)
df.to_csv("crop_recommendation.csv", index=False)
print("Generated crop_recommendation.csv with", len(df), "rows.")
