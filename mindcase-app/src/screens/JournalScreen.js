import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../store/AppContext';
import { useTheme } from '../theme';

export default function JournalScreen({ navigation }) {
  const { journalEntries } = useApp();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>Journal</Text>
      <PrimaryButton label="New Entry" onPress={() => navigation.navigate('NewJournalEntry')} />
      <FlatList
        data={journalEntries.slice().reverse()}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => (
          <Pressable style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={() => navigation.navigate('JournalEntry', { entry: item })}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={[styles.cardDate, { color: theme.colors.textMuted }]}>{new Date(item.date).toLocaleString()}</Text>
            <Text numberOfLines={2} style={[styles.cardBody, { color: theme.colors.textSecondary }]}>{item.body || 'No body text'}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={[styles.muted, { color: theme.colors.textMuted }]}>No entries yet. Create one!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, gap: 4 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardDate: { fontSize: 12 },
  cardBody: { fontSize: 14 },
  muted: { fontSize: 14, marginTop: 12, textAlign: 'center' }
});
