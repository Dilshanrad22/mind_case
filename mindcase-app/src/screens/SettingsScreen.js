import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../theme';
import ThemeToggle from '../components/ThemeToggle';

export default function SettingsScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>Settings</Text>
      
      <ThemeToggle />
      
      <View style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Daily Mood Reminder</Text>
        <Switch 
          value={true} 
          onValueChange={() => {}} 
          trackColor={{ false: theme.colors.border, true: theme.colors.secondary }}
          thumbColor={theme.colors.surface}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  heading: { fontSize: 22, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, borderWidth: 1 },
  label: { fontSize: 16 }
});
