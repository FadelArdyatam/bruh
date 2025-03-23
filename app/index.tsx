"use client"

import { useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import AppNavigator from "./navigation/AppNavigator"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { checkAuthStatus } from "./redux/slices/authSlice"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import ErrorBoundary from "./components/ErrorBoundary"
import { LogBox, View, Text, ActivityIndicator } from "react-native"

// Nonaktifkan warning tentang VirtualizedList di dalam ScrollView
// Ini bukan solusi ideal, lebih baik memperbaiki kode, tapi dapat membantu selama pengembangan
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'Non-serializable values were found in the navigation state',
]);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

// Komponen loading sederhana
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
    <ActivityIndicator size="large" color="#FFB800" />
    <Text style={{ marginTop: 20, fontSize: 16, color: '#333' }}>Memuat SI POLGAR...</Text>
  </View>
);

export default function App() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter_18pt-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter_18pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),
  })

  useEffect(() => {
    // Check if user is already logged in
    store.dispatch(checkAuthStatus())

    // Hide splash screen when fonts are loaded
    if (fontsLoaded) {
      setTimeout(() => {
        SplashScreen.hideAsync().catch(() => {
          // Abaikan error jika splash screen sudah dihapus
          console.log('Splash screen sudah dihapus');
        });
      }, 1000); // Delay singkat untuk transisi yang lebih halus
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Provider store={store}>
            <StatusBar style="light" />
            <AppNavigator />
          </Provider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  )
}