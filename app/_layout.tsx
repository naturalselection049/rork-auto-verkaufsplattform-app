import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/auth';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';
import { AuthGuard } from '@/components/AuthGuard';

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      checkAuthStatus().finally(() => setIsAuthChecked(true));
    }
  }, [loaded, checkAuthStatus]);

  if (!loaded || !isAuthChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <AuthGuard>
      <RootLayoutNav />
    </AuthGuard>
  );
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{
        headerBackTitle: "Zurück",
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="car/[id]" 
          options={{ 
            title: "Fahrzeugdetails",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="filter" 
          options={{ 
            title: "Filter",
            presentation: "modal",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="cost-calculator" 
          options={{ 
            title: "Kostenrechner",
            presentation: "modal",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="saved-searches" 
          options={{ 
            title: "Gespeicherte Suchen",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="direct-messages" 
          options={{ 
            title: "Direktnachrichten",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="direct-messages/[id]" 
          options={{ 
            title: "Konversation",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="user-search" 
          options={{ 
            title: "Benutzer suchen",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="forum/[id]" 
          options={{ 
            title: "Forumbeitrag",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="forum/new" 
          options={{ 
            title: "Neuer Beitrag",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="auth/login" 
          options={{ 
            title: "Anmelden",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="auth/register" 
          options={{ 
            title: "Registrieren",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
      </Stack>
    </>
  );
}