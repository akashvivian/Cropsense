import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

function FlyToLocation({ position }) {
  const map = useMap();
  React.useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 13, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

export default function MapSelector({ onLocationSelect }) {
  const [marker, setMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [flyTo, setFlyTo] = useState(null);
  const debounceRef = useRef(null);

  const handleSelect = (latlng) => {
    setMarker(latlng);
    setFlyTo(latlng);
    if (onLocationSelect) onLocationSelect(latlng);
  };

  const searchLocation = async (query) => {
    if (query.length < 3) { setSuggestions([]); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=in`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (e) {
      console.error('Search error:', e);
    }
    setSearching(false);
  };

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchLocation(val), 400);
  };

  const handleSuggestionClick = (place) => {
    const latlng = { lat: parseFloat(place.lat), lng: parseFloat(place.lon) };
    setSearchQuery(place.display_name.split(',').slice(0, 2).join(','));
    setSuggestions([]);
    handleSelect(latlng);
  };

  return (
    <div className="map-selector">
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInput}
          placeholder="🔍 Search your village, town or city..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1.5px solid #a5d6a7',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(46,125,50,0.08)'
          }}
        />
        {searching && (
          <span style={{ position: 'absolute', right: '12px', top: '10px' }}>⏳</span>
        )}
        {suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #c8e6c9',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            zIndex: 9999,
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {suggestions.map((place, i) => (
              <div
                key={i}
                onClick={() => handleSuggestionClick(place)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f1f8e9',
                  fontSize: '0.88rem',
                  color: '#333'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f8e9'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                📍 {place.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.85rem', color: '#777', marginBottom: '6px' }}>
        Or click directly on the map to pin your farm
      </p>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '380px', width: '100%', borderRadius: '12px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onSelect={handleSelect} />
        {flyTo && <FlyToLocation position={flyTo} />}
        {marker && <Marker position={marker} />}
      </MapContainer>

      {marker && (
        <p style={{
          marginTop: '8px',
          fontSize: '0.88rem',
          color: '#2e7d32',
          fontWeight: 600
        }}>
          ✅ Farm location set: {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
}
