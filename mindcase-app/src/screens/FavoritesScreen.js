import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../theme';
import { toggleFavorite } from '../redux/slices/favoritesSlice';

export default function FavoritesScreen({ navigation }) {
  const dispatch = useDispatch();
  const favoriteExercises = useSelector((state) => state.favorites.items);
  const theme = useTheme();

  const isFavorite = (exercise) => {
    return favoriteExercises.some(item => 
      (item.name || item.title) === (exercise.name || exercise.title)
    );
  };

  const handleToggleFavorite = (exercise) => {
    dispatch(toggleFavorite(exercise));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>Favorite Exercises</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        {favoriteExercises.length} {favoriteExercises.length === 1 ? 'favorite' : 'favorites'}
      </Text>

      <FlatList
        data={favoriteExercises}
        keyExtractor={(item, idx) => `${item.name || item.title}-${idx}`}
        renderItem={({ item }) => {
          const favorite = isFavorite(item);
          return (
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Pressable 
                style={styles.cardContent} 
                onPress={() => navigation.navigate('Exercises', { 
                  screen: 'ExerciseDetail', 
                  params: { exercise: item } 
                })}
              >
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {item.title || item.name}
                  </Text>
                  <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                    {item.description || 'No description'}
                  </Text>
                </View>
              </Pressable>
              <Pressable 
                style={styles.favoriteBtn} 
                onPress={() => handleToggleFavorite(item)}
              >
                <Ionicons 
                  name={favorite ? "heart" : "heart-outline"} 
                  size={24} 
                  color={favorite ? theme.colors.secondary : theme.colors.textSecondary} 
                />
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color={theme.colors.textMuted} />
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
              No favorite exercises yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              Tap the heart icon on exercises to save them here
            </Text>
          </View>
        }
        contentContainerStyle={favoriteExercises.length === 0 && styles.emptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24 
  },
  heading: { 
    fontSize: 22, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    borderWidth: 1, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  cardTextContainer: {
    gap: 4,
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  cardDesc: { 
    fontSize: 14 
  },
  favoriteBtn: {
    padding: 8,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
