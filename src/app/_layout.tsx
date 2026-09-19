import React from 'react';
import { Slot } from 'expo-router';
import { ShopProvider } from '@/context/ShopContext';

export default function RootLayout() {
  return (
    <ShopProvider>
      <Slot />
    </ShopProvider>
  );
}
