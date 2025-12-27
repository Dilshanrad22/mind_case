import { apiRequest } from './api';

/**
 * Add a new food entry
 */
export const addFood = async (foodData) => {
  return await apiRequest('/nutrition/foods', {
    method: 'POST',
    body: JSON.stringify(foodData),
  });
};

/**
 * Get today's nutrition data
 */
export const getTodayNutrition = async () => {
  return await apiRequest('/nutrition/today', {
    method: 'GET',
  });
};

/**
 * Get today's food list
 */
export const getTodayFoods = async () => {
  return await apiRequest('/nutrition/foods/today', {
    method: 'GET',
  });
};

/**
 * Update steps walked
 * @param {number} steps - Number of steps
 * @param {boolean} addToExisting - If true, adds to existing steps; if false, replaces total
 */
export const updateSteps = async (steps, addToExisting = true) => {
  return await apiRequest('/nutrition/steps', {
    method: 'PUT',
    body: JSON.stringify({ steps, addToExisting }),
  });
};

/**
 * Get weekly nutrition data
 */
export const getWeeklyNutrition = async () => {
  return await apiRequest('/nutrition/weekly', {
    method: 'GET',
  });
};

/**
 * Delete a food entry
 */
export const deleteFood = async (foodId) => {
  return await apiRequest(`/nutrition/foods/${foodId}`, {
    method: 'DELETE',
  });
};
