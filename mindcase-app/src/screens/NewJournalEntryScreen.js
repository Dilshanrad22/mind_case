import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PrimaryButton from '../components/PrimaryButton';
import { useTheme } from '../theme';
import { createJournal } from '../redux/slices/journalSlice';

export default function NewJournalEntryScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.journal);
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const save = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a title for your journal entry');
      return;
    }

    if (!body.trim()) {
      Alert.alert('Required', 'Please enter some content for your journal entry');
      return;
    }

    try {
      await dispatch(createJournal({ title: title.trim(), text: body.trim() })).unwrap();
      Alert.alert('Success', 'Journal entry created successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error || 'Failed to create journal entry');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>New Journal Entry</Text>
      <TextInput 
        placeholder="Title" 
        placeholderTextColor={theme.colors.textMuted}
        value={title} 
        onChangeText={setTitle} 
        style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]} 
        editable={!loading}
      />
      <TextInput 
        placeholder="Write your thoughts here..." 
        placeholderTextColor={theme.colors.textMuted}
        value={body} 
        onChangeText={setBody} 
        style={[styles.input, styles.bodyInput, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text }]} 
        multiline 
        editable={!loading}
      />
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <PrimaryButton label="Save" onPress={save} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  heading: { fontSize: 22, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12 },
  bodyInput: { height: 160, textAlignVertical: 'top' }
});
