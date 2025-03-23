"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearError } from "../../redux/slices/authSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { SafeAreaView } from "react-native-safe-area-context"
import { Lock, User, Eye, EyeOff } from "lucide-react-native"

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [fadeAnimation] = useState(new Animated.Value(0))

  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError())

    // Start animation
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Username dan password harus diisi")
      return
    }

    try {
      await dispatch(loginUser({ username, password })).unwrap()
      // Navigation will be handled by the AppNavigator based on auth state
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Animated.View 
            className="flex-1 px-6 py-10 justify-between"
            style={{ opacity: fadeAnimation }}
          >
            {/* Header and Illustration */}
            <View className="items-center mt-10">
              <Image 
                source={require("../../../assets/images/police-login.png")} 
                className="w-56 h-56" 
                resizeMode="contain"
              />
              <Text className="text-3xl font-bold text-gray-800 mt-6">SI POLGAR</Text>
              <Text className="text-base text-gray-500">Sistem Informasi Polisi Bugar</Text>
            </View>

            {/* Login Form */}
            <View className="mt-6">
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Username</Text>
                <View className="flex-row items-center border-none  rounded-full px-3 bg-gray-50">
                  <User size={20} color="#666" />
                  <TextInput
                    className="flex-1 p-3"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Masukkan username"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                <View className="flex-row items-center border-none  rounded-full px-3 bg-gray-50">
                  <Lock size={20} color="#666" />
                  <TextInput
                    className="flex-1 p-3"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Masukkan password"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity className="mb-6" onPress={() => navigation.navigate("ForgotPassword")}>
                <Text className="text-yellow-600 text-right">Lupa Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-yellow-500 py-4 rounded-full shadow-md"
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-center font-bold text-lg">MASUK</Text>
                )}
              </TouchableOpacity>
            
              {error && (
                <View className="mt-4 bg-red-100 p-3 rounded-full">
                  <Text className="text-red-500 text-center">{error}</Text>
                </View>
              )}
            </View>

            {/* Footer */}
            <View className="mt-8 items-center">
              <Text className="text-gray-700 mb-2">Belum memiliki akun?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text className="text-yellow-600 font-bold text-lg">BUAT AKUN BARU</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen