import React, { useState } from 'react';
import axios from 'axios';
const MapSelector = React.lazy(() => import('../components/MapSelector'));
import WeatherCard from '../components/WeatherCard';
import RecommendationResult from '../components/RecommendationResult';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [data, setData] = useState({ weather: null, soil: null, recommendation: null });
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleLocationSelect = (latlng) => {
    setSelectedLocation(latlng);
    setError('');
    setData({ weather: null, soil: null, recommendation: null });
  };

  const fetchRecommendation = async () => {
    if (!selectedLocation) {
      setError('Please select a location on the map first.');
      return;
    }
    
    setLoadingMsg('Fetching authentic soil & weather...');
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const payload = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      };

      setLoadingMsg('Running Hybrid Rules & AI...');
      const response = await axios.post(`${apiUrl}/api/recommend`, payload, config);
      
      setData({
        weather: response.data.weather,
        soil: response.data.soil,
        recommendation: response.data
      });
      localStorage.setItem('farmData', JSON.stringify({
        weather: response.data.weather,
        soil: response.data.soil,
        location: { lat: selectedLocation.lat, lng: selectedLocation.lng }
      }));
      
    } catch (err) {
      console.error('Error getting recommendation:', err);
      setError(err.response?.data?.error || 'Failed to get recommendation.');
    } finally {
      setLoadingMsg('');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Farm Dashboard</h2>
        <p>Select your farm location to get instant Hybrid AI recommendations using genuine soil metrics.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-grid layout-saas">
        <div className="grid-left">
          <React.Suspense fallback={<div style={{padding: '2rem'}}>Loading map...</div>}>
            <MapSelector onLocationSelect={handleLocationSelect} />
          </React.Suspense>
          
          <button 
            className="submit-btn recommendation-btn" 
            onClick={fetchRecommendation} 
            disabled={!!loadingMsg || !selectedLocation}
          >
            {loadingMsg ? <><span className="spinner"></span> {loadingMsg}</> : '🌾 Get Recommendation'}
          </button>
          
          {data.soil && (
            <div className="card soil-data-card" style={{marginTop: '1.5rem'}}>
              <h3 style={{marginBottom: '1rem'}}>🧪 Detected Soil Data (ISRIC Live)</h3>
              <div className="soil-stats" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{background: '#e8f5e9', padding: '0.6rem 1rem', borderRadius: '12px', color: '#2e7d32', fontWeight: 600}}>
                  pH Level: {data.soil?.ph || '--'}
                </span>
                <span style={{background: '#e3f2fd', padding: '0.6rem 1rem', borderRadius: '12px', color: '#1565c0', fontWeight: 600}}>
                  Nitrogen: {data.soil?.nitrogen || '--'} cg/kg
                </span>
                <span style={{background: '#fff3e0', padding: '0.6rem 1rem', borderRadius: '12px', color: '#ef6c00', fontWeight: 600}}>
                  Carbon: {data.soil?.organicCarbon || '--'} dg/kg
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid-right">
          <WeatherCard weather={data.weather} />
          <RecommendationResult result={data.recommendation} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
