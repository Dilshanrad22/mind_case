import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../theme';
import {
  addFood,
  fetchTodayNutrition,
  updateSteps,
  deleteFood,
  fetchTodayFoods,
} from '../redux/slices/nutritionSlice';
import { FOOD_DATABASE, FOOD_CATEGORIES } from '../data/foodDatabase';

export default function FoodTrackerScreen({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const { todayNutrition, todayFoods, loading } = useSelector((state) => state.nutrition);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [stepsModalVisible, setStepsModalVisible] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [steps, setSteps] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredFoods, setFilteredFoods] = useState(FOOD_DATABASE);
  const [isCustomFood, setIsCustomFood] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let results = FOOD_DATABASE;
    
    if (selectedCategory !== 'All') {
      results = results.filter(food => food.category === selectedCategory);
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(food => 
        food.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredFoods(results);
  }, [searchQuery, selectedCategory]);

  const loadData = () => {
    dispatch(fetchTodayNutrition());
    dispatch(fetchTodayFoods());
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setFoodName(food.name);
    setCalories(food.calories.toString());
    setIsCustomFood(false);
  };

  const handleCustomFood = () => {
    setIsCustomFood(true);
    setSelectedFood(null);
    setFoodName('');
    setCalories('');
  };

  const handleAddFood = async () => {
    if (!foodName.trim() || !calories) {
      Alert.alert('Error', 'Please select a food or enter custom food details');
      return;
    }

    const caloriesNum = parseInt(calories);
    const quantityNum = parseInt(quantity) || 1;

    if (isNaN(caloriesNum) || caloriesNum <= 0) {
      Alert.alert('Error', 'Please enter valid calories');
      return;
    }

    await dispatch(addFood({
      name: foodName,
      calories: caloriesNum,
      quantity: quantityNum,
    }));

    // Reset form
    setFoodName('');
    setCalories('');
    setQuantity('1');
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedFood(null);
    setIsCustomFood(false);
    setModalVisible(false);
    loadData();
  };

  const handleUpdateSteps = async () => {
    const stepsNum = parseInt(steps);
    
    if (isNaN(stepsNum) || stepsNum < 0) {
      Alert.alert('Error', 'Please enter valid steps');
      return;
    }

    // Add steps to existing total
    await dispatch(updateSteps({ steps: stepsNum, addToExisting: true }));
    setSteps('');
    setStepsModalVisible(false);
    loadData();
  };

  const handleDeleteFood = (foodId, foodName) => {
    Alert.alert(
      'Delete Food',
      `Are you sure you want to delete "${foodName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteFood(foodId));
            loadData();
          },
        },
      ]
    );
  };

  const getTotalCalories = () => todayNutrition?.totalCalories || 0;
  const getStepsWalked = () => todayNutrition?.stepsWalked || 0;
  const getCaloriesBurned = () => todayNutrition?.caloriesBurned || 0;
  const getRemainingCalories = () => todayNutrition?.remainingCalories || 0;
  const getStepsNeeded = () => todayNutrition?.stepsNeeded || 0;

  const resetModal = () => {
    setFoodName('');
    setCalories('');
    setQuantity('1');
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedFood(null);
    setIsCustomFood(false);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="nutrition" size={32} color="#fff" />
          <Text style={styles.headerTitle}>Food Tracker</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Remaining Calories - Main Card */}
        <LinearGradient
          colors={['#11998e', '#38ef7d']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainStatCard}
        >
          <Ionicons name="analytics" size={36} color="#fff" />
          <Text style={styles.mainStatValue}>{getRemainingCalories()}</Text>
          <Text style={styles.mainStatLabel}>Remaining Calories</Text>
        </LinearGradient>

        {/* Daily Summary Cards */}
        <View style={styles.statsContainer}>
          {/* Calories Card */}
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <Ionicons name="flame" size={32} color="#fff" />
            <Text style={styles.statValue}>{getTotalCalories()}</Text>
            <Text style={styles.statLabel}>Calories Eaten</Text>
          </LinearGradient>

          {/* Steps Card */}
          <LinearGradient
            colors={['#4E54C8', '#8F94FB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <Ionicons name="footsteps" size={32} color="#fff" />
            <Text style={styles.statValue}>{getStepsWalked()}</Text>
            <Text style={styles.statLabel}>Steps Walked</Text>
          </LinearGradient>
        </View>

        {/* Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.progressTitle, { color: theme.colors.text }]}>
            Today's Progress
          </Text>

          <View style={styles.progressRow}>
            <Ionicons name="flame-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
              Calories Burned:
            </Text>
            <Text style={[styles.progressValue, { color: theme.colors.primary }]}>
              {getCaloriesBurned()} kcal
            </Text>
          </View>

          <View style={styles.progressRow}>
            <Ionicons name="walk-outline" size={20} color="#FF6B6B" />
            <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
              Steps Needed:
            </Text>
            <Text style={[styles.progressValue, { color: '#FF6B6B' }]}>
              {getStepsNeeded()} steps
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Add Food</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, { backgroundColor: theme.colors.accent }]}
            onPress={() => setStepsModalVisible(true)}
          >
            <Ionicons name="footsteps" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Log Steps</Text>
          </Pressable>
        </View>

        {/* Foods List */}
        <View style={styles.foodsList}>
          <View style={styles.foodsHeader}>
            <Text style={[styles.foodsTitle, { color: theme.colors.text }]}>
              Today's Foods
            </Text>
            <Pressable onPress={() => navigation.navigate('NutritionHistory')}>
              <Text style={[styles.viewWeeklyText, { color: theme.colors.primary }]}>
                View Weekly
              </Text>
            </Pressable>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : todayFoods && todayFoods.length > 0 ? (
            todayFoods.map((food) => (
              <View
                key={food._id}
                style={[styles.foodItem, { backgroundColor: theme.colors.surface }]}
              >
                <View style={styles.foodInfo}>
                  <Text style={[styles.foodName, { color: theme.colors.text }]}>
                    {food.name}
                  </Text>
                  <Text style={[styles.foodDetails, { color: theme.colors.textSecondary }]}>
                    {food.calories * food.quantity} kcal × {food.quantity}
                  </Text>
                </View>
                <Pressable onPress={() => handleDeleteFood(food._id, food.name)}>
                  <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No foods added today. Tap "Add Food" to start tracking!
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Add Food Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={resetModal}
      >
        <View style={[styles.fullScreenModal, { backgroundColor: theme.colors.background }]}>
          {/* Modal Header */}
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalHeader}
          >
            <Pressable onPress={resetModal}>
              <Ionicons name="close" size={28} color="#fff" />
            </Pressable>
            <Text style={styles.modalHeaderTitle}>Add Food</Text>
            <View style={{ width: 28 }} />
          </LinearGradient>

          <View style={styles.modalBody}>
            {!isCustomFood && !selectedFood ? (
              <>
                {/* Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
                  <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
                  <TextInput
                    style={[styles.searchInput, { color: theme.colors.text }]}
                    placeholder="Search foods..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {/* Category Filter */}
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoryScroll}
                  contentContainerStyle={styles.categoryContainer}
                >
                  <Pressable
                    style={[
                      styles.categoryChip,
                      selectedCategory === 'All' && { backgroundColor: theme.colors.primary },
                      { borderColor: theme.colors.border }
                    ]}
                    onPress={() => setSelectedCategory('All')}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      { color: selectedCategory === 'All' ? '#fff' : theme.colors.text }
                    ]}>
                      All
                    </Text>
                  </Pressable>
                  {FOOD_CATEGORIES.map((category) => (
                    <Pressable
                      key={category}
                      style={[
                        styles.categoryChip,
                        selectedCategory === category && { backgroundColor: theme.colors.primary },
                        { borderColor: theme.colors.border }
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text style={[
                        styles.categoryChipText,
                        { color: selectedCategory === category ? '#fff' : theme.colors.text }
                      ]}>
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>

                {/* Food List */}
                <FlatList
                  data={filteredFoods}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.foodFlatList}
                  renderItem={({ item }) => (
                    <Pressable
                      style={[styles.foodListItem, { backgroundColor: theme.colors.surface }]}
                      onPress={() => handleSelectFood(item)}
                    >
                      <View style={styles.foodListItemContent}>
                        <Text style={[styles.foodListItemName, { color: theme.colors.text }]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.foodListItemCalories, { color: theme.colors.primary }]}>
                          {item.calories} cal
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                    </Pressable>
                  )}
                  ListEmptyComponent={
                    <Text style={[styles.emptyListText, { color: theme.colors.textSecondary }]}>
                      No foods found. Try a different search.
                    </Text>
                  }
                  ListFooterComponent={
                    <Pressable
                      style={[styles.customFoodButton, { backgroundColor: theme.colors.accent }]}
                      onPress={handleCustomFood}
                    >
                      <Ionicons name="add-circle-outline" size={24} color="#fff" />
                      <Text style={styles.customFoodButtonText}>Add Custom Food</Text>
                    </Pressable>
                  }
                />
              </>
            ) : (
              <ScrollView style={styles.formScrollView}>
                {/* Selected Food or Custom Food Form */}
                <View style={styles.formContainer}>
                  {selectedFood && (
                    <Pressable
                      style={styles.changeButton}
                      onPress={() => {
                        setSelectedFood(null);
                        setIsCustomFood(false);
                        setFoodName('');
                        setCalories('');
                      }}
                    >
                      <Text style={[styles.changeButtonText, { color: theme.colors.primary }]}>
                        ← Change Food
                      </Text>
                    </Pressable>
                  )}

                  {isCustomFood && (
                    <Pressable
                      style={styles.changeButton}
                      onPress={() => {
                        setIsCustomFood(false);
                        setFoodName('');
                        setCalories('');
                      }}
                    >
                      <Text style={[styles.changeButtonText, { color: theme.colors.primary }]}>
                        ← Back to Food List
                      </Text>
                    </Pressable>
                  )}

                  <Text style={[styles.formLabel, { color: theme.colors.text }]}>Food Name</Text>
                  <TextInput
                    style={[styles.formInput, { 
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border 
                    }]}
                    placeholder="Enter food name"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={foodName}
                    onChangeText={setFoodName}
                    editable={isCustomFood}
                  />

                  <Text style={[styles.formLabel, { color: theme.colors.text }]}>Calories per serving</Text>
                  <TextInput
                    style={[styles.formInput, { 
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border 
                    }]}
                    placeholder="Enter calories"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="numeric"
                    editable={isCustomFood}
                  />

                  <Text style={[styles.formLabel, { color: theme.colors.text }]}>Quantity</Text>
                  <TextInput
                    style={[styles.formInput, { 
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: theme.colors.border 
                    }]}
                    placeholder="How many servings?"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                  />

                  {/* Total Calories Display */}
                  {calories && quantity && (
                    <View style={[styles.totalCaloriesBox, { backgroundColor: theme.colors.primary + '15' }]}>
                      <Text style={[styles.totalCaloriesLabel, { color: theme.colors.textSecondary }]}>
                        Total Calories:
                      </Text>
                      <Text style={[styles.totalCaloriesValue, { color: theme.colors.primary }]}>
                        {(parseInt(calories) || 0) * (parseInt(quantity) || 0)} cal
                      </Text>
                    </View>
                  )}

                  <Pressable
                    style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleAddFood}
                  >
                    <Text style={styles.addButtonText}>Add to Today</Text>
                  </Pressable>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Update Steps Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={stepsModalVisible}
        onRequestClose={() => setStepsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Add Steps</Text>
            
            <Text style={[styles.currentStepsText, { color: theme.colors.textSecondary }]}>
              Current total: {getStepsWalked()} steps
            </Text>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border 
              }]}
              placeholder="Enter steps to add"
              placeholderTextColor={theme.colors.textSecondary}
              value={steps}
              onChangeText={setSteps}
              keyboardType="numeric"
            />
            
            {steps && !isNaN(parseInt(steps)) && (
              <Text style={[styles.newTotalText, { color: theme.colors.primary }]}>
                New total: {getStepsWalked() + parseInt(steps)} steps
              </Text>
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setStepsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.colors.accent }]}
                onPress={handleUpdateSteps}
              >
                <Text style={styles.modalButtonText}>Update</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  mainStatCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  mainStatValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  mainStatLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  progressCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  progressLabel: {
    flex: 1,
    fontSize: 14,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  foodsList: {
    marginBottom: 20,
  },
  foodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  foodsTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  viewWeeklyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  foodDetails: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
  },
  fullScreenModal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoryScroll: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoryContainer: {
    paddingRight: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  foodFlatList: {
    flex: 1,
  },
  foodListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  foodListItemContent: {
    flex: 1,
  },
  foodListItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  foodListItemCalories: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 40,
  },
  customFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 30,
    gap: 8,
  },
  customFoodButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formScrollView: {
    flex: 1,
  },
  formContainer: {
    paddingBottom: 40,
  },
  changeButton: {
    marginBottom: 20,
  },
  changeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  totalCaloriesBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  totalCaloriesLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalCaloriesValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  currentStepsText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  newTotalText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
});
