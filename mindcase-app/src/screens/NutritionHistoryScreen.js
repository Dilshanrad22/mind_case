import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../theme';
import { fetchWeeklyNutrition } from '../redux/slices/nutritionSlice';

const { width } = Dimensions.get('window');

export default function NutritionHistoryScreen({ navigation }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const { weeklyData, weeklyTotals, weeklyAverages, loading } = useSelector(
    (state) => state.nutrition
  );

  useEffect(() => {
    dispatch(fetchWeeklyNutrition());
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const getMaxCalories = () => {
    if (!weeklyData || weeklyData.length === 0) return 2000;
    return Math.max(...weeklyData.map(d => d.totalCalories || 0), 2000);
  };

  const getMaxSteps = () => {
    if (!weeklyData || weeklyData.length === 0) return 10000;
    return Math.max(...weeklyData.map(d => d.stepsWalked || 0), 10000);
  };

  const renderBarChart = (data, maxValue, color) => {
    const barWidth = (width - 80) / 7;
    
    return (
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const value = item || 0;
          const height = maxValue > 0 ? (value / maxValue) * 150 : 0;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(height, 2),
                      backgroundColor: color,
                      width: barWidth - 10,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barValue, { color: theme.colors.textSecondary }]}>
                {value > 0 ? (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value) : '-'}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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
          <Ionicons name="bar-chart" size={32} color="#fff" />
          <Text style={styles.headerTitle}>Weekly Summary</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weekly Totals */}
        {weeklyTotals && (
          <View style={styles.totalsContainer}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.totalCard}
            >
              <Ionicons name="flame" size={28} color="#fff" />
              <Text style={styles.totalValue}>
                {weeklyTotals.totalCalories.toLocaleString()}
              </Text>
              <Text style={styles.totalLabel}>Total Calories</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#4E54C8', '#8F94FB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.totalCard}
            >
              <Ionicons name="footsteps" size={28} color="#fff" />
              <Text style={styles.totalValue}>
                {weeklyTotals.totalSteps.toLocaleString()}
              </Text>
              <Text style={styles.totalLabel}>Total Steps</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#11998e', '#38ef7d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.totalCard}
            >
              <Ionicons name="fitness" size={28} color="#fff" />
              <Text style={styles.totalValue}>
                {weeklyTotals.totalCaloriesBurned.toLocaleString()}
              </Text>
              <Text style={styles.totalLabel}>Calories Burned</Text>
            </LinearGradient>
          </View>
        )}

        {/* Daily Averages */}
        {weeklyAverages && (
          <View style={[styles.averagesCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Daily Averages
            </Text>
            
            <View style={styles.averageRow}>
              <View style={styles.averageItem}>
                <Ionicons name="flame-outline" size={20} color="#FF6B6B" />
                <Text style={[styles.averageLabel, { color: theme.colors.textSecondary }]}>
                  Calories
                </Text>
                <Text style={[styles.averageValue, { color: theme.colors.text }]}>
                  {weeklyAverages.avgCalories}
                </Text>
              </View>

              <View style={styles.averageItem}>
                <Ionicons name="walk-outline" size={20} color="#4E54C8" />
                <Text style={[styles.averageLabel, { color: theme.colors.textSecondary }]}>
                  Steps
                </Text>
                <Text style={[styles.averageValue, { color: theme.colors.text }]}>
                  {weeklyAverages.avgSteps}
                </Text>
              </View>

              <View style={styles.averageItem}>
                <Ionicons name="fitness-outline" size={20} color="#11998e" />
                <Text style={[styles.averageLabel, { color: theme.colors.textSecondary }]}>
                  Burned
                </Text>
                <Text style={[styles.averageValue, { color: theme.colors.text }]}>
                  {weeklyAverages.avgCaloriesBurned}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Calories Chart */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Calories This Week
          </Text>
          {renderBarChart(
            weeklyData?.map(d => d.totalCalories) || [],
            getMaxCalories(),
            '#FF6B6B'
          )}
          <View style={styles.chartLabels}>
            {weeklyData?.map((day, index) => (
              <Text key={index} style={[styles.chartLabel, { color: theme.colors.textSecondary }]}>
                {new Date(day.date).getDate()}
              </Text>
            ))}
          </View>
        </View>

        {/* Steps Chart */}
        <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Steps This Week
          </Text>
          {renderBarChart(
            weeklyData?.map(d => d.stepsWalked) || [],
            getMaxSteps(),
            '#4E54C8'
          )}
          <View style={styles.chartLabels}>
            {weeklyData?.map((day, index) => (
              <Text key={index} style={[styles.chartLabel, { color: theme.colors.textSecondary }]}>
                {new Date(day.date).getDate()}
              </Text>
            ))}
          </View>
        </View>

        {/* Daily Details */}
        <View style={styles.dailyDetailsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Daily Details
          </Text>
          
          {weeklyData && weeklyData.length > 0 ? (
            weeklyData.slice().reverse().map((day) => (
              <View
                key={day._id}
                style={[styles.dayCard, { backgroundColor: theme.colors.surface }]}
              >
                <Text style={[styles.dayDate, { color: theme.colors.text }]}>
                  {formatDate(day.date)}
                </Text>
                
                <View style={styles.dayStats}>
                  <View style={styles.dayStat}>
                    <Ionicons name="restaurant" size={16} color="#FF6B6B" />
                    <Text style={[styles.dayStatLabel, { color: theme.colors.textSecondary }]}>
                      {day.totalCalories} cal
                    </Text>
                  </View>
                  
                  <View style={styles.dayStat}>
                    <Ionicons name="footsteps" size={16} color="#4E54C8" />
                    <Text style={[styles.dayStatLabel, { color: theme.colors.textSecondary }]}>
                      {day.stepsWalked} steps
                    </Text>
                  </View>
                  
                  <View style={styles.dayStat}>
                    <Ionicons name="flame" size={16} color="#11998e" />
                    <Text style={[styles.dayStatLabel, { color: theme.colors.textSecondary }]}>
                      {day.caloriesBurned} burned
                    </Text>
                  </View>
                </View>

                {day.foods && day.foods.length > 0 && (
                  <Text style={[styles.foodCount, { color: theme.colors.textSecondary }]}>
                    {day.foods.length} food{day.foods.length !== 1 ? 's' : ''} logged
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No data available for this week
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  totalsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  totalCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    textAlign: 'center',
  },
  averagesCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  averageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  averageItem: {
    alignItems: 'center',
    gap: 6,
  },
  averageLabel: {
    fontSize: 12,
  },
  averageValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 170,
    paddingTop: 20,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barValue: {
    fontSize: 10,
    marginTop: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  dailyDetailsContainer: {
    marginBottom: 20,
  },
  dayCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dayDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  dayStats: {
    flexDirection: 'row',
    gap: 20,
  },
  dayStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayStatLabel: {
    fontSize: 13,
  },
  foodCount: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
  },
});
