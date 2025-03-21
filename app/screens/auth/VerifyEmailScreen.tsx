"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, Animated } from "react-native"
import { useNavigation, type RouteProp, useRoute } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { SafeAreaView } from "react-native-safe-area-context"
import { Mail, ArrowLeft, RefreshCw } from "lucide-react-native"
import { useDispatch, useSelector } from "react-redux"
import { verifyOTP, regenerateOTP } from "../../redux/slices/authSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import { LinearGradient } from "expo-linear-gradient"

type RouteParams = {
  VerifyEmail: {
    email: string
  }
}

const OTPInput = ({
  code,
  setCode,
  maximumLength,
  setIsPinReady,
}: {
  code: string
  setCode: (code: string) => void
  maximumLength: number
  setIsPinReady: (ready: boolean) => void
}) => {
  const boxArray = new Array(maximumLength).fill(0)
  const inputRef = useRef<TextInput>(null)
  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false)

  useEffect(() => {
    setIsPinReady(code.length === maximumLength)
    return () => {
      setIsPinReady(false)
    }
  }, [code, maximumLength, setIsPinReady])

  const boxDigit = (_: any, index: number) => {
    const emptyInput = ""
    const digit = code[index] || emptyInput

    const isCurrentValue = index === code.length
    const isLastValue = index === maximumLength - 1
    const isCodeComplete = code.length === maximumLength

    const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete)

    return (
      <View
        key={index}
        className={`w-12 h-14 border-2 rounded-lg justify-center items-center mx-1 ${
          isInputBoxFocused && isValueFocused ? "border-yellow-500" : "border-gray-300"
        } ${digit ? "bg-gray-50" : "bg-white"}`}
      >
        <Text className="text-xl font-bold text-gray-800">{digit}</Text>
      </View>
    )
  }

  return (
    <View>
      <TouchableOpacity
        className="flex-row justify-center"
        onPress={() => {
          inputRef.current?.focus()
        }}
      >
        {boxArray.map(boxDigit)}
      </TouchableOpacity>
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={setCode}
        maxLength={maximumLength}
        keyboardType="number-pad"
        className="absolute opacity-0"
        onFocus={() => setIsInputBoxFocused(true)}
        onBlur={() => setIsInputBoxFocused(false)}
      />
    </View>
  )
}

const VerifyEmailScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>()
  const route = useRoute<RouteProp<RouteParams, "VerifyEmail">>()
  const { email = "" } = route.params || {} // Fallback untuk mencegah params undefined
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const [otp, setOtp] = useState("")
  const [userEmail, setUserEmail] = useState(email) // Store email dari parameter navigasi
  const [isPinReady, setIsPinReady] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [fadeAnim] = useState(new Animated.Value(0))

  // Debugging: log email yang diterima
  useEffect(() => {
    console.log("Email from route params:", email)
    console.log("Current userEmail state:", userEmail)
  }, [email, userEmail])

  // Jika email tidak tersedia dari route.params, coba ambil dari params lainnya
  useEffect(() => {
    if (!userEmail && route.params?.email) {
      console.log("Setting userEmail from route.params:", route.params.email)
      setUserEmail(route.params.email)
    }
  }, [route.params])

  useEffect(() => {
    // Regenerate OTP ketika email tersedia
    if (userEmail) {
      console.log("Regenerating OTP for email:", userEmail)
      dispatch(regenerateOTP(userEmail))
        .unwrap()
        .then(() => {
          console.log("OTP regenerated successfully")
        })
        .catch((err) => {
          console.error("Failed to regenerate OTP:", err)
        })
    } else {
      console.warn("Cannot regenerate OTP: Email is empty")
    }
  }, [userEmail])

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      setResendDisabled(false)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown, resendDisabled])

  const handleVerify = async () => {
    if (!isPinReady) {
      Alert.alert("Error", "Silahkan masukkan kode OTP 6 digit")
      return
    }

    if (!userEmail) {
      Alert.alert("Error", "Email tidak valid")
      return
    }

    try {
      console.log("Verifying OTP for email:", userEmail, "with OTP:", otp)
      await dispatch(verifyOTP({ email: userEmail, otp: otp })).unwrap()
      Alert.alert(
        "Verifikasi Berhasil",
        "Email Anda telah diverifikasi. Silahkan login dengan username dan password yang telah dikirimkan ke email Anda.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ],
      )
    } catch (err) {
      console.error("Verification failed:", err)
    }
  }

  const handleRegenerateOTP = async () => {
    if (resendDisabled) return

    if (!userEmail) {
      Alert.alert("Error", "Email tidak valid")
      return
    }

    try {
      await dispatch(regenerateOTP(userEmail)).unwrap()
      Alert.alert("Sukses", "Kode verifikasi baru telah dikirim ke email Anda")
      setResendDisabled(true)
      setCountdown(60)
    } catch (err) {
      console.error("OTP regeneration failed:", err)
    }
  }

  // Update references to email in JSX to use userEmail
  return (
    <LinearGradient colors={["#FFB800", "#FF8A00"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="p-4 flex-row items-center">
          <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white ml-2">VERIFIKASI EMAIL</Text>
        </View>

        <Animated.View className="flex-1 p-6 justify-center" style={{ opacity: fadeAnim }}>
          <View className="bg-white rounded-2xl p-6 items-center shadow-lg">
            <View className="bg-yellow-100 p-4 rounded-full mb-6">
              <Mail size={60} color="#FFB800" />
            </View>

            <Text className="text-2xl font-bold text-center mb-2">Verifikasi Email</Text>
            <Text className="text-gray-600 text-center mb-6">
              Kami telah mengirimkan kode verifikasi ke email Anda:
            </Text>

            <Text className="text-blue-500 font-bold text-lg mb-6">{userEmail}</Text>

            <Text className="text-gray-600 text-center mb-4">
              Masukkan kode 6 digit yang dikirim ke email Anda untuk verifikasi.
            </Text>

            <View className="mb-6 w-full">
              <OTPInput code={otp} setCode={setOtp} maximumLength={6} setIsPinReady={setIsPinReady} />
            </View>

            <TouchableOpacity
              className={`py-3 px-6 rounded-lg w-full mb-4 shadow-md ${isPinReady ? "bg-yellow-500" : "bg-gray-300"}`}
              onPress={handleVerify}
              disabled={isLoading || !isPinReady}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">Verifikasi</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-center mt-4"
              onPress={handleRegenerateOTP}
              disabled={isLoading || resendDisabled}
            >
              <RefreshCw size={16} color={resendDisabled ? "#9CA3AF" : "#3B82F6"} />
              <Text className={resendDisabled ? "text-gray-400 ml-2" : "text-blue-500 ml-2"}>
                {resendDisabled ? `Kirim ulang dalam ${countdown}s` : "Kirim Ulang Kode"}
              </Text>
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

export default VerifyEmailScreen