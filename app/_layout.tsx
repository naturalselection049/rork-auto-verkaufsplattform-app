import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useCartStore } from '@/store/cart';

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { isDarkMode, colors } = useTheme();
  const { loadCart } = useCartStore();
  
  useEffect(() => {
    loadCart();
  }, [loadCart]);
  
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack screenOptions={{
        headerBackTitle: "Zurück",
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
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
        <Stack.Screen 
          name="parts-market" 
          options={{ 
            title: "Ersatzteilmarkt",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="cart" 
          options={{ 
            title: "Warenkorb",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        <Stack.Screen 
          name="seller/[id]" 
          options={{ 
            title: "Verkäuferprofil",
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
      </Stack>
    </>
  );
}