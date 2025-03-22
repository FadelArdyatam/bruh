"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { registerUser, clearError } from "../../redux/slices/authSlice"
import { getParentSatuanKerja, getChildSatuanKerja } from "../../redux/slices/profileSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Send, Calendar, ChevronDown, Mail, Phone, MapPin, User, Briefcase, Shield } from "lucide-react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"

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
  const [fadeAnimation] = useState(new Animated.Value(0))

  useEffect(() => {
    dispatch(clearError())
    dispatch(getParentSatuanKerja())

    Animated.timing(fadeAnimation, {
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
      await dispatch(registerUser(formData)).unwrap()
      
      Alert.alert(
        "Pendaftaran Berhasil", 
        "Silahkan masukkan kode verifikasi yang dikirim ke email Anda"
      )
      
      navigation.navigate("VerifyEmail", { email: formData.email })
      
    } catch (err) {
      console.error("Registration failed:", err)
    }
  }

  const renderFieldWithIcon = (
    label: string, 
    value: string, 
    placeholder: string, 
    icon: React.ReactNode, 
    onChangeText: (text: string) => void,
    keyboardType: any = "default",
    secureTextEntry: boolean = false
  ) => (
    <View className="mb-4">
      <Text className="text-gray-700 mb-2 font-medium">{label}</Text>
      <View className="flex-row items-center border-none  rounded-full px-3 bg-gray-50">
        {icon}
        <TextInput
          className="flex-1 p-3"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
      </View>
    </View>
  )

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="p-4 flex-row items-center">
          <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#FFB800" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 ml-2">DAFTAR AKUN BARU</Text>
        </View>

        <ScrollView className="flex-1">
          <Animated.View 
            className="p-6"
            style={{ opacity: fadeAnimation }}
          >
            {/* Illustration */}
            <View className="items-center mb-6">
              <Image 
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/3456/3456426.png" }} 
                className="w-48 h-48" 
                resizeMode="contain"
              />
              <Text className="text-2xl font-bold text-gray-800 mt-4">Lengkapi Profil Anda</Text>
              <Text className="text-base text-gray-500 text-center">Informasi ini membantu kami mengenali Anda lebih baik</Text>
            </View>

            {/* Form */}
            <View className="mb-6">
              {renderFieldWithIcon(
                "Nama Lengkap", 
                formData.nama_lengkap, 
                "Masukkan nama lengkap", 
                <User size={20} color="#666" />, 
                (text) => handleChange("nama_lengkap", text)
              )}

              {renderFieldWithIcon(
                "NIP / NRP", 
                formData.username, 
                "Masukkan NIP/NRP", 
                <Shield size={20} color="#666" />, 
                (text) => handleChange("username", text),
                "numeric"
              )}

              {renderFieldWithIcon(
                "Email", 
                formData.email, 
                "Masukkan email", 
                <Mail size={20} color="#666" />, 
                (text) => handleChange("email", text),
                "email-address"
              )}

              {renderFieldWithIcon(
                "No. Handphone", 
                formData.no_hp, 
                "Masukkan nomor handphone", 
                <Phone size={20} color="#666" />, 
                (text) => handleChange("no_hp", text),
                "phone-pad"
              )}

              {renderFieldWithIcon(
                "Tempat Lahir", 
                formData.tempat_lahir, 
                "Masukkan tempat lahir", 
                <MapPin size={20} color="#666" />, 
                (text) => handleChange("tempat_lahir", text)
              )}

              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Tanggal Lahir</Text>
                <TouchableOpacity
                  className="flex-row items-center border-none  rounded-full px-3 py-3 bg-gray-50"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar size={20} color="#666" className="mr-3" />
                  <Text className={formData.tanggal_lahir ? "text-gray-800" : "text-gray-400"}>
                    {formData.tanggal_lahir ? formData.tanggal_lahir : "Pilih tanggal lahir"}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
                )}
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Satuan Kerja</Text>
                <TouchableOpacity
                  className="flex-row items-center border-none  rounded-full px-3 py-3 bg-gray-50"
                  onPress={() => setShowSatuanKerjaPicker(true)}
                >
                  <Briefcase size={20} color="#666" className="mr-3" />
                  <Text className={selectedParentId ? "text-gray-800" : "text-gray-400"}>
                    {selectedParentId
                      ? parentSatuanKerjaList.find((item) => item.id === selectedParentId)?.nama_satuan_kerja
                      : "Pilih satuan kerja induk"}
                  </Text>
                  <ChevronDown size={20} color="#666" className="ml-auto" />
                </TouchableOpacity>

                {showSatuanKerjaPicker && (
                  <View className="border-none  rounded-full mt-2 bg-white">
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
                <View className="mb-4">
                  <Text className="text-gray-700 mb-2 font-medium">Sub Satuan Kerja</Text>
                  <TouchableOpacity
                    className="flex-row items-center border-none  rounded-full px-3 py-3 bg-gray-50"
                    onPress={() => setShowChildSatuanKerjaPicker(true)}
                  >
                    <Briefcase size={20} color="#666" className="mr-3" />
                    <Text className={formData.id_satuankerja ? "text-gray-800" : "text-gray-400"}>
                      {formData.id_satuankerja
                        ? childSatuanKerjaList.find((item) => item.id === formData.id_satuankerja)?.nama_satuan_kerja
                        : "Pilih sub satuan kerja"}
                    </Text>
                    <ChevronDown size={20} color="#666" className="ml-auto" />
                  </TouchableOpacity>

                  {showChildSatuanKerjaPicker && (
                    <View className="border-none  rounded-full mt-2 bg-white">
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

            <TouchableOpacity
              className="bg-yellow-500 py-4 px-6 rounded-full flex-row items-center justify-center shadow-md mb-6"
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Text className="text-white font-bold text-lg">DAFTAR</Text>
                </>
              )}
            </TouchableOpacity>

            {error && (
              <View className="bg-red-100 p-4 rounded-full mb-4">
                <Text className="text-red-500 text-center">{error}</Text>
              </View>
            )}
            
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen