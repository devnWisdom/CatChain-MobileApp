import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { authenticateWithBiometrics, verifyPin } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function LockScreen() {
  const { unlock, logout } = useAuth();
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBiometric = async () => {
    setIsSubmitting(true);
    try {
      await authenticateWithBiometrics();
      unlock();
    } catch {
      Alert.alert('Biometric unavailable', 'Please unlock with your PIN.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePin = async () => {
    setIsSubmitting(true);
    try {
      if (await verifyPin(pin)) {
        setPin('');
        unlock();
      } else {
        Alert.alert('Invalid PIN', 'Please try again. The app locks after 5 failed attempts.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PetChain Locked</Text>
      <Text style={styles.subtitle}>Use biometrics or your secure PIN to continue.</Text>
      <Pressable style={styles.primaryButton} disabled={isSubmitting} onPress={handleBiometric}>
        <Text style={styles.primaryButtonText}>Unlock with Biometrics</Text>
      </Pressable>
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        placeholder="Enter PIN"
        secureTextEntry
        keyboardType="number-pad"
        maxLength={12}
      />
      <Pressable style={styles.secondaryButton} disabled={isSubmitting || pin.length === 0} onPress={handlePin}>
        <Text style={styles.secondaryButtonText}>Unlock with PIN</Text>
      </Pressable>
      <Pressable disabled={isSubmitting} onPress={logout}>
        <Text style={styles.logoutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0f172a',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
  },
  input: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#052e16',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#38bdf8',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#e0f2fe',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutText: {
    color: '#fca5a5',
    marginTop: 24,
    fontSize: 15,
  },
});
