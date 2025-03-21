"use client"

import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Animated } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Mail } from "lucide-react-native"
import { useDispatch, useSelector } from "react-redux"
import { forgotPassword } from "../../redux/slices/authSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import { LinearGradient } from "expo-linear-gradient"

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>()
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const [email, setEmail] = useState("")
  const [fadeAnim] = useState(new Animated.Value(0))

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [])

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Silahkan masukkan email Anda")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Format email tidak valid")
      return
    }

    try {
      await dispatch(forgotPassword(email)).unwrap()
      Alert.alert("Reset Password Berhasil", "Password baru telah dikirim ke email Anda", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ])
    } catch (err) {
      console.error("Password reset failed:", err)
    }
  }

  return (
    <LinearGradient colors={["#FFB800", "#FF8A00"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="p-4 flex-row items-center">
          <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white ml-2">LUPA PASSWORD</Text>
        </View>

        <Animated.View className="flex-1 p-6 justify-center" style={{ opacity: fadeAnim }}>
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <View className="items-center mb-6">
              <View className="bg-yellow-100 p-4 rounded-full mb-4">
                <Mail size={50} color="#FFB800" />
              </View>
              <Text className="text-2xl font-bold text-center">Reset Password</Text>
              <Text className="text-gray-600 text-center mt-2">Masukkan email Anda untuk menerima password baru</Text>
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                value={email}
                onChangeText={setEmail}
                placeholder="Masukkan email Anda"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              className="bg-yellow-500 py-3 rounded-lg shadow-md"
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">Kirim Password Baru</Text>
              )}
            </TouchableOpacity>
          </View>

          {error && (
            <View className="bg-red-100 p-4 rounded-lg mt-4">
              <Text className="text-red-500 text-center">{error}</Text>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default ForgotPasswordScreen

