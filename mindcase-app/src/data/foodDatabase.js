// Comprehensive food database with calorie values (per serving)
export const FOOD_DATABASE = [
  // Breakfast Foods
  { id: 1, name: 'White Rice (1 cup)', calories: 206, category: 'Grains' },
  { id: 2, name: 'Brown Rice (1 cup)', calories: 218, category: 'Grains' },
  { id: 3, name: 'Bread (1 slice)', calories: 79, category: 'Grains' },
  { id: 4, name: 'Whole Wheat Bread (1 slice)', calories: 81, category: 'Grains' },
  { id: 5, name: 'Roti/Chapati (1 piece)', calories: 104, category: 'Grains' },
  { id: 6, name: 'Naan (1 piece)', calories: 262, category: 'Grains' },
  { id: 7, name: 'Oatmeal (1 cup)', calories: 154, category: 'Grains' },
  { id: 8, name: 'Cornflakes (1 cup)', calories: 101, category: 'Grains' },
  
  // Proteins
  { id: 10, name: 'Egg (1 large)', calories: 72, category: 'Protein' },
  { id: 11, name: 'Boiled Egg (1 large)', calories: 68, category: 'Protein' },
  { id: 12, name: 'Scrambled Eggs (2 eggs)', calories: 204, category: 'Protein' },
  { id: 13, name: 'Chicken Breast (100g)', calories: 165, category: 'Protein' },
  { id: 14, name: 'Fried Chicken (1 piece)', calories: 320, category: 'Protein' },
  { id: 15, name: 'Fish (100g grilled)', calories: 206, category: 'Protein' },
  { id: 16, name: 'Tuna (100g)', calories: 132, category: 'Protein' },
  { id: 17, name: 'Salmon (100g)', calories: 206, category: 'Protein' },
  { id: 18, name: 'Beef (100g)', calories: 250, category: 'Protein' },
  { id: 19, name: 'Pork (100g)', calories: 242, category: 'Protein' },
  { id: 20, name: 'Tofu (100g)', calories: 76, category: 'Protein' },
  
  // Dairy
  { id: 30, name: 'Milk (1 cup)', calories: 149, category: 'Dairy' },
  { id: 31, name: 'Skim Milk (1 cup)', calories: 83, category: 'Dairy' },
  { id: 32, name: 'Yogurt (1 cup)', calories: 149, category: 'Dairy' },
  { id: 33, name: 'Greek Yogurt (1 cup)', calories: 100, category: 'Dairy' },
  { id: 34, name: 'Cheese (1 slice)', calories: 113, category: 'Dairy' },
  { id: 35, name: 'Cheddar Cheese (30g)', calories: 114, category: 'Dairy' },
  { id: 36, name: 'Butter (1 tbsp)', calories: 102, category: 'Dairy' },
  
  // Vegetables
  { id: 40, name: 'Potato (1 medium)', calories: 164, category: 'Vegetables' },
  { id: 41, name: 'Sweet Potato (1 medium)', calories: 112, category: 'Vegetables' },
  { id: 42, name: 'Carrot (1 medium)', calories: 25, category: 'Vegetables' },
  { id: 43, name: 'Broccoli (1 cup)', calories: 31, category: 'Vegetables' },
  { id: 44, name: 'Spinach (1 cup)', calories: 7, category: 'Vegetables' },
  { id: 45, name: 'Tomato (1 medium)', calories: 22, category: 'Vegetables' },
  { id: 46, name: 'Cucumber (1 cup)', calories: 16, category: 'Vegetables' },
  { id: 47, name: 'Onion (1 medium)', calories: 44, category: 'Vegetables' },
  { id: 48, name: 'Bell Pepper (1 medium)', calories: 24, category: 'Vegetables' },
  { id: 49, name: 'Lettuce (1 cup)', calories: 5, category: 'Vegetables' },
  
  // Fruits
  { id: 50, name: 'Apple (1 medium)', calories: 95, category: 'Fruits' },
  { id: 51, name: 'Banana (1 medium)', calories: 105, category: 'Fruits' },
  { id: 52, name: 'Orange (1 medium)', calories: 62, category: 'Fruits' },
  { id: 53, name: 'Mango (1 cup)', calories: 99, category: 'Fruits' },
  { id: 54, name: 'Grapes (1 cup)', calories: 104, category: 'Fruits' },
  { id: 55, name: 'Strawberries (1 cup)', calories: 49, category: 'Fruits' },
  { id: 56, name: 'Watermelon (1 cup)', calories: 46, category: 'Fruits' },
  { id: 57, name: 'Pineapple (1 cup)', calories: 82, category: 'Fruits' },
  { id: 58, name: 'Papaya (1 cup)', calories: 55, category: 'Fruits' },
  { id: 59, name: 'Avocado (1 medium)', calories: 234, category: 'Fruits' },
  
  // Fast Food
  { id: 60, name: 'Pizza (1 slice)', calories: 285, category: 'Fast Food' },
  { id: 61, name: 'Burger (regular)', calories: 354, category: 'Fast Food' },
  { id: 62, name: 'Cheeseburger', calories: 432, category: 'Fast Food' },
  { id: 63, name: 'Hot Dog', calories: 314, category: 'Fast Food' },
  { id: 64, name: 'French Fries (small)', calories: 222, category: 'Fast Food' },
  { id: 65, name: 'French Fries (medium)', calories: 365, category: 'Fast Food' },
  { id: 66, name: 'French Fries (large)', calories: 510, category: 'Fast Food' },
  { id: 67, name: 'Fried Rice (1 cup)', calories: 228, category: 'Fast Food' },
  { id: 68, name: 'Noodles (1 cup)', calories: 221, category: 'Fast Food' },
  { id: 69, name: 'Pasta (1 cup)', calories: 221, category: 'Fast Food' },
  
  // Snacks
  { id: 70, name: 'Chips (small bag)', calories: 152, category: 'Snacks' },
  { id: 71, name: 'Popcorn (1 cup)', calories: 31, category: 'Snacks' },
  { id: 72, name: 'Nuts (1 oz)', calories: 164, category: 'Snacks' },
  { id: 73, name: 'Almonds (1 oz)', calories: 164, category: 'Snacks' },
  { id: 74, name: 'Peanuts (1 oz)', calories: 161, category: 'Snacks' },
  { id: 75, name: 'Cashews (1 oz)', calories: 157, category: 'Snacks' },
  { id: 76, name: 'Chocolate Bar', calories: 235, category: 'Snacks' },
  { id: 77, name: 'Cookie (1 piece)', calories: 49, category: 'Snacks' },
  { id: 78, name: 'Donut', calories: 269, category: 'Snacks' },
  { id: 79, name: 'Ice Cream (1 scoop)', calories: 137, category: 'Snacks' },
  
  // Beverages
  { id: 80, name: 'Coffee (black)', calories: 2, category: 'Beverages' },
  { id: 81, name: 'Coffee with Milk', calories: 38, category: 'Beverages' },
  { id: 82, name: 'Cappuccino', calories: 120, category: 'Beverages' },
  { id: 83, name: 'Latte', calories: 190, category: 'Beverages' },
  { id: 84, name: 'Tea (plain)', calories: 2, category: 'Beverages' },
  { id: 85, name: 'Tea with Milk & Sugar', calories: 47, category: 'Beverages' },
  { id: 86, name: 'Orange Juice (1 cup)', calories: 112, category: 'Beverages' },
  { id: 87, name: 'Apple Juice (1 cup)', calories: 114, category: 'Beverages' },
  { id: 88, name: 'Soda (12 oz can)', calories: 140, category: 'Beverages' },
  { id: 89, name: 'Energy Drink (1 can)', calories: 110, category: 'Beverages' },
  
  // South Asian Foods
  { id: 90, name: 'Daal (1 cup)', calories: 230, category: 'Main Dish' },
  { id: 91, name: 'Curry (1 cup)', calories: 206, category: 'Main Dish' },
  { id: 92, name: 'Biryani (1 cup)', calories: 290, category: 'Main Dish' },
  { id: 93, name: 'Samosa (1 piece)', calories: 262, category: 'Snacks' },
  { id: 94, name: 'Paratha (1 piece)', calories: 210, category: 'Grains' },
  { id: 95, name: 'Idli (1 piece)', calories: 39, category: 'Grains' },
  { id: 96, name: 'Dosa (1 piece)', calories: 168, category: 'Grains' },
  { id: 97, name: 'Vada (1 piece)', calories: 145, category: 'Snacks' },
  { id: 98, name: 'Pakora (1 piece)', calories: 67, category: 'Snacks' },
  { id: 99, name: 'Puri (1 piece)', calories: 81, category: 'Grains' },
  
  // Desserts
  { id: 100, name: 'Cake (1 slice)', calories: 367, category: 'Desserts' },
  { id: 101, name: 'Brownie', calories: 227, category: 'Desserts' },
  { id: 102, name: 'Pudding (1 cup)', calories: 297, category: 'Desserts' },
  { id: 103, name: 'Pie (1 slice)', calories: 296, category: 'Desserts' },
  { id: 104, name: 'Gulab Jamun (1 piece)', calories: 175, category: 'Desserts' },
  { id: 105, name: 'Rasgulla (1 piece)', calories: 106, category: 'Desserts' },
  { id: 106, name: 'Jalebi (100g)', calories: 446, category: 'Desserts' },
  { id: 107, name: 'Halwa (1 cup)', calories: 412, category: 'Desserts' },
];

// Get all unique categories
export const FOOD_CATEGORIES = [...new Set(FOOD_DATABASE.map(food => food.category))].sort();

// Search foods by name
export const searchFoods = (query) => {
  if (!query || query.trim() === '') return FOOD_DATABASE;
  
  const lowerQuery = query.toLowerCase();
  return FOOD_DATABASE.filter(food => 
    food.name.toLowerCase().includes(lowerQuery)
  );
};

// Filter foods by category
export const filterByCategory = (category) => {
  if (!category || category === 'All') return FOOD_DATABASE;
  return FOOD_DATABASE.filter(food => food.category === category);
};

// Get food by ID
export const getFoodById = (id) => {
  return FOOD_DATABASE.find(food => food.id === id);
};
