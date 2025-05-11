import axios from 'axios';
import { WeatherData } from '../types';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to request if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Disease detection service
export const diseaseDetectionService = {
  detectDisease: async (imageFile: File, description?: string) => {
    const formData = new FormData();
    formData.append('uploaded_image', imageFile);

    if (description) {
      formData.append('user_prompt', description);
    }

    return api.post('/api/disease-detection', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getHistory: () => api.get('/api/disease-detection/history'),
};

// Chatbot service
export const chatbotService = {
  sendMessage: (message: string) => api.post('/api/chatbot', { user_input: message }),
  getSessions: () => api.get('/api/chatbot/sessions'),
  getSession: (sessionId: string) => api.get(`/api/chatbot/sessions/${sessionId}`),
  createSession: () => api.post('/api/chatbot/sessions'),
};

// Weather service
export const weatherService = {
  getWeather: async (lat: string, lon: string): Promise<{ data: WeatherData }> => {
    // **WEATHER API KEY HARDCODED HERE - NOT RECOMMENDED FOR PRODUCTION**
    const WEATHER_API_KEY = '318b11db9cd27a1bbdd3e39640c06f23';
    try {
      const response = await axios.get<WeatherData>(
        `https://your-weather-api.com/data?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}` // Replace with actual API URL
      );
      return { data: response.data };
    } catch (error: any) {
      throw error;
    }
  },
};

// Water prediction service
export const waterPredictionService = {
  predictWaterRequirement: (data: {
    cropType: string;
    soilType: string;
    area: number;
    temperature: number;
    humidity: number;
  }) => api.post('/api/water-prediction', data),
};

// Fertilizer recommendation service
export const fertilizerService = {
  getFertilizerRecommendation: (data: {
    cropType: string;
    soilType: string;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  }) => api.post('/api/fertilizer-recommendation', data),
};

// Auth service
export const authService = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),

  register: (data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => api.post('/api/auth/register', data),

  getCurrentUser: () => api.get('/api/auth/me'),
};

// User service
export const userService = {
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    preferredLanguage?: string;
  }) => api.patch('/api/users/profile', data),

  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => api.post('/api/users/change-password', data),
};

// Admin service
export const adminService = {
  getAllUsers: () => api.get('/admin/users'),
  getUserStats: () => api.get('/admin/stats/users'),
  getSystemStats: () => api.get('/admin/stats/system'),
};