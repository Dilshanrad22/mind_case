import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../store/AppContext';
import { useTheme } from '../theme';

export default function InsightsScreen() {
  const { moodEntries } = useApp();
  const theme = useTheme();

  const buckets = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const label = `${date.getMonth()+1}/${date.getDate()}`;
      const dayEntries = moodEntries.filter(m => {
        const d = new Date(m.date);
        return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
      });
      const avg = dayEntries.length ? dayEntries.reduce((s, m) => s + m.value, 0) / dayEntries.length : 0;
      days.push({ label, avg });
    }
    return days;
  }, [moodEntries]);

  const max = 5;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>Mood Insights (7 days)</Text>
      <View style={styles.chartRow}>
        {buckets.map(b => (
          <View key={b.label} style={styles.barWrap}>
            <View style={[styles.bar, { height: `${(b.avg / max) * 120}px`, backgroundColor: theme.colors.secondary }]} />
            <Text style={[styles.barLabel, { color: theme.colors.textMuted }]}>{b.label}</Text>
            <Text style={[styles.barValue, { color: theme.colors.text }]}>{b.avg ? b.avg.toFixed(1) : '—'}</Text>
          </View>
        ))}
      </View>
      {!moodEntries.length && <Text style={[styles.muted, { color: theme.colors.textMuted }]}>Log moods to see insights.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 24 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flex: 0 },
  barWrap: { alignItems: 'center', width: 40 },
  bar: { width: 24, borderRadius: 12, marginBottom: 6 },
  barLabel: { fontSize: 10 },
  barValue: { fontSize: 12, fontWeight: '600' },
  muted: { marginTop: 16, fontSize: 14 }
});
