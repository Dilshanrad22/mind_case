import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export default function PrimaryButton({ label, onPress, variant = 'primary' }) {
  const theme = useTheme();
  const styles = getStyles(theme, variant);
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

function getStyles(theme, variant) {
  const base = {
    button: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginVertical: 6
    },
    text: { fontSize: 16, fontWeight: '600' }
  };

  if (variant === 'secondary') {
    return StyleSheet.create({
      button: { ...base.button, backgroundColor: theme.colors.secondary },
      text: { ...base.text, color: theme.colors.textOnSecondary }
    });
  }
  if (variant === 'link') {
    return StyleSheet.create({
      button: { ...base.button, backgroundColor: 'transparent' },
      text: { ...base.text, color: theme.colors.primary }
    });
  }
  return StyleSheet.create({
    button: { ...base.button, backgroundColor: theme.colors.primary },
    text: { ...base.text, color: theme.colors.textOnPrimary }
  });
}
