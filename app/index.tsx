"use client"

import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import AppNavigator from "./navigation/AppNavigator"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { checkAuthStatus } from "./redux/slices/authSlice"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

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
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <StatusBar style="light" />
            <AppNavigator />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

