import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator, Text, Image, Platform, BackHandler } from 'react-native';
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
import { FloatingTourPrompt } from '@/components/FloatingTourPrompt';
import { LoginScreen } from '@/screens/LoginScreen';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { SaleScreen } from '@/screens/SaleScreen';
import { ProductsScreen } from '@/screens/ProductsScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { KhataScreen } from '@/screens/KhataScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { CatalogSetupScreen } from '@/screens/CatalogSetupScreen';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { AlertModal } from '@/components/ui';

export default function App() {
  const {
    activeTab,
    setActiveTab,
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
    isOnboardingOpen,
    setIsOnboardingOpen,
    tourStep,
    setTourStep,
    endHandsOnTour,
    user,
    authLoading,
    isLoaded,
    isGuestMode,
    continueAsGuest,
    alertConfig,
    hideAlert,
  } = useShop();

  const theme = settings.darkMode ? Colors.dark : Colors.light;

  // First-run catalog setup: after sign-in or Continue as Guest, the keeper
  // picks a shop type and loads its ready-made items (or skips). Remembered
  // per identity so it is asked exactly once.
  const [isCatalogStepCompleted, setIsCatalogStepCompleted] = useState<boolean | null>(null);
  const catalogFlagKey = user
    ? `@shopkeeper_catalog_onboarded_${user.uid}`
    : isGuestMode
      ? '@shopkeeper_catalog_onboarded_guest'
      : null;

  useEffect(() => {
    if (!catalogFlagKey) {
      setIsCatalogStepCompleted(null);
      return;
    }
    // A shop that already chose a catalog type never needs the setup step.
    if (settings.catalogShopType) {
      setIsCatalogStepCompleted(true);
      return;
    }
    let cancelled = false;
    AsyncStorage.getItem(catalogFlagKey)
      .then((val) => {
        if (!cancelled) setIsCatalogStepCompleted(val === 'true');
      })
      .catch(() => {
        if (!cancelled) setIsCatalogStepCompleted(false);
      });
    return () => {
      cancelled = true;
    };
  }, [catalogFlagKey, settings.catalogShopType]);

  const handleFinishCatalogOnboarding = async (loadedCount: number) => {
    if (catalogFlagKey) {
      try {
        await AsyncStorage.setItem(catalogFlagKey, 'true');
      } catch (e) {
        console.warn('[App] Error storing catalog onboarding flag:', e);
      }
    }
    setIsCatalogStepCompleted(true);
    // Stocked the shelves? Land him on New Sale so his first success is a bill.
    if (loadedCount > 0) {
      setActiveTab('sale');
    }
  };

  // Global Android Hardware Back Button Stack Management
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    if (isCatalogStepCompleted === false) return; // CatalogSetupScreen handles its own back navigation

    const onHardwareBack = () => {
      // 1. Dismiss topmost Alert dialog if active
      if (alertConfig) {
        hideAlert();
        return true;
      }
      // 2. Dismiss Receipt modal if active
      if (activeReceipt) {
        setActiveReceipt(null);
        return true;
      }
      // 3. Dismiss Product Add/Edit modal if active
      if (isAddProductOpen) {
        setIsAddProductOpen(false);
        setEditingProduct(null);
        return true;
      }
      // 4. Dismiss Auth modal if active
      if (isAuthModalOpen) {
        setIsAuthModalOpen(false);
        return true;
      }
      // 5. Dismiss Edit Shop profile modal if active
      if (isEditShopOpen) {
        setIsEditShopOpen(false);
        return true;
      }
      // 6. Dismiss Onboarding modal if active
      if (isOnboardingOpen) {
        setIsOnboardingOpen(false);
        return true;
      }
      // 7. Navigation Stack: If in Sale, Products, History, or Khata, back navigates to Dashboard
      // (SettingsScreen has its own dedicated handler to prompt if store form is dirty)
      if (activeTab !== 'dashboard' && activeTab !== 'settings') {
        setActiveTab('dashboard');
        return true;
      }

      // If already on Dashboard with no modals open, allow default Android back action (exit)
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => sub.remove();
  }, [
    alertConfig,
    activeReceipt,
    isAddProductOpen,
    isAuthModalOpen,
    isEditShopOpen,
    isOnboardingOpen,
    activeTab,
    isCatalogStepCompleted,
    hideAlert,
    setActiveReceipt,
    setIsAddProductOpen,
    setEditingProduct,
    setIsAuthModalOpen,
    setIsEditShopOpen,
    setIsOnboardingOpen,
    setActiveTab,
  ]);

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

  const renderContent = () => {
    // 1. Initial Local Database Loading Splash (only waits for local SQLite/IndexedDB, <100ms)
    if (!isLoaded) {
      return (
        <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.surface }]}>
          <StatusBar
            barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
            backgroundColor={theme.surface}
          />
          <View style={styles.loadingLogoOuter}>
            <Image
              source={require('@/../assets/images/mainLogoImage.png')}
              style={styles.loadingLogoImg}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.loadingTitle, { color: theme.text }]}>DigiShop</Text>
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
            <View style={styles.loadingLogoOuter}>
              <Image
                source={require('@/../assets/images/mainLogoImage.png')}
                style={styles.loadingLogoImg}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.loadingTitle, { color: theme.text }]}>DigiShop</Text>
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

    // 2.5 First-Run Catalog Setup (new keepers only, asked once)
    if (isCatalogStepCompleted === null) {
      return (
        <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.surface }]}>
          <StatusBar
            barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
            backgroundColor={theme.surface}
          />
          <View style={styles.loadingLogoOuter}>
            <Image
              source={require('@/../assets/images/mainLogoImage.png')}
              style={styles.loadingLogoImg}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.loadingTitle, { color: theme.text }]}>DigiShop</Text>
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
          <Text style={[styles.loadingSub, { color: theme.textMuted }]}>
            Setting up your store...
          </Text>
        </SafeAreaView>
      );
    }

    if (!isCatalogStepCompleted) {
      return (
        <SafeAreaView style={[styles.rootSafeArea, { backgroundColor: theme.background }]}>
          <StatusBar
            barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
            backgroundColor={theme.surface}
          />
          <CatalogSetupScreen onDone={handleFinishCatalogOnboarding} />
        </SafeAreaView>
      );
    }

    const topCanvasBg = settings.darkMode ? '#0A0F1E' : '#F8FAFC';

    // 3. Authenticated or Guest Mode -> Show Main Store POS App
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={[styles.rootSafeArea, { backgroundColor: topCanvasBg }]}>
        <StatusBar
          barStyle={settings.darkMode ? 'light-content' : 'dark-content'}
          backgroundColor={topCanvasBg}
        />
        <View style={[styles.appContainer, { backgroundColor: theme.background }]}>
          {/* Top Shop Brand & Settings Header */}
          <ShopHeader />

          {/* Dynamic Screen Component */}
          <View style={styles.screenWrapper}>{renderActiveScreen()}</View>

          {/* Bottom Navigation (Hidden on Settings screen) */}
          {activeTab !== 'settings' && <BottomNav />}

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

          {/* Hands-On Tour Step 5: Floating prompt over receipt to visit Khata */}
          {tourStep === 5 && (
            <FloatingTourPrompt
              badgeUrdu="پہلی سیل مکمل ✓"
              badgeEn="Step 1 Complete ✓"
              messageUrdu="زبردست! آپ کی پہلی سیل 3 سیکنڈ میں بن گئی۔ اب کسٹمر کھاتہ دیکھیں۔"
              messageEn="Great job! First sale made in 3 seconds. Now discover customer Khata."
              buttonUrdu="گاہک کھاتہ دیکھیں ➔"
              buttonEn="Open Customer Khata ➔"
              onPressButton={() => {
                setActiveReceipt(null);
                setActiveTab('khata');
                setTourStep(6);
              }}
              onSkip={endHandsOnTour}
            />
          )}
        </View>
      </SafeAreaView>
    );
  };

  return (
    <>
      {renderContent()}
      <AlertModal
        visible={!!alertConfig}
        type={alertConfig?.type}
        title={alertConfig?.title || ''}
        message={alertConfig?.message}
        buttons={alertConfig?.buttons}
        onClose={hideAlert}
      />
    </>
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
    width: 88,
    height: 88,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    ...Shadows.md,
  },
  loadingLogoImg: {
    width: 86,
    height: 86,
    borderRadius: 20,
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
