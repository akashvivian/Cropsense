import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import SoilWeather from './pages/SoilWeather';
import MyFarms from './pages/MyFarms';

import './App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: 'red', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong:</h2>
          <pre style={{ background: '#fff0f0', padding: '16px', borderRadius: '8px' }}>
            {this.state.error?.message}
          </pre>
          <button onClick={() => window.location.href = '/login'}
            style={{ padding: '10px 20px', marginTop: '16px',
              background: '#2e7d32', color: 'white', border: 'none',
              borderRadius: '8px', cursor: 'pointer' }}>
            Back to Login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-layout">
        {user && <Sidebar />}
        <main className={`content-area ${!user ? 'full-width' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="spinner-wrapper"><span className="spinner"></span></div>;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/soil-weather" 
        element={
          <ProtectedRoute>
            <SoilWeather />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-farms" 
        element={
          <ProtectedRoute>
            <MyFarms />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
