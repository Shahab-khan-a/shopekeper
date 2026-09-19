import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShop } from '@/context/ShopContext';
import { ShopHeader } from '@/components/ShopHeader';
import { BottomNav } from '@/components/BottomNav';
import { ProductModal } from '@/components/ProductModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { SaleScreen } from '@/screens/SaleScreen';
import { ProductsScreen } from '@/screens/ProductsScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { KhataScreen } from '@/screens/KhataScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { Colors } from '@/constants/theme';

export default function App() {
  const {
    activeTab,
    settings,
    isAddProductOpen,
    setIsAddProductOpen,
    editingProduct,
    setEditingProduct,
    activeReceipt,
    setActiveReceipt,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'sale':
        return <SaleScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'khata':
        return <KhataScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.rootSafeArea, { backgroundColor: theme.surface }]}>
      <StatusBar
        barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.surface}
      />
      <View style={[styles.appContainer, { backgroundColor: theme.background }]}>
        {/* Top Shop Brand & Settings Header */}
        <ShopHeader />

        {/* Dynamic Screen Component */}
        <View style={styles.screenWrapper}>{renderActiveScreen()}</View>

        {/* Persistent Bottom Navigation */}
        <BottomNav />

        {/* Global Product Add / Edit Modal */}
        <ProductModal
          visible={isAddProductOpen}
          productToEdit={editingProduct}
          onClose={() => {
            setIsAddProductOpen(false);
            setEditingProduct(null);
          }}
        />

        {/* Global Thermal Receipt Modal */}
        <ReceiptModal
          sale={activeReceipt}
          visible={!!activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootSafeArea: {
    flex: 1,
  },
  appContainer: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  screenWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
});
