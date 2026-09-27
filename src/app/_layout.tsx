import React from 'react';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import { ShopProvider } from '@/context/ShopContext';

export default function RootLayout() {
  // Preload Ionicons font to ensure all vector icons render smoothly and immediately on web and mobile
  useFonts({
    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });

  return (
    <ShopProvider>
      <Slot />
    </ShopProvider>
  );
}

