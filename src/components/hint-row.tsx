import React, { type ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/theme';

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <View style={styles.stepRow}>
      <Text style={styles.text}>{title}</Text>
      <View style={styles.codeSnippet}>
        <Text style={styles.hintText}>{hint as any}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepRow: { flexDirection: 'row', justifyContent: 'space-between' },
  text: { fontSize: 14 },
  codeSnippet: {
    borderRadius: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: '#F1F5F9',
  },
  hintText: { fontSize: 12, color: '#64748B' },
});
