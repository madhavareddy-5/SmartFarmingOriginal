export interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  is_admin: boolean;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  session: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface WeatherData {
  location: string;
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
    precip_mm: number;
  };
  forecast: {
    date: string;
    day: {
      maxtemp_c: number;
      mintemp_c: number;
      condition: {
        text: string;
        icon: string;
      };
      daily_chance_of_rain: number;
    };
  }[];
}

export interface DiseaseDetection {
  id: string;
  user_id: string;
  image_url: string;
  detected_disease: string;
  confidence: number;
  recommendations: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface CropRecommendation {
  id: string;
  user_id: string;
  soil_type: string;
  ph: number;
  rainfall: number;
  temperature: number;
  humidity: number;
  recommended_crops: string[];
  created_at: string;
}

export interface WaterPrediction {
  crop_type: string;
  soil_type: string;
  area: number;
  temperature: number;
  humidity: number;
  water_requirement: number;
  frequency: string;
  recommendations: string;
}

export interface FertilizerRecommendation {
  crop_type: string;
  soil_type: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  recommended_fertilizers: {
    name: string;
    amount: number;
    unit: string;
  }[];
  recommendations: string;
}