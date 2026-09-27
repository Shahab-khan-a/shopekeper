import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '@/context/ShopContext';
import { ShopHeader } from '@/components/ShopHeader';
import { BottomNav } from '@/components/BottomNav';
import { ProductModal } from '@/components/ProductModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { AuthModal } from '@/components/AuthModal';
import { EditShopModal } from '@/components/EditShopModal';
import { LoginScreen } from '@/screens/LoginScreen';
import { ConnectDriveScreen } from '@/screens/ConnectDriveScreen';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { SaleScreen } from '@/screens/SaleScreen';
import { ProductsScreen } from '@/screens/ProductsScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { KhataScreen } from '@/screens/KhataScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';

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
    isAuthModalOpen,
    setIsAuthModalOpen,
    isEditShopOpen,
    setIsEditShopOpen,
    user,
    authLoading,
    isLoaded,
    isGuestMode,
    continueAsGuest,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;

  // Track if user has completed or dismissed the post-login Google Drive setup
  const [isDriveStepCompleted, setIsDriveStepCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setIsDriveStepCompleted(null);
      return;
    }

    AsyncStorage.getItem(`@shopkeeper_drive_onboarded_${user.uid}`)
      .then((val) => {
        if (val === 'true') {
          setIsDriveStepCompleted(true);
        } else {
          setIsDriveStepCompleted(false);
        }
      })
      .catch(() => {
        setIsDriveStepCompleted(false);
      });
  }, [user?.uid]);

  const handleFinishDriveOnboarding = async () => {
    if (user?.uid) {
      try {
        await AsyncStorage.setItem(`@shopkeeper_drive_onboarded_${user.uid}`, 'true');
      } catch (e) {
        console.warn('[App] Error storing drive onboarding flag:', e);
      }
    }
    setIsDriveStepCompleted(true);
  };

  // 1. Initial Local Database Loading Splash (only waits for local SQLite/IndexedDB, <100ms)
  if (!isLoaded) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.surface }]}>
        <StatusBar
          barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.surface}
        />
        <View style={[styles.loadingLogoOuter, { backgroundColor: theme.primaryLight }]}>
          <View style={[styles.loadingLogoInner, { backgroundColor: theme.primary }]}>
            <Ionicons name="storefront" size={36} color="#FFFFFF" />
          </View>
        </View>
        <Text style={[styles.loadingTitle, { color: theme.text }]}>Shopkeeper POS</Text>
        <Text style={[styles.loadingTitleUrdu, { color: theme.textMuted }]}>دکاندار پی او ایس</Text>
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
        <Text style={[styles.loadingSub, { color: theme.textMuted }]}>
          Loading your store...
        </Text>
      </SafeAreaView>
    );
  }

  // 2. When Not Authenticated and Not in Guest Mode -> Show Login Screen
  if (!user && !isGuestMode) {
    if (authLoading) {
      return (
        <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.surface }]}>
          <StatusBar
            barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
            backgroundColor={theme.surface}
          />
          <View style={[styles.loadingLogoOuter, { backgroundColor: theme.primaryLight }]}>
            <View style={[styles.loadingLogoInner, { backgroundColor: theme.primary }]}>
              <Ionicons name="storefront" size={36} color="#FFFFFF" />
            </View>
          </View>
          <Text style={[styles.loadingTitle, { color: theme.text }]}>Shopkeeper POS</Text>
          <Text style={[styles.loadingTitleUrdu, { color: theme.textMuted }]}>دکاندار پی او ایس</Text>
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
          <Text style={[styles.loadingSub, { color: theme.textMuted }]}>
            Checking your account...
          </Text>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={[styles.rootSafeArea, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.surface}
        />
        <LoginScreen onContinueAsGuest={continueAsGuest} />
      </SafeAreaView>
    );
  }

  // 3. Authenticated User - Check Drive Onboarding Status
  if (user && !isGuestMode && isDriveStepCompleted === null) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.surface }]}>
        <StatusBar
          barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.surface}
        />
        <View style={[styles.loadingLogoOuter, { backgroundColor: theme.primaryLight }]}>
          <View style={[styles.loadingLogoInner, { backgroundColor: theme.primary }]}>
            <Ionicons name="storefront" size={36} color="#FFFFFF" />
          </View>
        </View>
        <Text style={[styles.loadingTitle, { color: theme.text }]}>Shopkeeper POS</Text>
        <Text style={[styles.loadingTitleUrdu, { color: theme.textMuted }]}>دکاندار پی او ایس</Text>
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
        <Text style={[styles.loadingSub, { color: theme.textMuted, marginTop: 12 }]}>
          Setting up your store...
        </Text>
      </SafeAreaView>
    );
  }

  // 4. Authenticated User - Connect Google Drive Screen (Post-Login Step)
  if (user && !isGuestMode && !isDriveStepCompleted) {
    return (
      <SafeAreaView style={[styles.rootSafeArea, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.surface}
        />
        <ConnectDriveScreen
          user={user}
          onGoNext={handleFinishDriveOnboarding}
        />
      </SafeAreaView>
    );
  }

  // 5. Authenticated or Guest Mode -> Show Main Store POS App
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

        {/* Global Google Authentication & Cloud Sync Modal */}
        <AuthModal
          visible={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />

        {/* Global Quick Edit Shop Name & Profile Modal */}
        <EditShopModal
          visible={isEditShopOpen}
          onClose={() => setIsEditShopOpen(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootSafeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingLogoOuter: {
    width: 84,
    height: 84,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogoInner: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: 18,
  },
  loadingTitleUrdu: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    opacity: 0.7,
  },
  loadingSub: {
    fontSize: 13,
    marginTop: 6,
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
