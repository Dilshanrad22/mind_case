import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { useApp } from '../store/AppContext';
import { useTheme } from '../theme';
import { fetchExercises } from '../services/exercisesApi';

export default function ExercisesScreen({ navigation }) {
  const { exercises: fallback } = useApp();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [muscle, setMuscle] = useState('');
  const [type, setType] = useState('');

  async function load() {
    setLoading(true); setError(null);
    try {
      const { data: apiData } = await fetchExercises({ muscle, type });
      setData(apiData);
    } catch (e) {
      setError(e.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // initial

  const listData = data.length ? data : fallback;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>Exercises</Text>
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
      <FlatList
        data={listData}
        keyExtractor={(item, idx) => item.id ? item.id.toString() : `${item.name || item.title}-${idx}`}
        renderItem={({ item }) => (
          <Pressable style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={() => navigation.navigate('ExerciseDetail', { exercise: normalizeItem(item) })}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{item.title || item.name}</Text>
            <Text style={[styles.cardDesc, { color: theme.colors.textSecondary }]}>{item.description || item.instructions || 'No description'}</Text>
          </Pressable>
        )}
        ListEmptyComponent={!loading && !error && <Text style={[styles.muted, { color: theme.colors.textMuted }]}>No exercises found.</Text>}
      />
    </View>
  );
}

function normalizeItem(item) {
  if (item.title) return item;
  return { id: item.id || item.name, title: item.name, description: item.instructions || item.description || '' };
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  filters: { marginBottom: 12, gap: 8 },
  input: { padding: 12, borderRadius: 8, borderWidth: 1 },
  reloadBtn: { padding: 14, borderRadius: 8, alignItems: 'center' },
  reloadText: { fontWeight: '600' },
  card: { padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, gap: 4 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardDesc: { fontSize: 14 },
  error: { marginBottom: 12, fontWeight: '600' },
  muted: { fontSize: 14, textAlign: 'center', marginTop: 16 }
});
