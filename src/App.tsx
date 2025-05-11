import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/Layout/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DiseaseDetection from './pages/DiseaseDetection';
import Chatbot from './pages/Chatbot';
import Weather from './pages/Weather';
import WaterPrediction from './pages/WaterPrediction';
import Fertilizer from './pages/Fertilizer';

// Resource Pages
import Documentation from './pages/resources/Documentation';
import FarmingGuides from './pages/resources/FarmingGuides';
import Blog from './pages/resources/Blog';
import FAQ from './pages/resources/FAQ';

// About Pages
import AboutUs from './pages/about/AboutUs';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  
  if (state.isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="disease-detection" element={<DiseaseDetection />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="weather" element={<Weather />} />
          <Route path="water-prediction" element={<WaterPrediction />} />
          <Route path="fertilizer" element={<Fertilizer />} />
          
          {/* Resource Routes */}
          <Route path="documentation" element={<Documentation />} />
          <Route path="farming-guides" element={<FarmingGuides />} />
          <Route path="blog" element={<Blog />} />
          <Route path="faq" element={<FAQ />} />
          
          {/* About Routes */}
          <Route path="about" element={<AboutUs />} />
          
          {/* Protected routes */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl">Dashboard Page </h1>
              </div>
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl">Profile Page </h1>
              </div>
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl">Settings Page </h1>
              </div>
            </ProtectedRoute>
          } />
          <Route path="admin" element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl">Admin Dashboard </h1>
              </div>
            </ProtectedRoute>
          } />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600 mb-6">Page not found</p>
              <a href="/" className="btn btn-primary">
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default App;