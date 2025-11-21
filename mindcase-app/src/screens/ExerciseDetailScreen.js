import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme';

export default function ExerciseDetailScreen({ route }) {
  const { exercise } = route.params || { exercise: null };
  const theme = useTheme();
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {exercise ? (
        <>
          <Text style={[styles.title, { color: theme.colors.text }]}>{exercise.title}</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{exercise.description}</Text>
        </>
      ) : (
        <Text style={{ color: theme.colors.textMuted }}>No exercise data passed.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  body: { fontSize: 16, lineHeight: 24 }
});
