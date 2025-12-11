import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput, Modal } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { deleteJournal, updateJournal } from '../redux/slices/journalSlice';
import PrimaryButton from '../components/PrimaryButton';

export default function JournalEntryScreen({ route, navigation }) {
  const { entry } = route.params || { entry: null };
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(entry?.entry?.title || '');
  const [editText, setEditText] = useState(entry?.entry?.text || '');

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteJournal(entry._id)).unwrap();
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete journal entry');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    setEditTitle(entry?.entry?.title || '');
    setEditText(entry?.entry?.text || '');
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      Alert.alert('Required', 'Please enter a title');
      return;
    }

    if (!editText.trim()) {
      Alert.alert('Required', 'Please enter some content');
      return;
    }

    try {
      await dispatch(updateJournal({ 
        id: entry._id, 
        title: editTitle.trim(), 
        text: editText.trim() 
      })).unwrap();
      
      setIsEditing(false);
      
      Alert.alert(
        'Success', 
        'Journal updated successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error || 'Failed to update journal');
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(entry?.entry?.title || '');
    setEditText(entry?.entry?.text || '');
    setIsEditing(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16, marginRight: 16 }}>
          {!isEditing && (
            <Pressable onPress={handleEdit}>
              <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
            </Pressable>
          )}
          <Pressable onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color={theme.colors.danger} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, entry, isEditing]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {entry ? (
        isEditing ? (
          // Edit Mode
          <>
            <Text style={[styles.label, { color: theme.colors.text }]}>Title</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: theme.colors.border, 
                backgroundColor: theme.colors.surface, 
                color: theme.colors.text 
              }]}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Enter title"
              placeholderTextColor={theme.colors.textMuted}
            />
            
            <Text style={[styles.label, { color: theme.colors.text }]}>Content</Text>
            <TextInput
              style={[styles.input, styles.textArea, { 
                borderColor: theme.colors.border, 
                backgroundColor: theme.colors.surface, 
                color: theme.colors.text 
              }]}
              value={editText}
              onChangeText={setEditText}
              placeholder="Write your thoughts..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />

            <View style={styles.buttonRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <PrimaryButton label="Cancel" onPress={handleCancelEdit} variant="secondary" />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <PrimaryButton label="Save Changes" onPress={handleSaveEdit} />
              </View>
            </View>
          </>
        ) : (
          // View Mode
          <>
            <Text style={[styles.title, { color: theme.colors.text }]}>{entry.entry?.title || 'Untitled'}</Text>
            <Text style={[styles.date, { color: theme.colors.textMuted }]}>
              {new Date(entry.createdAt).toLocaleString()}
            </Text>
            <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{entry.entry?.text || 'No content'}</Text>
          </>
        )
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
  body: { fontSize: 16, lineHeight: 24 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
