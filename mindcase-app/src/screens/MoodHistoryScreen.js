import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Pressable, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { fetchMoods, deleteMood } from '../redux/slices/moodSlice';

// Mood type to icon and color mapping (same as MoodScreen)
const moodConfig = {
  happy: { icon: 'happy', color: '#FFD700' },
  sad: { icon: 'sad', color: '#6495ED' },
  angry: { icon: 'flame', color: '#FF6347' },
  anxious: { icon: 'alert-circle', color: '#FFA500' },
  calm: { icon: 'leaf', color: '#98FB98' },
  excited: { icon: 'sparkles', color: '#FF69B4' },
  neutral: { icon: 'remove-circle', color: '#D3D3D3' },
  stressed: { icon: 'warning', color: '#DC143C' },
  tired: { icon: 'moon', color: '#4B0082' },
  motivated: { icon: 'rocket', color: '#00CED1' },
};

export default function MoodHistoryScreen() {
  const dispatch = useDispatch();
  const { entries, loading } = useSelector((state) => state.mood);
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadMoods();
  }, []);

  // Reload moods when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadMoods();
    }, [])
  );

  const loadMoods = async () => {
    try {
      await dispatch(fetchMoods()).unwrap();
    } catch (error) {
      console.error('Failed to load moods:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMoods();
    setRefreshing(false);
  };

  const handleDelete = (id, moodType) => {
    Alert.alert(
      'Delete Mood',
      `Delete this ${moodType} mood entry?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMood(id)).unwrap();
              await loadMoods(); // Reload moods to reflect changes
              Alert.alert('Success', 'Mood entry deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete mood entry');
            }
          },
        },
      ]
    );
  };

  if (loading && !entries.length) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>Mood History</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        renderItem={({ item }) => {
          const config = moodConfig[item.moodType] || { icon: 'help-circle', color: theme.colors.primary };
          return (
            <View style={[styles.item, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.iconCircle, { backgroundColor: config.color + '20' }]}>
                  <Ionicons name={config.icon} size={24} color={config.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.value, { color: theme.colors.text }]}>
                    {item.moodType.charAt(0).toUpperCase() + item.moodType.slice(1)}
                  </Text>
                  <Text style={[styles.date, { color: theme.colors.textMuted }]}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>
              <Pressable onPress={() => handleDelete(item._id, item.moodType)}>
                <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
              </Pressable>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.colors.textMuted }]}>No mood entries yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  item: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  date: { fontSize: 12 },
  empty: { fontSize: 14, textAlign: 'center', marginTop: 24 }
});
