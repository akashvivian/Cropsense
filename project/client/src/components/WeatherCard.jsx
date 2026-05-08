import React from 'react';

const getWeatherEmoji = (description) => {
  if (!description) return '🌡️';
  const desc = description.toLowerCase();
  if (desc.includes('clear') || desc.includes('sun')) return '☀️';
  if (desc.includes('cloud')) return '☁️';
  if (desc.includes('rain')) return '🌧️';
  if (desc.includes('snow')) return '❄️';
  if (desc.includes('storm') || desc.includes('thunder')) return '⛈️';
  if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
  return '🌤️';
};

const WeatherCard = ({ weather }) => {
  if (!weather) {
    return (
      <div className="weather-card empty card">
        <div className="weather-icon">📍</div>
        <p>Select a location on the map to view local weather</p>
      </div>
    );
  }

  return (
    <div className="weather-card active card">
      <div className="weather-header">
        <h3>Current Weather</h3>
        <span className="city-name">{weather.city}</span>
      </div>
      
      <div className="weather-content">
        <div className="weather-icon-large">
          {getWeatherEmoji(weather.description)}
        </div>
        <div className="weather-stats">
          <div className="temp">{Math.round(weather.temp)}°C</div>
          <div className="desc">{weather.description}</div>
          <div className="humidity">💧 {weather.humidity}% Humidity</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
