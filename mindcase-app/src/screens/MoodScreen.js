import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { useTheme } from '../theme';
import { createMood, fetchMoods, updateMood } from '../redux/slices/moodSlice';
import { MOOD_TYPES } from '../services/moodApi';

// Mood type to icon and color mapping
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

export default function MoodScreen({ navigation }) {
  const dispatch = useDispatch();
  const { entries, loading } = useSelector((state) => state.mood);
  const theme = useTheme();
  const [selected, setSelected] = useState(null);
  const [todaysMood, setTodaysMood] = useState(null);

  useEffect(() => {
    loadMoods();
  }, []);

  // Reload moods when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadMoods();
    }, [])
  );

  useEffect(() => {
    // Check if mood already exists for today
    checkTodaysMood();
  }, [entries]);

  useEffect(() => {
    // Set selected to today's mood if it exists
    if (todaysMood && !selected) {
      setSelected(todaysMood.moodType);
    }
  }, [todaysMood]);

  const checkTodaysMood = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const moodToday = entries.find((entry) => {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
    
    setTodaysMood(moodToday || null);
  };

  const loadMoods = async () => {
    try {
      await dispatch(fetchMoods()).unwrap();
    } catch (error) {
      console.error('Failed to load moods:', error);
    }
  };

  const saveMood = async () => {
    if (!selected) {
      Alert.alert('Required', 'Please select a mood');
      return;
    }

    try {
      // If mood already logged today, update it
      if (todaysMood) {
        if (todaysMood.moodType === selected) {
          Alert.alert('No Change', 'This is already your mood for today.');
          return;
        }
        
        Alert.alert(
          'Update Mood',
          `Change today's mood from "${todaysMood.moodType}" to "${selected}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Update',
              onPress: async () => {
                try {
                  await dispatch(updateMood({ id: todaysMood._id, moodType: selected })).unwrap();
                  await loadMoods(); // Reload moods to reflect changes
                  Alert.alert('Success', 'Mood updated successfully');
                } catch (error) {
                  Alert.alert('Error', error || 'Failed to update mood');
                }
              },
            },
          ]
        );
      } else {
        // Create new mood
        await dispatch(createMood(selected)).unwrap();
        await loadMoods(); // Reload moods to reflect changes
        Alert.alert('Success', 'Mood logged successfully');
      }
    } catch (error) {
      Alert.alert('Error', error || 'Failed to save mood');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>How are you feeling?</Text>
      
      {/* Today's Mood Indicator */}
      {todaysMood && (
        <View style={[styles.todayBanner, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.todayText, { color: theme.colors.primary }]}>
            Today's mood: {todaysMood.moodType.charAt(0).toUpperCase() + todaysMood.moodType.slice(1)}
          </Text>
          <Text style={[styles.todaySubtext, { color: theme.colors.textSecondary }]}>
            (Select a different mood to update)
          </Text>
        </View>
      )}
      
      {/* Mood Grid */}
      <View style={styles.grid}>
        {MOOD_TYPES.map((moodType) => {
          const config = moodConfig[moodType] || { icon: 'help-circle', color: theme.colors.primary };
          const isSelected = selected === moodType;
          
          return (
            <Pressable
              key={moodType}
              style={[
                styles.moodCard,
                { 
                  backgroundColor: isSelected ? config.color + '20' : theme.colors.surface,
                  borderColor: isSelected ? config.color : theme.colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => setSelected(moodType)}
            >
              <Ionicons 
                name={config.icon} 
                size={32} 
                color={isSelected ? config.color : theme.colors.textSecondary} 
              />
              <Text 
                style={[
                  styles.moodLabel, 
                  { color: isSelected ? config.color : theme.colors.text }
                ]}
              >
                {moodType.charAt(0).toUpperCase() + moodType.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 20 }} />
      ) : (
        <>
          <PrimaryButton 
            label={todaysMood ? "Update Today's Mood" : "Save Mood"} 
            onPress={saveMood} 
          />
          <PrimaryButton 
            label="View History" 
            variant="secondary" 
            onPress={() => navigation.navigate('MoodHistory')} 
          />
        </>
      )}

      {/* Recent Entries */}
      <View style={styles.latestWrap}>
        <Text style={[styles.subHeading, { color: theme.colors.text }]}>Recent Entries</Text>
        {entries.slice(0, 5).map((m) => {
          const config = moodConfig[m.moodType] || { icon: 'help-circle', color: theme.colors.primary };
          return (
            <View key={m._id} style={[styles.entry, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Ionicons name={config.icon} size={20} color={config.color} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.entryMood, { color: theme.colors.text }]}>
                  {m.moodType.charAt(0).toUpperCase() + m.moodType.slice(1)}
                </Text>
                <Text style={[styles.entryDate, { color: theme.colors.textMuted }]}>
                  {new Date(m.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          );
        })}
        {!entries.length && (
          <Text style={[styles.muted, { color: theme.colors.textMuted }]}>No mood entries yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: { fontSize: 24, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  todayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  todayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  todaySubtext: {
    fontSize: 11,
    fontStyle: 'italic',
    width: '100%',
    textAlign: 'center',
    marginTop: 4,
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12, 
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  moodCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  moodLabel: { 
    fontSize: 12, 
    fontWeight: '600', 
    marginTop: 8,
    textAlign: 'center',
  },
  latestWrap: { marginTop: 24, gap: 12 },
  subHeading: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  entry: { 
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 12, 
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  entryMood: { fontSize: 16, fontWeight: '600' },
  entryDate: { fontSize: 12, marginTop: 2 },
  muted: { fontSize: 14, textAlign: 'center', marginTop: 12 }
});
