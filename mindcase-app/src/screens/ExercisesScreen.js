import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, TextInput, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useApp } from '../store/AppContext';
import { useTheme } from '../theme';
import { fetchExercises } from '../services/exercisesApi';
import { toggleFavorite } from '../redux/slices/favoritesSlice';
import { imageForExercise } from '../services/exerciseImages';

const resources = [
  { id: 'res-1', title: 'Mindfulness Basics', url: 'https://www.mindful.org/meditation/mindfulness-getting-started/', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&w=300&q=60' },
  { id: 'res-2', title: 'Breathing Exercises', url: 'https://www.healthline.com/health/breathing-exercise', image: 'https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&w=300&q=60' },
  { id: 'res-3', title: 'Managing Stress', url: 'https://www.who.int/news-room/questions-and-answers/item/stress', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&w=300&q=60' }
];

export default function ExercisesScreen({ navigation }) {
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.favorites.items);
  const { exercises: fallback } = useApp();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [muscle, setMuscle] = useState('');
  const [type, setType] = useState('');
  const [apiUnavailable, setApiUnavailable] = useState(false);

  const isFavorite = (exercise) => {
    return favoriteItems.some(item => 
      (item.name || item.title) === (exercise.name || exercise.title)
    );
  };

  const handleToggleFavorite = (exercise) => {
    dispatch(toggleFavorite(exercise));
  };

  async function load() {
    setLoading(true); setError(null);
    setApiUnavailable(false);
    try {
      const { data: apiData } = await fetchExercises({ muscle, type });
      setData(apiData);
    } catch (e) {
      // Suppress known free-tier downtime error and show fallback silently
      if (/Exercises API temporarily unavailable/i.test(e.message)) {
        setApiUnavailable(true);
        setError(null);
        setData([]); // will fall back to local sample list
      } else {
        setError(e.message);
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // initial

  const listData = data.length ? data : fallback;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.heading, { color: theme.colors.text }]}>Exercises</Text>
        <Pressable 
          style={[styles.favoritesBtn, { backgroundColor: theme.colors.secondary }]} 
          onPress={() => navigation.navigate('Favorites')}
        >
          <Ionicons name="heart" size={18} color="#fff" />
          <Text style={styles.favoritesBtnText}>My Favorites</Text>
        </Pressable>
      </View>
      <View style={styles.filters}>
        <TextInput 
          placeholder="Muscle (e.g. chest)" 
          placeholderTextColor={theme.colors.textMuted}
          value={muscle} 
          onChangeText={setMuscle} 
          style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]} 
        />
        <TextInput 
          placeholder="Type (e.g. stretching)" 
          placeholderTextColor={theme.colors.textMuted}
          value={type} 
          onChangeText={setType} 
          style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]} 
        />
        <Pressable style={[styles.reloadBtn, { backgroundColor: theme.colors.primary }]} onPress={load}>
          <Text style={[styles.reloadText, { color: theme.colors.textOnPrimary }]}>Search</Text>
        </Pressable>
      </View>
      {loading && <ActivityIndicator size="large" color={theme.colors.secondary} style={{ marginVertical: 16 }} />}
      {error && <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text>}
      {apiUnavailable && !error && (
        <Text style={[styles.banner, { backgroundColor: theme.colors.surface, color: theme.colors.textSecondary, borderColor: theme.colors.border }]}>Live exercise API unavailable for free tier. Showing sample exercises.</Text>
      )}
      <FlatList
        data={listData}
        keyExtractor={(item, idx) => item.id ? item.id.toString() : `${item.name || item.title}-${idx}`}
        renderItem={({ item }) => {
          const normalizedItem = normalizeItem(item);
          const favorite = isFavorite(normalizedItem);
          return (
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Pressable style={styles.cardContent} onPress={() => navigation.navigate('ExerciseDetail', { exercise: normalizedItem })}>
                <View style={styles.cardTextContainer}>
                  {normalizedItem.image && (
                    <Image source={{ uri: normalizedItem.image }} style={styles.thumbnail} />
                  )}
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{normalizedItem.title || normalizedItem.name}</Text>
                  <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]}>{normalizedItem.description || 'No description'}</Text>
                </View>
              </Pressable>
              <Pressable 
                style={styles.favoriteBtn} 
                onPress={() => handleToggleFavorite(normalizedItem)}
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
        ListEmptyComponent={!loading && !error && <Text style={[styles.muted, { color: theme.colors.textMuted }]}>No exercises found.</Text>}
        ListFooterComponent={
          <View style={styles.resourcesSection}>
            <View style={styles.resourcesHeader}>
              <Ionicons name="library" size={24} color={theme.colors.secondary} />
              <Text style={[styles.resourcesTitle, { color: theme.colors.text }]}>Wellness Resources</Text>
            </View>
            {resources.map(r => (
              <Pressable 
                key={r.id} 
                style={[styles.resourceCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
                onPress={() => Linking.openURL(r.url)}
              >
                <View style={styles.resourceContent}>
                  {r.image ? (
                    <Image source={{ uri: r.image }} style={styles.resourceImage} />
                  ) : (
                    <Ionicons name="link" size={20} color={theme.colors.primary} />
                  )}
                  <View style={styles.resourceText}>
                    <Text style={[styles.resourceTitle, { color: theme.colors.text }]}>{r.title}</Text>
                    <Text style={[styles.resourceUrl, { color: theme.colors.textSecondary }]} numberOfLines={1}>{r.url}</Text>
                  </View>
                </View>
                <Ionicons name="arrow-forward" size={20} color={theme.colors.textSecondary} />
              </Pressable>
            ))}
          </View>
        }
      />
    </View>
  );
}

function normalizeItem(item) {
  // If item already in desired shape (fallback entries) ensure image presence
  if (item.title) {
    return { ...item, image: item.image || imageForExercise(item) };
  }
  const normalized = { id: item.id || item.name, title: item.name, description: item.instructions || item.description || '' };
  return { ...normalized, image: imageForExercise({ ...normalized, muscle: item.muscle, type: item.type }) };
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heading: { fontSize: 22, fontWeight: '600' },
  favoritesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  favoritesBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  filters: { marginBottom: 12, gap: 8 },
  input: { padding: 12, borderRadius: 8, borderWidth: 1 },
  reloadBtn: { padding: 14, borderRadius: 8, alignItems: 'center' },
  reloadText: { fontWeight: '600' },
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
  thumbnail: { width: 60, height: 60, borderRadius: 8, marginBottom: 6, alignSelf: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardDesc: { fontSize: 14 },
  favoriteBtn: {
    padding: 8,
  },
  error: { marginBottom: 12, fontWeight: '600' },
  banner: { marginBottom: 12, fontSize: 13, padding: 10, borderWidth: 1, borderRadius: 8 },
  muted: { fontSize: 14, textAlign: 'center', marginTop: 16 },
  resourcesSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  resourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  resourcesTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  resourceCard: {
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
    elevation: 2,
  },
  resourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  resourceText: {
    flex: 1,
    gap: 4,
  },
  resourceTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  resourceUrl: {
    fontSize: 12,
  },
  resourceImage: { width: 48, height: 48, borderRadius: 10, objectFit: 'cover' },
});
