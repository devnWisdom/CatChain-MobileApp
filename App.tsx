import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import './src/i18n';
import OfflineIndicator from './src/components/OfflineIndicator';
import { useSplashGuard } from './src/components/SplashGuard';
import AppNavigator from './src/navigation';
import { PetProvider } from './src/context/PetContext';
import {
  registerNotificationActions,
  watchNotificationActions,
} from './src/services/notificationService';

export default function App() {
  const { appReady } = useSplashGuard();

  useEffect(() => {
    void registerNotificationActions();
    const subscription = watchNotificationActions();
    return () => subscription.remove();
  }, []);

  // Render nothing (splash is still visible) until critical init is done
  if (!appReady) return <View style={styles.root} />;

  return (
    <PetProvider>
      <View style={styles.root}>
        <OfflineIndicator />
        <AppNavigator />
      </View>
    </PetProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
