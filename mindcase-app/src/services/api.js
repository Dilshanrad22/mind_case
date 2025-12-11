/**
 * API Configuration
 * Enterprise-level API client with fetch and authentication
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Base API URL - Update this based on your environment
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-api.com/api';

// Token storage key
const TOKEN_KEY = 'auth_token';

// Secure storage helpers
const getToken = async () => {
  if (Platform.OS === 'web') {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('[API] Web token retrieved:', token ? 'Token exists' : 'No token');
    return token;
  }
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log('[API] Native token retrieved:', token ? 'Token exists' : 'No token');
    return token;
  } catch (error) {
    console.error('[API] Error retrieving token:', error);
    return null;
  }
};

/**
 * Makes an API request with proper authentication and error handling
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get authentication token
  const token = await getToken();
  
  console.log(`[API] ${options.method || 'GET'} ${endpoint}`);
  console.log('[API] Token present:', !!token);
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('[API] Authorization header added');
  } else {
    console.warn('[API] No token available for request');
  }
  
  // Merge options
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log(`[API] Response status: ${response.status}`);
    
    // Handle non-2xx responses
    if (!response.ok) {
      console.error('[API] Error response:', data);
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error('[API] Request failed:', error);
    // Network errors or JSON parsing errors
    if (error.message === 'Network request failed' || error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

/**
 * GET request
 */
export const apiGet = async (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  
  return apiRequest(url, {
    method: 'GET',
  });
};

/**
 * POST request
 */
export const apiPost = async (endpoint, body) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * PUT request
 */
export const apiPut = async (endpoint, body) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

/**
 * DELETE request
 */
export const apiDelete = async (endpoint) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
  });
};

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};
