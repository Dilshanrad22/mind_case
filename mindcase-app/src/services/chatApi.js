/**
 * Chat API Service
 * Handles all AI chat-related API calls
 */

import { apiGet, apiPost, apiDelete } from './api';

/**
 * Send a message to the AI assistant
 * @param {string} message - User's message
 * @param {string} chatId - Optional existing chat session ID
 * @returns {Promise} AI response and chat data
 */
export const sendMessage = async (message, chatId = null) => {
  const response = await apiPost('/chat/message', { message, chatId });
  return response;
};

/**
 * Create a new chat session
 * @returns {Promise} New chat data with welcome message
 */
export const createNewChat = async () => {
  const response = await apiPost('/chat/new');
  return response;
};

/**
 * Get all chat sessions for the user
 * @returns {Promise} Array of chat sessions
 */
export const getChats = async () => {
  const response = await apiGet('/chat');
  return response;
};

/**
 * Get full chat history for a specific chat
 * @param {string} chatId - Chat session ID
 * @returns {Promise} Chat with all messages
 */
export const getChatHistory = async (chatId) => {
  const response = await apiGet(`/chat/${chatId}`);
  return response;
};

/**
 * Delete a chat session
 * @param {string} chatId - Chat session ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteChat = async (chatId) => {
  const response = await apiDelete(`/chat/${chatId}`);
  return response;
};

/**
 * Clear all messages in a chat
 * @param {string} chatId - Chat session ID
 * @returns {Promise} Updated chat with cleared messages
 */
export const clearChat = async (chatId) => {
  const response = await apiDelete(`/chat/${chatId}/messages`);
  return response;
};

export default {
  sendMessage,
  createNewChat,
  getChats,
  getChatHistory,
  deleteChat,
  clearChat,
};
