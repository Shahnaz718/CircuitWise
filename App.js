import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

function Root() {
  const { ready, error, dark, colors } = useApp();
  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.bg }}>
        <Text style={{ color: colors.high, fontWeight: '800', fontSize: 18 }}>Could not open the local database</Text>
        <Text style={{ color: colors.ink, marginTop: 8, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }
  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.ink} />
        <Text style={{ color: colors.sub, marginTop: 12 }}>Loading CircuitWise...</Text>
      </View>
    );
  }
  return (
    <>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}
