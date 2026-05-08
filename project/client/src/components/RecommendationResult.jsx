import React from 'react';

const cropEmojis = {
  rice: '🌾', maize: '🌽', chickpea: '🌰', kidneybeans: '🥜', pigeonpeas: '🌱', 
  mothbeans: '🌿', mungbean: '🍃', blackgram: '🌑', lentil: '🥘', pomegranate: '🍎', 
  banana: '🍌', mango: '🥭', grapes: '🍇', watermelon: '🍉', muskmelon: '🍈', 
  apple: '🍎', orange: '🍊', papaya: '🍈', coconut: '🥥', cotton: '☁️', 
  jute: '🧶', coffee: '☕', wheat: '🌾', barley: '🌾', millet: '🌾', tea: '🌿', potato: '🥔'
};

const RecommendationResult = ({ result }) => {
  if (!result) return null;

  const mainCrop = result.primaryCrop || 'Unknown';
  const emoji = cropEmojis[mainCrop.toLowerCase()] || '🌱';

  return (
    <div 
      className="recommendation-card card" 
      style={{
        backgroundColor: '#ffffff',
        border: '2px solid #a5d6a7',
        boxShadow: '0 4px 16px rgba(46,125,50,0.10)',
        padding: '1.5rem',
        borderRadius: '16px'
      }}
    >
      <div className="result-header">
        <h3 style={{ color: '#1b5e20', fontWeight: '700', marginBottom: '0.5rem' }}>
          Hybrid AI Recommendation
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#4caf50', fontStyle: 'italic', marginBottom: '1rem' }}>
          🌱 {result.reason}
        </p>
        
        <div className="main-crop" style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          <div className="crop-emoji" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            {emoji}
          </div>
          <h2 
            style={{ 
              color: '#1b5e20', 
              fontWeight: '800', 
              fontSize: '2rem', 
              textShadow: 'none',
              margin: '0'
            }}
          >
            {mainCrop.charAt(0).toUpperCase() + mainCrop.slice(1)}
          </h2>
        </div>
      </div>

      {result.confidence && (
        <div className="confidence-section" style={{ marginBottom: '1.5rem' }}>
          <div className="confidence-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#333333', fontWeight: '600' }}>Model Confidence</span>
            <span style={{ color: '#333333', fontWeight: '700' }}>{result.confidence}%</span>
          </div>
          <div className="progress-bar" style={{ background: '#e0e0e0', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <div 
              className="progress-fill" 
              style={{ width: `${result.confidence}%`, background: '#2e7d32', height: '100%' }}
            ></div>
          </div>
        </div>
      )}

      {result.alternatives && result.alternatives.length > 0 && (
        <div className="alternatives-section">
          <h4 style={{ color: '#1b5e20', fontWeight: '700', marginBottom: '0.8rem' }}>
            Strong Alternatives:
          </h4>
          <div className="alternatives-list" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {result.alternatives.map((alt, idx) => (
              <span 
                key={idx} 
                className="alt-badge"
                style={{
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  fontWeight: '600',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem'
                }}
              >
                {cropEmojis[alt.toLowerCase()] || '🌱'} {alt.charAt(0).toUpperCase() + alt.slice(1)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationResult;
