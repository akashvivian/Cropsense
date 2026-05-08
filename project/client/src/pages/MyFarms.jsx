import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyFarms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/api/farms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFarms(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/api/farms/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFarms(farms.filter(f => f._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading farms...</div>;

  return (
    <div className="dashboard-page" style={{ padding: '2rem' }}>
      <h2 style={{ color: '#1b5e20', marginBottom: '2rem' }}>My Saved Farms</h2>
      
      {farms.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#555', fontSize: '1.1rem' }}>No farms saved yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {farms.map(farm => (
            <div key={farm._id} className="card" style={{ position: 'relative', border: '1px solid #e0e0e0', borderTop: '4px solid #4caf50' }}>
              <button 
                onClick={() => handleDelete(farm._id)}
                style={{ 
                  position: 'absolute', top: '10px', right: '10px', 
                  background: '#ef4444', color: 'white', border: 'none', 
                  borderRadius: '4px', padding: '0.2rem 0.6rem', cursor: 'pointer',
                  fontSize: '0.8rem', fontWeight: '600'
                }}
              >
                Delete
              </button>
              
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>LOCATION</span>
                <p>Lat: {farm.lat?.toFixed(4)}, Lng: {farm.lng?.toFixed(4)}</p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>RECOMMENDED CROP</span>
                <h3 style={{ color: '#1b5e20', margin: '0.2rem 0' }}>{farm.lastCrop?.charAt(0).toUpperCase() + farm.lastCrop?.slice(1)}</h3>
              </div>
              
              <div style={{ fontSize: '0.85rem', color: '#888' }}>
                Saved: {new Date(farm.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFarms;
