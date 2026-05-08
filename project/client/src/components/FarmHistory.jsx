import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FarmHistory = ({ refreshTrigger }) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFarms = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/farms`);
      setFarms(response.data);
    } catch (error) {
      console.error('Error fetching farm history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.delete(`${apiUrl}/api/farms/${id}`);
      fetchFarms(); // Refresh list
    } catch (error) {
      console.error('Error deleting farm:', error);
    }
  };

  if (loading) return <div className="history-section"><p>Loading history...</p></div>;

  return (
    <div className="history-section card">
      <h3>📋 Recent Recommendations Log</h3>
      
      {farms.length === 0 ? (
        <p className="empty-state">No farm recommendations saved yet.</p>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Location</th>
                <th>Soil (N:P:K)</th>
                <th>Recommended Crop</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {farms.map((farm) => (
                <tr key={farm._id}>
                  <td>{new Date(farm.createdAt).toLocaleDateString()}</td>
                  <td>{farm.lat.toFixed(2)}, {farm.lng.toFixed(2)}</td>
                  <td>{farm.N}:{farm.P}:{farm.K}</td>
                  <td className="highlight-crop">{farm.lastCrop}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(farm._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FarmHistory;
