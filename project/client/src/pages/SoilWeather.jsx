import React, { useEffect, useState } from 'react';
import WeatherCard from '../components/WeatherCard';

const SoilWeather = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('farmData');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  if (!data || !data.soil) {
    return (
      <div className="dashboard-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#1b5e20', marginBottom: '1rem' }}>Soil & Weather Insights</h2>
        <div className="card" style={{ padding: '3rem' }}>
          <p style={{ color: '#555', fontSize: '1.1rem' }}>Please select a location on the map in the Dashboard first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page" style={{ padding: '2rem' }}>
      <h2 style={{ color: '#1b5e20', marginBottom: '2rem' }}>Soil & Weather Insights</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#1b5e20' }}>Current Weather</h3>
          <WeatherCard weather={data.weather} />
        </div>
        
        <div>
          <h3 style={{ marginBottom: '1rem', color: '#1b5e20' }}>Detected Soil Data (ISRIC Live)</h3>
          <div className="card soil-data-card" style={{ border: '1px solid #e0e0e0', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#e8f5e9', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #2e7d32' }}>
                <strong style={{ color: '#1b5e20', display: 'block', marginBottom: '0.2rem' }}>pH Level</strong>
                <span style={{ fontSize: '1.2rem', color: '#333' }}>{data.soil.ph}</span>
              </div>
              
              <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #1565c0' }}>
                <strong style={{ color: '#0d47a1', display: 'block', marginBottom: '0.2rem' }}>Nitrogen</strong>
                <span style={{ fontSize: '1.2rem', color: '#333' }}>{data.soil.nitrogen} cg/kg</span>
              </div>
              
              <div style={{ background: '#fff3e0', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #ef6c00' }}>
                <strong style={{ color: '#e65100', display: 'block', marginBottom: '0.2rem' }}>Organic Carbon</strong>
                <span style={{ fontSize: '1.2rem', color: '#333' }}>{data.soil.organicCarbon} dg/kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilWeather;
