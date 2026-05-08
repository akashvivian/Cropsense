const express = require('express');
const axios = require('axios');
const Farm = require('../models/Farm');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Accurate annual rainfall for all Indian regions (mm)
function estimateAnnualRainfall(lat, lng) {
  // Kerala — very high rainfall
  if (lat < 13 && lng < 77.5) return 3000;
  // Tamil Nadu coastal (Chennai, Thoothukudi, Cuddalore)
  if (lat < 13 && lng > 78) return 650;
  // Tamil Nadu inland (Madurai, Dindigul, Coimbatore)
  if (lat < 13 && lng >= 77.5 && lng <= 78) return 850;
  // Karnataka coast (Mangalore, Udupi)
  if (lat >= 12 && lat < 15 && lng < 76) return 3500;
  // Karnataka inland (Bangalore, Mysore)
  if (lat >= 12 && lat < 15 && lng >= 76 && lng < 78) return 900;
  // Andhra Pradesh coast
  if (lat >= 13 && lat < 20 && lng > 79) return 1000;
  // Telangana / AP inland
  if (lat >= 15 && lat < 20 && lng >= 77 && lng <= 79) return 900;
  // Maharashtra coast (Konkan, Mumbai)
  if (lat >= 15 && lat < 20 && lng < 74) return 3000;
  // Maharashtra inland (Pune, Nashik, Aurangabad)
  if (lat >= 17 && lat < 22 && lng >= 74 && lng < 78) return 700;
  // Vidarbha (Nagpur)
  if (lat >= 20 && lat < 22 && lng >= 78) return 1100;
  // Goa
  if (lat >= 14 && lat < 16 && lng >= 73 && lng < 75) return 3000;
  // Gujarat (Ahmedabad, Surat)
  if (lat >= 20 && lat < 25 && lng >= 68 && lng < 74) return 800;
  // Rajasthan (Jaipur, Jodhpur, Jaisalmer)
  if (lat >= 24 && lat < 30 && lng >= 69 && lng < 76) return 350;
  // Punjab / Haryana
  if (lat >= 28 && lat < 32 && lng >= 74 && lng < 78) return 700;
  // Delhi / NCR
  if (lat >= 28 && lat < 29 && lng >= 76 && lng < 78) return 750;
  // Uttar Pradesh
  if (lat >= 24 && lat < 28 && lng >= 77 && lng < 84) return 900;
  // Bihar
  if (lat >= 24 && lat < 27 && lng >= 84 && lng < 88) return 1100;
  // West Bengal (Kolkata)
  if (lat >= 21 && lat < 24 && lng >= 86 && lng < 90) return 1600;
  // Odisha
  if (lat >= 18 && lat < 22 && lng >= 82 && lng < 87) return 1500;
  // Jharkhand / Chhattisgarh
  if (lat >= 20 && lat < 24 && lng >= 80 && lng < 86) return 1300;
  // Madhya Pradesh
  if (lat >= 21 && lat < 26 && lng >= 74 && lng < 82) return 1000;
  // Northeast India (Assam, Meghalaya, Manipur)
  if (lat >= 22 && lat < 28 && lng >= 88) return 2500;
  // Himachal Pradesh / Uttarakhand hills
  if (lat >= 30 && lat < 33 && lng >= 75 && lng < 80) return 1500;
  // Jammu & Kashmir
  if (lat >= 33) return 650;
  // Default
  return 900;
}

// Soil defaults for ALL Indian regions
function getRegionSoilDefaults(lat, lng) {
  // Kerala — laterite soil
  if (lat < 13 && lng < 77.5) return { N: 55, P: 25, K: 60, ph: 5.8 };
  // Tamil Nadu coastal
  if (lat < 13 && lng > 78) return { N: 55, P: 28, K: 65, ph: 6.8 };
  // Tamil Nadu inland (Madurai/Dindigul)
  if (lat >= 9.5 && lat < 11 && lng >= 77.5) return { N: 60, P: 35, K: 70, ph: 7.2 };
  // Coimbatore
  if (lat >= 10.5 && lat < 12 && lng < 77.5) return { N: 50, P: 30, K: 60, ph: 6.5 };
  // Karnataka coast
  if (lat >= 12 && lat < 15 && lng < 76) return { N: 60, P: 30, K: 55, ph: 6.0 };
  // Karnataka inland (Bangalore/Mysore)
  if (lat >= 12 && lat < 15 && lng >= 76) return { N: 55, P: 32, K: 58, ph: 6.3 };
  // Andhra Pradesh / Telangana
  if (lat >= 13 && lat < 20 && lng > 77) return { N: 50, P: 28, K: 52, ph: 6.5 };
  // Maharashtra coast
  if (lat >= 15 && lat < 20 && lng < 74) return { N: 58, P: 30, K: 60, ph: 6.2 };
  // Maharashtra inland / Vidarbha — black cotton soil
  if (lat >= 17 && lat < 22 && lng >= 74) return { N: 65, P: 35, K: 75, ph: 7.5 };
  // Gujarat
  if (lat >= 20 && lat < 25 && lng < 74) return { N: 45, P: 22, K: 50, ph: 7.8 };
  // Rajasthan — sandy/arid
  if (lat >= 24 && lat < 30 && lng < 76) return { N: 30, P: 15, K: 40, ph: 8.0 };
  // Punjab / Haryana — alluvial
  if (lat >= 28 && lat < 32 && lng >= 74 && lng < 78) return { N: 85, P: 45, K: 65, ph: 7.5 };
  // Delhi / UP
  if (lat >= 24 && lat < 30 && lng >= 76 && lng < 84) return { N: 80, P: 40, K: 60, ph: 7.2 };
  // Bihar / Jharkhand
  if (lat >= 22 && lat < 27 && lng >= 84 && lng < 88) return { N: 75, P: 38, K: 58, ph: 6.8 };
  // West Bengal
  if (lat >= 21 && lat < 24 && lng >= 86) return { N: 70, P: 35, K: 55, ph: 6.5 };
  // Odisha / Chhattisgarh
  if (lat >= 18 && lat < 22 && lng >= 80) return { N: 65, P: 32, K: 52, ph: 6.3 };
  // Madhya Pradesh
  if (lat >= 21 && lat < 26 && lng >= 74 && lng < 82) return { N: 60, P: 30, K: 55, ph: 7.0 };
  // Northeast India
  if (lat >= 22 && lng >= 88) return { N: 65, P: 35, K: 55, ph: 5.8 };
  // Himachal / Uttarakhand
  if (lat >= 30 && lat < 33) return { N: 70, P: 38, K: 60, ph: 6.5 };
  // J&K
  if (lat >= 33) return { N: 60, P: 30, K: 50, ph: 7.0 };
  // Default
  return { N: 55, P: 30, K: 55, ph: 6.5 };
}

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) return res.status(400).json({ error: 'Location required' });

    const latF = parseFloat(lat);
    const lngF = parseFloat(lng);

    let temperature = 25.0;
    let humidity = 65.0;
    let weatherData = { temp: temperature, humidity, description: 'Unknown', city: 'Unknown' };
    let rainfall = estimateAnnualRainfall(latF, lngF);

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (apiKey && apiKey !== 'your_openweather_key_here') {
      try {
        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
        );
        temperature = weatherRes.data.main.temp;
        humidity = weatherRes.data.main.humidity;
        weatherData = {
          temp: temperature,
          humidity,
          description: weatherRes.data.weather[0].description,
          city: weatherRes.data.name
        };
      } catch (err) {}
    }

    // Soil: try SoilGrids API, fallback to region defaults
    let soil = getRegionSoilDefaults(latF, lngF);
    let { N, P, K, ph } = soil;

    try {
      const baseUrl = process.env.SERVER_URL || `http://127.0.0.1:${process.env.PORT || 5000}`;
      const soilRes = await axios.get(
        `${baseUrl}/api/soil?lat=${lat}&lng=${lng}`,
        { timeout: 6000 }
      );
      if (soilRes.data.N && soilRes.data.N > 0) {
        N = soilRes.data.N;
        P = soilRes.data.P;
        K = soilRes.data.K;
        ph = soilRes.data.ph;
      }
    } catch (err) {}

    const soilData = { N, P, K, ph };
    console.log('Sending to ML:', { N, P, K, temperature, humidity, ph, rainfall });

    const mlServerUrl = process.env.ML_SERVER_URL || 'http://127.0.0.1:5001';
    let primaryCrop = '';
    let alternatives = [];
    let mlConfidence = 90;

    try {
      const mlRes = await axios.post(`${mlServerUrl}/predict`, {
        N, P, K, temperature, humidity, ph, rainfall
      });
      primaryCrop = mlRes.data.crop;
      alternatives = mlRes.data.alternatives;
      mlConfidence = mlRes.data.confidence;
    } catch (err) {
      console.warn('ML Server Error:', err.message);
    }

    try {
      const farm = new Farm({ lat, lng, N, P, K, ph, rainfall, lastCrop: primaryCrop, userId: req.user });
      await farm.save();
    } catch (err) {}

    res.json({
      primaryCrop,
      alternatives,
      confidence: Math.round(mlConfidence),
      reason: 'Based on ML predictions and adjusted SoilGrids tracking',
      weather: weatherData,
      soil: soilData,
    });

  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ error: 'Processing failure' });
  }
});

module.exports = router;
