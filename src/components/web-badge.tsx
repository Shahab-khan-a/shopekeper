import { version } from 'expo/package.json';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/theme';

export function WebBadge() {
  return (
    <View style={styles.container}>
      <Text style={styles.versionText}>v{version}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
  },
});
