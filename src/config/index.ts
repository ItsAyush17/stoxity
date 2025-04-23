// Configuration settings for the application

// API Keys
export const API_KEYS = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY", // Replace with your actual API key or use environment variable
};

// API Endpoints
export const API_ENDPOINTS = {
  GEMINI_API: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
};

// Feature Flags
export const FEATURES = {
  USE_REAL_DATA: true, // Set to false to use mock data instead of real API calls
  ENABLE_CHARTS: true,
  ENABLE_NEWS: true,
}; 