"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { registerUser, clearError } from "../../redux/slices/authSlice"
import { getParentSatuanKerja, getChildSatuanKerja } from "../../redux/slices/profileSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Send, Calendar, ChevronDown } from "lucide-react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
import { LinearGradient } from "expo-linear-gradient"

type FormData = {
  nama_lengkap: string
  username: string
  email: string
  no_hp: string
  tempat_lahir: string
  tanggal_lahir: string
  id_satuankerja: number | null
}

const RegisterScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)
  const { parentSatuanKerjaList, childSatuanKerjaList } = useSelector((state: RootState) => state.profile)

  const [formData, setFormData] = useState<FormData>({
    nama_lengkap: "",
    username: "",
    email: "",
    no_hp: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    id_satuankerja: null,
  })

  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null)
  const [showSatuanKerjaPicker, setShowSatuanKerjaPicker] = useState(false)
  const [showChildSatuanKerjaPicker, setShowChildSatuanKerjaPicker] = useState(false)
  const [formAnimation] = useState(new Animated.Value(0))

  useEffect(() => {
    dispatch(clearError())
    dispatch(getParentSatuanKerja())

    Animated.timing(formAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    if (selectedParentId) {
      dispatch(getChildSatuanKerja(selectedParentId))
    }
  }, [selectedParentId])

  const handleChange = (name: keyof FormData, value: any) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date
    setShowDatePicker(Platform.OS === "ios")
    setDate(currentDate)

    const formattedDate = currentDate.toISOString().split("T")[0] // YYYY-MM-DD
    handleChange("tanggal_lahir", formattedDate)
  }

  const validateForm = () => {
    if (
      !formData.nama_lengkap ||
      !formData.username ||
      !formData.email ||
      !formData.no_hp ||
      !formData.tempat_lahir ||
      !formData.tanggal_lahir ||
      !formData.id_satuankerja
    ) {
      Alert.alert("Error", "Semua kolom harus diisi")
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Format email tidak valid")
      return false
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{10,13}$/
    if (!phoneRegex.test(formData.no_hp)) {
      Alert.alert("Error", "Nomor handphone harus berisi 10-13 digit angka")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const result = await dispatch(registerUser(formData)).unwrap()

      console.log("Registration result:", result)
      // Show alert first, then navigate to verification screen when user clicks the button
      Alert.alert("Pendaftaran Berhasil", "Silahkan masukkan kode verifikasi yang dikirim ke email Anda", [
        {
          
          text: "Verifikasi Email",
          onPress: () => {
            console.log("Navigating to VerifyEmail")
            navigation.navigate("VerifyEmail", { email: formData.email })
          },
        },
      ])
    } catch (err) {
      console.error("Registration failed:", err)
    }
  }

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
        <View className="p-4 flex-row items-center">
          <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white ml-2">DAFTAR AKUN BARU</Text>
        </View>

        <ScrollView className="flex-1">
          <Animated.View
            className="p-4"
            style={{
              opacity: formOpacity,
              transform: [{ translateY: formTranslateY }],
            }}
          >
            <View className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
              <Text className="text-xl font-bold text-gray-800 mb-6">Informasi Akun</Text>

              <View className="space-y-4">
                <View>
                  <Text className="text-gray-700 mb-2 font-medium">Nama Lengkap</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                    value={formData.nama_lengkap}
                    onChangeText={(text) => handleChange("nama_lengkap", text)}
                    placeholder="Masukkan nama lengkap"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 mb-2 font-medium">NIP / NRP</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                    value={formData.username}
                    onChangeText={(text) => handleChange("username", text)}
                    placeholder="Masukkan NIP/NRP"
                    keyboardType="numeric"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                    value={formData.email}
                    onChangeText={(text) => handleChange("email", text)}
                    placeholder="Masukkan email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 mb-2 font-medium">No. Handphone</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                    value={formData.no_hp}
                    onChangeText={(text) => handleChange("no_hp", text)}
                    placeholder="Masukkan nomor handphone"
                    keyboardType="phone-pad"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 mb-2 font-medium">Tempat Lahir</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                    value={formData.tempat_lahir}
                    onChangeText={(text) => handleChange("tempat_lahir", text)}
                    placeholder="Masukkan tempat lahir"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 mb-2 font-medium">Tanggal Lahir</Text>
                  <TouchableOpacity
                    className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50"
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text className={formData.tanggal_lahir ? "text-gray-800" : "text-gray-400"}>
                      {formData.tanggal_lahir ? formData.tanggal_lahir : "Pilih tanggal lahir"}
                    </Text>
                    <Calendar size={20} color="#666" className="ml-auto" />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
                  )}
                </View>

                <View>
                  <Text className="text-gray-700 mb-2 font-medium">Satuan Kerja</Text>
                  <TouchableOpacity
                    className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50"
                    onPress={() => setShowSatuanKerjaPicker(true)}
                  >
                    <Text className={selectedParentId ? "text-gray-800" : "text-gray-400"}>
                      {selectedParentId
                        ? parentSatuanKerjaList.find((item) => item.id === selectedParentId)?.nama_satuan_kerja
                        : "Pilih satuan kerja induk"}
                    </Text>
                    <ChevronDown size={20} color="#666" className="ml-auto" />
                  </TouchableOpacity>

                  {showSatuanKerjaPicker && (
                    <View className="border border-gray-300 rounded-lg mt-2 bg-white">
                      <Picker
                        selectedValue={selectedParentId}
                        onValueChange={(itemValue) => {
                          setSelectedParentId(itemValue)
                          setShowSatuanKerjaPicker(false)
                        }}
                      >
                        <Picker.Item label="Pilih satuan kerja induk" value={null} />
                        {parentSatuanKerjaList.map((item) => (
                          <Picker.Item key={item.id} label={item.nama_satuan_kerja} value={item.id} />
                        ))}
                      </Picker>
                    </View>
                  )}
                </View>

                {selectedParentId && (
                  <View>
                    <Text className="text-gray-700 mb-2 font-medium">Sub Satuan Kerja</Text>
                    <TouchableOpacity
                      className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50"
                      onPress={() => setShowChildSatuanKerjaPicker(true)}
                    >
                      <Text className={formData.id_satuankerja ? "text-gray-800" : "text-gray-400"}>
                        {formData.id_satuankerja
                          ? childSatuanKerjaList.find((item) => item.id === formData.id_satuankerja)?.nama_satuan_kerja
                          : "Pilih sub satuan kerja"}
                      </Text>
                      <ChevronDown size={20} color="#666" className="ml-auto" />
                    </TouchableOpacity>

                    {showChildSatuanKerjaPicker && (
                      <View className="border border-gray-300 rounded-lg mt-2 bg-white">
                        <Picker
                          selectedValue={formData.id_satuankerja}
                          onValueChange={(itemValue) => {
                            handleChange("id_satuankerja", itemValue)
                            setShowChildSatuanKerjaPicker(false)
                          }}
                        >
                          <Picker.Item label="Pilih sub satuan kerja" value={null} />
                          {childSatuanKerjaList.map((item) => (
                            <Picker.Item key={item.id} label={item.nama_satuan_kerja} value={item.id} />
                          ))}
                        </Picker>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              className="bg-yellow-600 py-4 px-6 rounded-lg flex-row items-center justify-center shadow-md mb-6"
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Text className="text-white font-bold text-lg mr-2">KIRIM</Text>
                  <Send size={20} color="white" />
                </>
              )}
            </TouchableOpacity>

            {error && (
              <View className="bg-red-100 p-4 rounded-lg mb-4">
                <Text className="text-red-500 text-center">{error}</Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default RegisterScreen

