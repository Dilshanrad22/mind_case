import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../store/AppContext';
import { useTheme } from '../theme';

export default function NewJournalEntryScreen({ navigation }) {
  const { addJournal } = useApp();
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  function save() {
    if (title.trim()) {
      addJournal(title, body);
      navigation.goBack();
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>New Journal Entry</Text>
      <TextInput 
        placeholder="Title" 
        placeholderTextColor={theme.colors.textMuted}
        value={title} 
        onChangeText={setTitle} 
        style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]} 
      />
      <TextInput 
        placeholder="Body" 
        placeholderTextColor={theme.colors.textMuted}
        value={body} 
        onChangeText={setBody} 
        style={[styles.input, styles.bodyInput, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]} 
        multiline 
      />
      <PrimaryButton label="Save" onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  heading: { fontSize: 22, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12 },
  bodyInput: { height: 160, textAlignVertical: 'top' }
});
