import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../store/AppContext';
import { useTheme } from '../theme';

export default function MoodScreen({ navigation }) {
  const { addMood, moodEntries } = useApp();
  const theme = useTheme();
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');

  function saveMood() {
    if (selected) {
      addMood(selected, note);
      setSelected(null);
      setNote('');
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>How do you feel?</Text>
      <View style={styles.row}>
        {[1,2,3,4,5].map(v => (
          <Ionicons
            key={v}
            name={v <= (selected||0) ? 'happy' : 'happy-outline'}
            size={40}
            color={v <= (selected||0) ? theme.colors.secondary : theme.colors.textMuted}
            onPress={() => setSelected(v)}
          />
        ))}
      </View>
      <TextInput
        placeholder="Add a note (optional)"
        placeholderTextColor={theme.colors.textMuted}
        value={note}
        onChangeText={setNote}
        style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]}
        multiline
      />
      <PrimaryButton label="Save Mood" onPress={saveMood} />
      <PrimaryButton label="View History" variant="secondary" onPress={() => navigation.navigate('MoodHistory')} />
      <View style={styles.latestWrap}>
        <Text style={[styles.subHeading, { color: theme.colors.text }]}>Recent Entries</Text>
        {moodEntries.slice(-3).reverse().map(m => (
          <View key={m.id} style={[styles.entry, { borderColor: theme.colors.border }]}>
            <Text style={[styles.entryText, { color: theme.colors.text }]}>Mood {m.value} • {new Date(m.date).toLocaleDateString()}</Text>
          </View>
        ))}
        {!moodEntries.length && <Text style={[styles.muted, { color: theme.colors.textMuted }]}>No mood entries yet.</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 80, textAlignVertical: 'top', marginBottom: 12 },
  latestWrap: { marginTop: 24, gap: 8 },
  subHeading: { fontSize: 18, fontWeight: '600' },
  entry: { paddingVertical: 6, borderBottomWidth: 1 },
  entryText: { fontSize: 14 },
  muted: { fontSize: 14 }
});
