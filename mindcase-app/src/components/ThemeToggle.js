import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export default function ThemeToggle() {
  const { isDark, toggleTheme, colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.info}>
        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
        </Text>
      </View>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: colors.border, true: colors.secondary }}
        thumbColor={isDark ? colors.accent : colors.surface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8
  },
  info: {
    flex: 1,
    marginRight: 12
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  description: {
    fontSize: 14
  }
});
