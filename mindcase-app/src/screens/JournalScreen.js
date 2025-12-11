import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import { useTheme } from '../theme';
import { fetchJournals } from '../redux/slices/journalSlice';

export default function JournalScreen({ navigation }) {
  const dispatch = useDispatch();
  const { entries, loading } = useSelector((state) => state.journal);
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadJournals();
  }, []);

  // Reload journals when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadJournals();
    }, [])
  );

  const loadJournals = async () => {
    try {
      await dispatch(fetchJournals()).unwrap();
    } catch (error) {
      console.error('Failed to load journals:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJournals();
    setRefreshing(false);
  };

  // Group journals by date
  const groupJournalsByDate = () => {
    const grouped = {};
    
    entries.forEach((entry) => {
      const date = new Date(entry.createdAt);
      const dateKey = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(entry);
    });
    
    // Convert to array of sections and sort by date (newest first)
    return Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(date => ({
        title: date,
        data: grouped[date].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ),
      }));
  };

  const sections = groupJournalsByDate();

  if (loading && !entries.length) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>Journal</Text>
      <PrimaryButton label="New Entry" onPress={() => navigation.navigate('NewJournalEntry')} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingVertical: 8 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.dateHeader, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.dateHeaderText, { color: theme.colors.primary }]}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable 
            style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
            onPress={() => navigation.navigate('JournalEntry', { entry: item })}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{item.entry?.title || 'Untitled'}</Text>
              <Text style={[styles.cardTime, { color: theme.colors.textMuted }]}>
                {new Date(item.createdAt).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
            <Text numberOfLines={2} style={[styles.cardBody, { color: theme.colors.textSecondary }]}>
              {item.entry?.text || 'No content'}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={[styles.muted, { color: theme.colors.textMuted }]}>No entries yet. Create one!</Text>
        }
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  dateHeader: {
    paddingVertical: 12,
    paddingTop: 20,
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: { 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    borderWidth: 1, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2, 
    gap: 8 
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8 },
  cardTime: { fontSize: 11, fontWeight: '500' },
  cardBody: { fontSize: 14, lineHeight: 20 },
  muted: { fontSize: 14, marginTop: 12, textAlign: 'center' }
});
