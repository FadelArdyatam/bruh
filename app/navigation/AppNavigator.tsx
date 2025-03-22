import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
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

const TabIcon = ({ icon: Icon, focused, label }: { icon: any; focused: boolean; label: string }) => (
  <View className="items-center justify-center">
    <Icon size={22} color={focused ? "#FFB800" : "#9CA3AF"} />
    <Text className={`text-xs mt-1 ${focused ? "text-yellow-500 font-medium" : "text-gray-500"}`}>{label}</Text>
  </View>
)

const AppTabs = () => {
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
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={Home} focused={focused} label="Beranda" />,
        }}
      />
      <Tab.Screen
        name="IMT"
        component={IMTScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={BarChart3} focused={focused} label="IMT" />,
        }}
      />
      <Tab.Screen
        name="TrainingProgram"
        component={TrainingProgramScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={Activity} focused={focused} label="Latihan" />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={User} focused={focused} label="Profil" />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={Settings} focused={focused} label="Pengaturan" />,
        }}
      />
    </Tab.Navigator>
  )
}

const AppNavigator = () => {
  const { isAuthenticated, isLoading, pendingVerification, pendingEmail, needsProfileSetup } = useSelector((state: RootState) => state.auth)

  console.log("Auth state:", { isAuthenticated, isLoading, pendingVerification, pendingEmail, needsProfileSetup });

  if (isLoading) {
    // Return splash screen or loading indicator here
    return null
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth Stack - User is not authenticated
        <>
          {pendingVerification && pendingEmail ? (
            // Show VerifyEmail first if registration is pending verification
            <>
              <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} initialParams={{ email: pendingEmail }} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          ) : (
            // Normal auth flow - Login first
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          )}
        </>
      ) : needsProfileSetup ? (
        // User is authenticated but needs to complete profile setup
        <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
      ) : (
        // Main App Stack - User is authenticated and profile is complete
        <>
          <Stack.Screen name="MainApp" component={AppTabs} />
          <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
          <Stack.Screen name="FoodRecall" component={FoodRecallScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator