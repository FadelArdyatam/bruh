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
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { loginUser, clearError } from "../../redux/slices/authSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { SafeAreaView } from "react-native-safe-area-context"
import { Lock, User, Eye, EyeOff } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [logoAnimation] = useState(new Animated.Value(0))
  const [formAnimation] = useState(new Animated.Value(0))

  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError())

    // Start animations
    Animated.sequence([
      Animated.timing(logoAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(formAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()

    // Add keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      Animated.timing(logoAnimation, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(logoAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
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

  const logoScale = logoAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 0.9, 1],
  })

  const formTranslateY = formAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  })

  const formOpacity = formAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  return (
    <LinearGradient colors={["#FFB800", "#FF8A00"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center p-6">
          <Animated.View
            className="items-center mb-8"
            style={{
              transform: [{ scale: logoScale }],
            }}
          >
            <View className="bg-white p-5 rounded-full mb-4 shadow-lg">
              <Image source={require("../../../assets/images/icon.png")} className="w-24 h-24" />
            </View>
            <Text className="text-3xl font-bold text-white">SI POLGAR</Text>
            <Text className="text-white text-lg">Sistem Informasi Polisi Bugar</Text>
          </Animated.View>

          <Animated.View
            className="bg-white rounded-2xl p-6 mb-6 shadow-lg"
            style={{
              opacity: formOpacity,
              transform: [{ translateY: formTranslateY }],
            }}
          >
            <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Username</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-gray-50">
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

            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-gray-50">
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

            <TouchableOpacity className="mb-4" onPress={() => navigation.navigate("ForgotPassword")}>
              <Text className="text-blue-500 text-right">Lupa Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-yellow-500 py-3 rounded-lg shadow-md"
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">LOGIN</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={{
              opacity: formOpacity,
            }}
          >
            <TouchableOpacity className="items-center" onPress={() => navigation.navigate("Register")}>
              <Text className="text-white font-bold text-lg">BUAT AKUN BARU</Text>
            </TouchableOpacity>

            {error && (
              <View className="mt-4 bg-red-100 p-3 rounded-lg">
                <Text className="text-red-500 text-center">{error}</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default LoginScreen

