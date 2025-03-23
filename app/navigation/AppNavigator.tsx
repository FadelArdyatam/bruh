import React, { useEffect } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../redux/store"
import { NavigationContainer } from "@react-navigation/native"
import { View, Text, Platform } from "react-native"
import { Home, User, Activity, BarChart3, Settings } from "lucide-react-native"

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"

// App Screens
import HomeScreen from "../screens/app/HomeScreen"
import ProfileScreen from "../screens/app/ProfileScreen"
import PersonalDataScreen from "../screens/app/PersonalDataScreen"
import IMTScreen from "../screens/app/IMTScreen"
import TrainingProgramScreen from "../screens/app/TrainingProgramScreen"
import FoodRecallScreen from "../screens/app/FoodRecallScreen"
import SettingsScreen from "../screens/app/SettingsScreen"
import ChangePasswordScreen from "../screens/app/ChangePasswordScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const AuthStack = createStackNavigator()
const MainStack = createStackNavigator()

const TabIcon = ({ icon: Icon, focused, label }: { icon: any; focused: boolean; label: string }) => (
  <View className="items-center justify-center">
    <Icon size={22} color={focused ? "#FFB800" : "#9CA3AF"} />
    <Text className={`text-xs mt-1 ${focused ? "text-yellow-500 font-medium" : "text-gray-500"}`}>{label}</Text>
  </View>
)

// Tab navigator yang berisi menu utama aplikasi
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 90 : 70,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={Home} focused={focused} label="Beranda" />,
        }}
      />
      <Tab.Screen
        name="IMTTab"
        component={IMTScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={BarChart3} focused={focused} label="IMT" />,
        }}
      />
      <Tab.Screen
        name="TrainingProgramTab"
        component={TrainingProgramScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={Activity} focused={focused} label="Latihan" />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={User} focused={focused} label="Profil" />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={Settings} focused={focused} label="Pengaturan" />,
        }}
      />
    </Tab.Navigator>
  )
}

// Stack untuk proses autentikasi
const AuthStackNavigator = () => {
  const { pendingVerification, pendingEmail } = useSelector((state: RootState) => state.auth)

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {pendingVerification && pendingEmail ? (
        // Tampilkan verifikasi email terlebih dahulu jika pendaftaran menunggu verifikasi
        <>
          <AuthStack.Screen 
            name="VerifyEmail" 
            component={VerifyEmailScreen} 
            initialParams={{ email: pendingEmail }} 
          />
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
          <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        // Alur auth normal - Login terlebih dahulu
        <>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
          <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </AuthStack.Navigator>
  )
}

// Main stack navigator yang digunakan ketika user sudah login
const MainStackNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Main" component={TabNavigator} />
      <MainStack.Screen name="PersonalData" component={PersonalDataScreen} />
      <MainStack.Screen name="FoodRecall" component={FoodRecallScreen} />
      <MainStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </MainStack.Navigator>
  )
}

// Root navigator yang menentukan stack mana yang ditampilkan berdasarkan status auth
const RootNavigator = () => {
  const { isAuthenticated, isLoading, needsProfileSetup } = useSelector((state: RootState) => state.auth)
  
  console.log("Auth state:", { isAuthenticated, isLoading, needsProfileSetup });

  if (isLoading) {
    // Tampilkan splash screen atau indikator loading
    return null;
  }

  // Jika belum login, tampilkan auth stack
  if (!isAuthenticated) {
    return <AuthStackNavigator />;
  }
  
  // Jika sudah login tapi belum setup profil
  if (needsProfileSetup) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PersonalDataSetup" component={PersonalDataScreen} />
      </Stack.Navigator>
    );
  }
  
  // Jika sudah login dan sudah setup profil
  return <MainStackNavigator />;
}

// Komponen AppNavigator yang membungkus semua navigasi dalam NavigationContainer
const AppNavigator = () => {
  return (
      <RootNavigator />
  )
}

export default AppNavigator