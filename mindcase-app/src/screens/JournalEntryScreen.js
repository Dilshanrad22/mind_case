import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme';

export default function JournalEntryScreen({ route }) {
  const { entry } = route.params || { entry: null };
  const theme = useTheme();
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {entry ? (
        <>
          <Text style={[styles.title, { color: theme.colors.text }]}>{entry.title}</Text>
          <Text style={[styles.date, { color: theme.colors.textMuted }]}>{new Date(entry.date).toLocaleString()}</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{entry.body}</Text>
        </>
      ) : (
        <Text style={{ color: theme.colors.textMuted }}>No entry data passed.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  date: { fontSize: 14, marginBottom: 16 },
  body: { fontSize: 16, lineHeight: 24 }
});
