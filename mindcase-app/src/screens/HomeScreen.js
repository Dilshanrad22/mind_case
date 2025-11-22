import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useApp } from '../store/AppContext';
import { useTheme } from '../theme';
import ShiningGold from '../components/ShiningGold';

export default function HomeScreen({ navigation }) {
  const { moodEntries, recentMoodAverage, journalEntries } = useApp();
  const user = useSelector((state) => state.auth.user);
  const theme = useTheme();
  
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getUserName = () => {
    if (user) {
      return user.firstName || user.username || 'User';
    }
    return 'User';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Profile Header with Gradient */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileHeader}
      >
        <View style={styles.profileInfo}>
          <ShiningGold>
            <LinearGradient
              colors={theme.colors.goldGradient || [theme.colors.secondary, theme.colors.secondaryLight, theme.colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Ionicons name="person" size={32} color={theme.colors.textOnSecondary} />
            </LinearGradient>
          </ShiningGold>
          <View style={styles.greetingSection}>
            <Text style={[styles.greeting, { color: theme.colors.textOnPrimary }]}>{getCurrentGreeting()}</Text>
            <Text style={[styles.username, { color: theme.colors.textOnPrimary }]}>{getUserName()}</Text>
          </View>
        </View>
        <Pressable onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="settings-outline" size={24} color={theme.colors.textOnPrimary} />
        </Pressable>
      </LinearGradient>

      {/* Stats Cards Grid */}
      <View style={styles.statsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Progress</Text>
        <View style={styles.grid}>
          <Pressable 
            style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
            onPress={() => navigation.navigate('Mood')}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '15' }]}>
              <Ionicons name="happy" size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{recentMoodAverage || '—'}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Mood Average</Text>
            <Text style={[styles.statPeriod, { color: theme.colors.textMuted }]}>Last 7 days</Text>
          </Pressable>

          <Pressable 
            style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
            onPress={() => navigation.navigate('Journal')}
          >
            <ShiningGold>
              <LinearGradient
                colors={theme.colors.goldGradient || [theme.colors.secondary, theme.colors.secondaryLight, theme.colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconCircle}
              >
                <Ionicons name="book" size={24} color={theme.colors.textOnSecondary} />
              </LinearGradient>
            </ShiningGold>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{journalEntries.length}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Journal Entries</Text>
            <Text style={[styles.statPeriod, { color: theme.colors.textMuted }]}>Total written</Text>
          </Pressable>

          <Pressable 
            style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
            onPress={() => navigation.navigate('Exercises')}
          >
            <ShiningGold>
              <LinearGradient
                colors={theme.colors.goldGradient || [theme.colors.accent, theme.colors.accentLight, theme.colors.secondaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconCircle}
              >
                <Ionicons name="body" size={24} color={theme.colors.textOnSecondary} />
              </LinearGradient>
            </ShiningGold>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{moodEntries.length}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Activities</Text>
            <Text style={[styles.statPeriod, { color: theme.colors.textMuted }]}>Completed</Text>
          </Pressable>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
        <Pressable 
          style={[styles.actionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
          onPress={() => navigation.navigate('Mood')}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionGradient}
          >
            <View style={styles.actionContent}>
              <View>
                <Text style={[styles.actionTitle, { color: theme.colors.textOnPrimary }]}>Log Your Mood</Text>
                <Text style={[styles.actionDesc, { color: theme.colors.textOnPrimary, opacity: 0.9 }]}>Track how you're feeling today</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color={theme.colors.textOnPrimary} />
            </View>
          </LinearGradient>
        </Pressable>

        <Pressable 
          style={[styles.actionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
          onPress={() => navigation.navigate('Journal', { screen: 'NewJournalEntry' })}
        >
          <LinearGradient
            colors={theme.colors.goldGradient || [theme.colors.secondary, theme.colors.secondaryLight, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionGradient}
          >
            <ShiningGold>
              <View style={styles.actionContent}>
                <View>
                  <Text style={[styles.actionTitle, { color: theme.colors.textOnSecondary }]}>New Journal Entry</Text>
                  <Text style={[styles.actionDesc, { color: theme.colors.textOnSecondary, opacity: 0.9 }]}>Write down your thoughts</Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color={theme.colors.textOnSecondary} />
              </View>
            </ShiningGold>
          </LinearGradient>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },
  greetingSection: {
    gap: 4
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9
  },
  username: {
    fontSize: 20,
    fontWeight: '700'
  },
  statsSection: {
    padding: 24,
    paddingTop: 28
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  statCard: {
    width: '47%',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: 8
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600'
  },
  statPeriod: {
    fontSize: 12,
    fontWeight: '500'
  },
  actionsSection: {
    padding: 24,
    paddingTop: 8,
    paddingBottom: 32
  },
  actionCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4
  },
  actionGradient: {
    padding: 20
  },
  actionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4
  },
  actionDesc: {
    fontSize: 14,
    fontWeight: '500'
  }
});
