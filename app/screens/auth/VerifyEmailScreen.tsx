"use client"

import { useState, useEffect, useRef } from "react"
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator, 
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native"
import { useNavigation, type RouteProp, useRoute } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { SafeAreaView } from "react-native-safe-area-context"
import { Mail, ArrowLeft, RefreshCw } from "lucide-react-native"
import { useDispatch, useSelector } from "react-redux"
import { verifyOTP, regenerateOTP } from "../../redux/slices/authSlice"
import type { AppDispatch, RootState } from "../../redux/store"

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
        className={`w-12 h-14 border-2 rounded-full justify-center items-center mx-1 ${
          isInputBoxFocused && isValueFocused ? "border-yellow-500" : "border-none"
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
  const { email = "" } = route.params || {}
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const [otp, setOtp] = useState("")
  const [userEmail, setUserEmail] = useState(email)
  const [isPinReady, setIsPinReady] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [fadeAnimation] = useState(new Animated.Value(0))

  useEffect(() => {
    if (!userEmail && route.params?.email) {
      setUserEmail(route.params.email)
    }
  }, [route.params])

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
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

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="p-4 flex-row items-center">
          <TouchableOpacity 
            className="p-2" 
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate("Login");
              }
            }}
          >
            <ArrowLeft size={24} color="#FFB800" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 ml-2">VERIFIKASI EMAIL</Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Animated.View 
            className="flex-1 p-6 justify-center" 
            style={{ opacity: fadeAnimation }}
          >
            {/* Illustration and Header */}
            <View className="items-center mb-8">
              <Image 
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/6928/6928921.png" }} 
                className="w-48 h-48" 
                resizeMode="contain"
              />
              <Text className="text-2xl font-bold text-gray-800 mt-4">Verifikasi Email Anda</Text>
              <Text className="text-gray-600 text-center mt-2">
                Kami telah mengirimkan kode verifikasi ke email Anda:
              </Text>
              <Text className="text-yellow-600 font-medium text-lg mt-2">{userEmail}</Text>
            </View>

            {/* OTP Input */}
            <View className="mb-8">
              <Text className="text-gray-600 text-center mb-4">
                Masukkan kode 6 digit yang dikirim ke email Anda untuk verifikasi
              </Text>
              <OTPInput code={otp} setCode={setOtp} maximumLength={6} setIsPinReady={setIsPinReady} />
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              className={`py-4 px-6 rounded-full w-full mb-6 shadow-md ${isPinReady ? "bg-yellow-500" : "bg-gray-300"}`}
              onPress={handleVerify}
              disabled={isLoading || !isPinReady}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">Verifikasi</Text>
              )}
            </TouchableOpacity>

            {/* Resend OTP */}
            <TouchableOpacity
              className="flex-row items-center justify-center"
              onPress={handleRegenerateOTP}
              disabled={isLoading || resendDisabled}
            >
              <RefreshCw size={16} color={resendDisabled ? "#9CA3AF" : "#FFB800"} />
              <Text className={resendDisabled ? "text-gray-400 ml-2" : "text-yellow-600 ml-2"}>
                {resendDisabled ? `Kirim ulang dalam ${countdown}s` : "Kirim Ulang Kode"}
              </Text>
            </TouchableOpacity>

            {/* Error Message */}
            {error && (
              <View className="bg-red-100 p-4 rounded-full mt-6">
                <Text className="text-red-500 text-center">{error}</Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default VerifyEmailScreen