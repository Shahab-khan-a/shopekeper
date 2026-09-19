import { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Spacing } from '@/constants/theme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <Pressable
        style={({ pressed }) => [styles.heading, pressed && { opacity: 0.7 }]}
        onPress={() => setIsOpen((v) => !v)}>
        <Text style={styles.chevron}>{isOpen ? '▼' : '▶'}</Text>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  chevron: { fontSize: 12 },
  title: { fontSize: 14 },
  content: {
    marginTop: Spacing.sm,
    marginLeft: Spacing.lg,
    padding: Spacing.md,
  },
});
