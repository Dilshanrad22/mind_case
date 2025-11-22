import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useApp } from '../store/AppContext';
import { useTheme } from '../theme';
import ThemeToggle from '../components/ThemeToggle';
import ShiningGold from '../components/ShiningGold';
import { logout } from '../redux/slices/authSlice';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { moodEntries, journalEntries } = useApp();
  const theme = useTheme();
  
  const getUserName = () => {
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      return fullName || user.username || 'MindEase User';
    }
    return 'MindEase User';
  };

  const handleLogout = async () => {
    await dispatch(logout());
  };
  
  const getDaysActive = () => {
    if (moodEntries.length === 0) return 0;
    const firstEntry = new Date(moodEntries[0].date);
    const today = new Date();
    const diffTime = Math.abs(today - firstEntry);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStreak = () => {
    return moodEntries.length > 0 ? Math.min(moodEntries.length, 7) : 0;
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
        <View style={styles.avatarSection}>
          <ShiningGold>
            <LinearGradient
              colors={theme.colors.goldGradient || [theme.colors.secondary, theme.colors.secondaryLight, theme.colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarLarge}
            >
              <Ionicons name="person" size={48} color={theme.colors.textOnSecondary} />
            </LinearGradient>
          </ShiningGold>
          <Text style={[styles.profileName, { color: theme.colors.textOnPrimary }]}>{getUserName()}</Text>
          <Text style={[styles.profileId, { color: theme.colors.textOnPrimary, opacity: 0.8 }]}>
            {user?.email || 'ID: 22431L'}
          </Text>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCardMini, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={[styles.statIconCircle, { backgroundColor: theme.colors.primary + '15' }]}>
              <Ionicons name="happy" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.statValueMini, { color: theme.colors.text }]}>{moodEntries.length}</Text>
            <Text style={[styles.statLabelMini, { color: theme.colors.textSecondary }]}>Mood Logs</Text>
          </View>

          <View style={[styles.statCardMini, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <ShiningGold>
              <LinearGradient
                colors={theme.colors.goldGradient || [theme.colors.secondary, theme.colors.secondaryLight, theme.colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statIconCircle}
              >
                <Ionicons name="book" size={20} color={theme.colors.textOnSecondary} />
              </LinearGradient>
            </ShiningGold>
            <Text style={[styles.statValueMini, { color: theme.colors.text }]}>{journalEntries.length}</Text>
            <Text style={[styles.statLabelMini, { color: theme.colors.textSecondary }]}>Journals</Text>
          </View>

          <View style={[styles.statCardMini, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <ShiningGold>
              <LinearGradient
                colors={theme.colors.goldGradient || [theme.colors.accent, theme.colors.accentLight, theme.colors.secondaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statIconCircle}
              >
                <Ionicons name="flame" size={20} color={theme.colors.textOnSecondary} />
              </LinearGradient>
            </ShiningGold>
            <Text style={[styles.statValueMini, { color: theme.colors.text }]}>{getStreak()}</Text>
            <Text style={[styles.statLabelMini, { color: theme.colors.textSecondary }]}>Day Streak</Text>
          </View>

          <View style={[styles.statCardMini, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={[styles.statIconCircle, { backgroundColor: theme.colors.success + '15' }]}>
              <Ionicons name="calendar" size={20} color={theme.colors.success} />
            </View>
            <Text style={[styles.statValueMini, { color: theme.colors.text }]}>{getDaysActive()}</Text>
            <Text style={[styles.statLabelMini, { color: theme.colors.textSecondary }]}>Days Active</Text>
          </View>
        </View>
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Achievements</Text>
        <View style={[styles.achievementCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.achievementRow}>
            <ShiningGold>
              <LinearGradient
                colors={theme.colors.goldGradient || [theme.colors.secondary, theme.colors.secondaryLight, theme.colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.achievementIcon}
              >
                <Ionicons name="trophy" size={28} color={theme.colors.textOnSecondary} />
              </LinearGradient>
            </ShiningGold>
            <View style={styles.achievementInfo}>
              <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>First Entry</Text>
              <Text style={[styles.achievementDesc, { color: theme.colors.textSecondary }]}>Started your wellness journey</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
          </View>
        </View>

        <View style={[styles.achievementCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.achievementRow}>
            {getStreak() >= 7 ? (
              <ShiningGold>
                <LinearGradient
                  colors={theme.colors.goldGradient || [theme.colors.secondary, theme.colors.secondaryLight, theme.colors.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.achievementIcon}
                >
                  <Ionicons name="star" size={28} color={theme.colors.textOnSecondary} />
                </LinearGradient>
              </ShiningGold>
            ) : (
              <View style={[styles.achievementIcon, { backgroundColor: theme.colors.border }]}>
                <Ionicons name="star" size={28} color={theme.colors.textSecondary} />
              </View>
            )}
            <View style={styles.achievementInfo}>
              <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>Consistency Master</Text>
              <Text style={[styles.achievementDesc, { color: theme.colors.textSecondary }]}>7 days of tracking</Text>
            </View>
            <Ionicons 
              name={getStreak() >= 7 ? "checkmark-circle" : "lock-closed"} 
              size={24} 
              color={getStreak() >= 7 ? theme.colors.success : theme.colors.textMuted} 
            />
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Settings</Text>
        
        <ThemeToggle />
        
        <Pressable 
          style={[styles.menuItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={styles.menuItemContent}>
            <View style={[styles.menuIcon, { backgroundColor: theme.colors.info + '15' }]}>
              <Ionicons name="settings-outline" size={20} color={theme.colors.info} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </Pressable>

        <Pressable 
          style={[styles.menuItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
          onPress={() => navigation.navigate('Help')}
        >
          <View style={styles.menuItemContent}>
            <View style={[styles.menuIcon, { backgroundColor: theme.colors.warning + '15' }]}>
              <Ionicons name="help-circle-outline" size={20} color={theme.colors.warning} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </Pressable>

        <Pressable 
          style={[styles.menuItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} 
          onPress={handleLogout}
        >
          <View style={styles.menuItemContent}>
            <View style={[styles.menuIcon, { backgroundColor: theme.colors.danger + '15' }]}>
              <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.danger }]}>Logout</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center'
  },
  avatarSection: {
    alignItems: 'center',
    gap: 12
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5
  },
  profileId: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1
  },
  statsContainer: {
    padding: 24,
    paddingTop: 28
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  statCardMini: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statValueMini: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5
  },
  statLabelMini: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  section: {
    padding: 24,
    paddingTop: 8
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16
  },
  achievementCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },
  achievementInfo: {
    flex: 1,
    gap: 4
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  achievementDesc: {
    fontSize: 13,
    fontWeight: '500'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600'
  }
});
