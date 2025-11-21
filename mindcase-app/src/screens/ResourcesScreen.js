import React from 'react';
import { View, Text, StyleSheet, Linking, Pressable } from 'react-native';
import { useTheme } from '../theme';

const resources = [
  { id: 'res-1', title: 'Mindfulness Basics', url: 'https://www.mindful.org/meditation/mindfulness-getting-started/' },
  { id: 'res-2', title: 'Breathing Exercises', url: 'https://www.healthline.com/health/breathing-exercise' },
  { id: 'res-3', title: 'Managing Stress', url: 'https://www.who.int/news-room/questions-and-answers/item/stress' }
];

export default function ResourcesScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>Resources</Text>
      {resources.map(r => (
        <Pressable key={r.id} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={() => Linking.openURL(r.url)}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{r.title}</Text>
          <Text style={[styles.url, { color: theme.colors.secondary }]}>{r.url}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12, gap: 4, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  title: { fontSize: 16, fontWeight: '600' },
  url: { fontSize: 12 }
});
