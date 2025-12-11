/**
 * Journal API Service
 * Handles all journal-related API calls
 */

import api from './api';

/**
 * Create a new journal entry
 * @param {string} title - Journal title
 * @param {string} text - Journal content
 * @returns {Promise} Created journal data
 */
export const createJournal = async (title, text) => {
  const response = await api.post('/journals', { title, text });
  return response.data;
};

/**
 * Get all journal entries for the authenticated user
 * @returns {Promise} Array of journal entries
 */
export const getJournals = async () => {
  const response = await api.get('/journals');
  return response;
};

/**
 * Get a single journal entry by ID
 * @param {string} id - Journal ID
 * @returns {Promise} Journal data
 */
export const getJournal = async (id) => {
  const response = await api.get(`/journals/${id}`);
  return response.data;
};

/**
 * Update a journal entry
 * @param {string} id - Journal ID
 * @param {string} title - Updated title
 * @param {string} text - Updated content
 * @returns {Promise} Updated journal data
 */
export const updateJournal = async (id, title, text) => {
  const response = await api.put(`/journals/${id}`, { title, text });
  return response.data;
};

/**
 * Delete a journal entry
 * @param {string} id - Journal ID
 * @returns {Promise} Delete confirmation
 */
export const deleteJournal = async (id) => {
  const response = await api.delete(`/journals/${id}`);
  return response;
};

export default {
  createJournal,
  getJournals,
  getJournal,
  updateJournal,
  deleteJournal,
};
