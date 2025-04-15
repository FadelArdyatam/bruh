import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { NavigationContainer } from "@react-navigation/native"
import { View } from "react-native"

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
import TrainingProgramScreen from "../screens/app/Workout/TrainingProgramScreen"
import FoodRecallScreen from "../screens/app/Food/FoodRecallScreen"
import SettingsScreen from "../screens/app/SettingsScreen"
import ChangePasswordScreen from "../screens/app/ChangePasswordScreen"
import ProfilePhotoEditScreen from "../screens/app/ProfilePhotoEditScreen"

// Custom Navigation
import CustomBottomNavigation from "../components/BottomNavigator"
import DietScreen from "../screens/app/Diet/dietScreen"
import WorkoutScreen from "../screens/app/WorkoutScreen"
import WorkoutListScreen from "../screens/app/Workout/WorkoutListScreen"
import WorkoutDetailScreen from "../screens/app/Workout/WorkoutDetailScreen"
import LogWorkoutScreen from "../screens/app/Workout/LogWorkoutScreen"
import WorkoutHistoryScreen from "../screens/app/Workout/WorkoutHistoryScreen"
import WorkoutAnalysisScreen from "../screens/app/Workout/WorkoutAnalysisScreen"
import WorkoutScheduleScreen from "../screens/app/Workout/WorkoutScheduleScreen"
import AddWorkoutScheduleScreen from "../screens/app/Workout/AddWorkoutScheduleScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const AuthStack = createStackNavigator()
const MainStack = createStackNavigator()

// Tab navigator dengan custom styling
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomBottomNavigation {...props} />}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen 
        name="IMTTab" 
        component={IMTScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen 
        name="TrainingProgramTab" 
        component={TrainingProgramScreen}
        options={{
          tabBarLabel: 'Analytics',
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="WorkoutTab"
        component={WorkoutScreen}
        options={{
          tabBarLabel: '',
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
      <MainStack.Screen name="ProfilePhotoEdit" component={ProfilePhotoEditScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
      
      {/* Screen untuk jadwal latihan */}

      <MainStack.Screen name="DietPlan" component={DietScreen} />
      <MainStack.Screen name="WorkoutList" component={WorkoutListScreen}/>
      <MainStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen}/>
      <MainStack.Screen name="LogWorkout" component={LogWorkoutScreen}/>
      <MainStack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen}/>
      <MainStack.Screen name="WorkoutAnalysis" component={WorkoutAnalysisScreen}/>
      <MainStack.Screen name="WorkoutSchedule" component={WorkoutScheduleScreen}/>
      <MainStack.Screen name="AddWorkoutSchedule" component={AddWorkoutScheduleScreen}/>

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