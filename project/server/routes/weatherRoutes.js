const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // For local development without a real API key, return mock data
    if (apiKey === 'your_openweather_key_here' || !apiKey) {
      return res.json({
        temp: 25.5,
        humidity: 65,
        description: 'Mocked Sunny',
        city: 'Mock City'
      });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(url);
    const data = response.data;
    
    res.json({
      temp: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      city: data.name
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
