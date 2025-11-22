import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../theme';
import { toggleFavorite } from '../redux/slices/favoritesSlice';

export default function ExerciseDetailScreen({ route, navigation }) {
  const { exercise } = route.params || { exercise: null };
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items);
  const theme = useTheme();

  const isFavorite = () => {
    if (!exercise) return false;
    return favoriteItems.some(item => 
      (item.name || item.title) === (exercise.name || exercise.title)
    );
  };

  const handleToggleFavorite = () => {
    if (exercise) {
      dispatch(toggleFavorite(exercise));
    }
  };

  if (!exercise) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.textMuted} />
        <Text style={[styles.noDataText, { color: theme.colors.textMuted }]}>No exercise data available</Text>
      </View>
    );
  }

  const favorite = isFavorite();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Card */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerCard}
      >
        <View style={styles.headerContent}>
          <View style={styles.exerciseIconCircle}>
            <Ionicons name="fitness" size={40} color={theme.colors.textOnPrimary} />
          </View>
          <Text style={[styles.title, { color: theme.colors.textOnPrimary }]}>
            {exercise.title || exercise.name}
          </Text>
        </View>
        <Pressable 
          style={[styles.favoriteButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]} 
          onPress={handleToggleFavorite}
        >
          <Ionicons 
            name={favorite ? "heart" : "heart-outline"} 
            size={28} 
            color={favorite ? theme.colors.secondary : theme.colors.textOnPrimary} 
          />
        </Pressable>
      </LinearGradient>

      {/* Exercise Details */}
      <View style={styles.detailsContainer}>
        {/* Description Section */}
        {(exercise.description || exercise.instructions) && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Description</Text>
            </View>
            <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
              {exercise.description || exercise.instructions}
            </Text>
          </View>
        )}

        {/* Exercise Properties */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Details</Text>
          </View>
          
          {exercise.type && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Type:</Text>
              <View style={[styles.badge, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
                  {exercise.type}
                </Text>
              </View>
            </View>
          )}

          {exercise.muscle && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Target Muscle:</Text>
              <View style={[styles.badge, { backgroundColor: theme.colors.secondary + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.secondary }]}>
                  {exercise.muscle}
                </Text>
              </View>
            </View>
          )}

          {exercise.equipment && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Equipment:</Text>
              <View style={[styles.badge, { backgroundColor: theme.colors.info + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.info }]}>
                  {exercise.equipment}
                </Text>
              </View>
            </View>
          )}

          {exercise.difficulty && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Difficulty:</Text>
              <View style={[styles.badge, { backgroundColor: theme.colors.warning + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.warning }]}>
                  {exercise.difficulty}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Instructions Section */}
        {exercise.instructions && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="clipboard" size={24} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Instructions</Text>
            </View>
            <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
              {exercise.instructions}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  headerCard: {
    padding: 24,
    margin: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  exerciseIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800',
    textAlign: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 16,
    gap: 16,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  noDataText: {
    fontSize: 16,
    marginTop: 16,
  },
});
