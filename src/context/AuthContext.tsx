import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Define the API URL
const API_URL = 'http://localhost:5000'; // Change this if your Flask server runs on a different port

// Define types
type User = {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  isAdmin: boolean;
  preferredLanguage: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  token: string | null;
};

type AuthAction =
  | { type: 'LOGIN_START' | 'REGISTER_START' | 'LOGOUT_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_ERROR' | 'REGISTER_ERROR'; payload: string }
  | { type: 'LOGOUT_SUCCESS' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER'; payload: { user: User; token: string } | null };

type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string, 
    username: string, 
    password: string, 
    firstName?: string, 
    lastName?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  token: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
    case 'LOGOUT_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT_SUCCESS':
      return {
        ...initialState,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload?.user || null,
        token: action.payload?.token || null,
        isAuthenticated: !!action.payload?.user,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Setup axios with auth token
const setupAxiosAuth = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const checkUser = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          setupAxiosAuth(storedToken);
          dispatch({ 
            type: 'SET_USER', 
            payload: { 
              user: JSON.parse(storedUser),
              token: storedToken
            }
          });
        } catch (error) {
          console.error('Error parsing stored auth data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    };
    
    checkUser();
  }, []);

  // Login function - connects to Flask backend
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      
      const { user, token } = response.data;
      
      if (!user || !token) {
        dispatch({ type: 'LOGIN_ERROR', payload: 'Authentication failed' });
        return;
      }
      
      // Save to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Setup axios headers
      setupAxiosAuth(token);
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, token }
      });
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 
        axios.isAxiosError(error) && error.response 
          ? error.response.data.error || 'Login failed'
          : 'Network error during login';
      
      dispatch({ 
        type: 'LOGIN_ERROR', 
        payload: errorMessage
      });
    }
  };

  // Register function - connects to Flask backend
  const register = async (
    email: string, 
    username: string, 
    password: string, 
    firstName?: string, 
    lastName?: string
  ) => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      // First register the user
      const registerResponse = await axios.post(`${API_URL}/register`, {
        email,
        username,
        password,
        firstName: firstName || "",
        lastName: lastName || "",
        preferredLanguage: "en"
      });
      
      if (registerResponse.status !== 201) {
        dispatch({ type: 'REGISTER_ERROR', payload: 'Registration failed' });
        return;
      }
      
      // Now login to get the token
      const loginResponse = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      
      const { user, token } = loginResponse.data;
      
      if (!user || !token) {
        dispatch({ type: 'REGISTER_ERROR', payload: 'User created but login failed' });
        return;
      }
      
      // Save to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Setup axios headers
      setupAxiosAuth(token);
      
      dispatch({ 
        type: 'REGISTER_SUCCESS', 
        payload: { user, token }
      });
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = 
        axios.isAxiosError(error) && error.response 
          ? error.response.data.error || 'Registration failed'
          : 'Network error during registration';
      
      dispatch({ 
        type: 'REGISTER_ERROR', 
        payload: errorMessage
      });
    }
  };

  // Logout function
  const logout = async () => {
    dispatch({ type: 'LOGOUT_START' });
    
    try {
      // Remove token from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Remove auth header
      setupAxiosAuth(null);
      
      dispatch({ type: 'LOGOUT_SUCCESS' });
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout on client side even if there's an error
      dispatch({ type: 'LOGOUT_SUCCESS' });
    }
  };

  // Clear error state
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};