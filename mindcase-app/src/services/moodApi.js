/**
 * Mood API Service
 * Handles all mood-related API calls
 */

import api from './api';

/**
 * Valid mood types
 */
export const MOOD_TYPES = [
  'happy',
  'sad',
  'angry',
  'anxious',
  'calm',
  'excited',
  'neutral',
  'stressed',
  'tired',
  'motivated',
];

/**
 * Create a new mood entry
 * @param {string} moodType - Type of mood (must be one of MOOD_TYPES)
 * @returns {Promise} Created mood data
 */
export const createMood = async (moodType) => {
  const response = await api.post('/moods', { moodType });
  return response.data;
};

/**
 * Get all mood entries for the authenticated user
 * @param {object} filters - Optional filters (startDate, endDate, moodType)
 * @returns {Promise} Array of mood entries
 */
export const getMoods = async (filters = {}) => {
  const response = await api.get('/moods', filters);
  return response;
};

/**
 * Get a single mood entry by ID
 * @param {string} id - Mood ID
 * @returns {Promise} Mood data
 */
export const getMood = async (id) => {
  const response = await api.get(`/moods/${id}`);
  return response.data;
};

/**
 * Update a mood entry
 * @param {string} id - Mood ID
 * @param {string} moodType - Updated mood type
 * @returns {Promise} Updated mood data
 */
export const updateMood = async (id, moodType) => {
  const response = await api.put(`/moods/${id}`, { moodType });
  return response.data;
};

/**
 * Delete a mood entry
 * @param {string} id - Mood ID
 * @returns {Promise} Delete confirmation
 */
export const deleteMood = async (id) => {
  const response = await api.delete(`/moods/${id}`);
  return response;
};

/**
 * Get mood statistics
 * @param {string} startDate - Optional start date (ISO format)
 * @param {string} endDate - Optional end date (ISO format)
 * @returns {Promise} Mood statistics
 */
export const getMoodStats = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await api.get('/moods/stats', params);
  return response.data;
};

export default {
  createMood,
  getMoods,
  getMood,
  updateMood,
  deleteMood,
  getMoodStats,
  MOOD_TYPES,
};
