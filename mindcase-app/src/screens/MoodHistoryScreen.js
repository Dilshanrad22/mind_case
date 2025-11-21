import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useApp } from '../store/AppContext';
import { useTheme } from '../theme';

export default function MoodHistoryScreen() {
  const { moodEntries } = useApp();
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>Mood History</Text>
      <FlatList
        data={moodEntries.slice().reverse()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, { borderColor: theme.colors.border }]}>
            <Text style={[styles.value, { color: theme.colors.text }]}>Mood: {item.value}</Text>
            <Text style={[styles.note, { color: theme.colors.textSecondary }]}>{item.note || 'No note'}</Text>
            <Text style={[styles.date, { color: theme.colors.textMuted }]}>{new Date(item.date).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: theme.colors.textMuted }}>No mood entries yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  item: { paddingVertical: 12, borderBottomWidth: 1, gap: 4 },
  value: { fontSize: 16, fontWeight: '600' },
  note: { fontSize: 14 },
  date: { fontSize: 12 }
});
