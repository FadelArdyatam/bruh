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
  Platform,
  Image,
  KeyboardAvoidingView,
  Animated
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { getUserProfile, updateUserProfile, getAllPangkat, getAllSatuanKerja } from "../../redux/slices/profileSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import { SafeAreaView } from "react-native-safe-area-context"
import { Picker } from "@react-native-picker/picker"
import { Save, ArrowLeft, Calendar, ChevronDown, User, Mail, Phone, MapPin, Briefcase, Award, Ruler, Activity } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import DateTimePicker from "@react-native-community/datetimepicker"
import { completeProfileSetup } from "../../redux/slices/authSlice"

type PersonalData = {
  name: string
  email: string
  no_hp: string
  tempat_lahir: string
  tanggal_lahir: string
  jenis_kelamin: string
  jenis_pekerjaan: string
  intensitas: number
  tinggi_badan: number
  id_satuankerja: number | null
  id_pangkat: number | null
}

const PersonalDataScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { personalData, pangkatList, satuanKerjaList, isLoading } = useSelector((state: RootState) => state.profile)
  const { needsProfileSetup } = useSelector((state: RootState) => state.auth)
  
  const [formData, setFormData] = useState<PersonalData>({
    name: "",
    email: "",
    no_hp: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "Laki-laki",
    jenis_pekerjaan: "",
    intensitas: 0,
    tinggi_badan: 0,
    id_satuankerja: null,
    id_pangkat: null,
  })

  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showGenderPicker, setShowGenderPicker] = useState(false)
  const [showPangkatPicker, setShowPangkatPicker] = useState(false)
  const [showSatuanKerjaPicker, setShowSatuanKerjaPicker] = useState(false)
  const [fadeAnimation] = useState(new Animated.Value(0))
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  
  useEffect(() => {
    dispatch(getUserProfile())
    dispatch(getAllPangkat())
    dispatch(getAllSatuanKerja())
    
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    if (personalData) {
      setFormData({
        name: personalData.nama_lengkap || "",
        email: personalData.email || "",
        no_hp: personalData.no_hp || "",
        tempat_lahir: personalData.tempat_lahir || "",
        tanggal_lahir: personalData.tanggal_lahir || "",
        jenis_kelamin: personalData.jenis_kelamin || "Laki-laki",
        jenis_pekerjaan: personalData.jenis_pekerjaan || "",
        intensitas: personalData.intensitas || 0,
        tinggi_badan: personalData.tinggi_badan || 0,
        id_satuankerja: personalData.id_satuankerja || null,
        id_pangkat: personalData.id_pangkat || null,
      })

      if (personalData.tanggal_lahir) {
        setDate(new Date(personalData.tanggal_lahir))
      }
    }
  }, [personalData])

  const handleChange = (name: keyof PersonalData, value: any) => {
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
    const requiredFields = [
      "name",
      "email",
      "no_hp",
      "tempat_lahir",
      "tanggal_lahir",
      "jenis_kelamin",
      "jenis_pekerjaan",
      "tinggi_badan",
      "id_satuankerja",
      "id_pangkat",
    ]
    const emptyFields = requiredFields.filter((field) => !formData[field as keyof PersonalData])

    if (emptyFields.length > 0) {
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

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      
      if (needsProfileSetup) {
        await dispatch(completeProfileSetup());
        Alert.alert("Sukses", "Data profil berhasil disimpan");
      } else {
        Alert.alert("Sukses", "Data personil berhasil disimpan", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (err) {
      console.error("Update profile failed:", err);
    }
  };

  const renderFieldWithIcon = (
    label: string, 
    value: string | number, 
    placeholder: string, 
    icon: React.ReactNode, 
    onChangeText: (text: any) => void,
    keyboardType: any = "default"
  ) => (
    <View className="mb-4">
      <Text className="text-gray-700 mb-2 font-medium">{label}</Text>
      <View className="flex-row items-center border-none  rounded-full px-3 bg-gray-50">
        {icon}
        <TextInput
          className="flex-1 p-3"
          value={value.toString()}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  )

  const renderPickerField = (
    label: string,
    value: any,
    placeholder: string,
    icon: React.ReactNode,
    onPress: () => void,
    displayText: string
  ) => (
    <View className="mb-4">
      <Text className="text-gray-700 mb-2 font-medium">{label}</Text>
      <TouchableOpacity
        className="flex-row items-center border-none  rounded-full px-3 py-3 bg-gray-50"
        onPress={onPress}
      >
        {icon}
        <Text className={value ? "text-gray-800 ml-3" : "text-gray-400 ml-3"}>
          {displayText || placeholder}
        </Text>
        <ChevronDown size={20} color="#666" className="ml-auto" />
      </TouchableOpacity>
    </View>
  )

  const renderStep1 = () => (
    <View>
      <View className="items-center mb-6">
        <Image 
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/2550/2550383.png" }} 
          className="w-48 h-48" 
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mt-4">Informasi Pribadi</Text>
        <Text className="text-gray-600 text-center">Langkah 1 dari {totalSteps}</Text>
      </View>

      {renderFieldWithIcon(
        "Nama Lengkap", 
        formData.name, 
        "Masukkan nama lengkap", 
        <User size={20} color="#666" className="mr-3" />, 
        (text) => handleChange("name", text)
      )}

      {renderFieldWithIcon(
        "Email", 
        formData.email, 
        "Masukkan email", 
        <Mail size={20} color="#666" className="mr-3" />, 
        (text) => handleChange("email", text),
        "email-address"
      )}

      {renderFieldWithIcon(
        "No. Handphone", 
        formData.no_hp, 
        "Masukkan nomor handphone", 
        <Phone size={20} color="#666" className="mr-3" />, 
        (text) => handleChange("no_hp", text),
        "phone-pad"
      )}

      {renderFieldWithIcon(
        "Tempat Lahir", 
        formData.tempat_lahir, 
        "Masukkan tempat lahir", 
        <MapPin size={20} color="#666" className="mr-3" />, 
        (text) => handleChange("tempat_lahir", text)
      )}

      {renderPickerField(
        "Tanggal Lahir",
        formData.tanggal_lahir,
        "Pilih tanggal lahir",
        <Calendar size={20} color="#666" className="mr-3" />,
        () => setShowDatePicker(true),
        formData.tanggal_lahir
      )}

      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
      )}

      {renderPickerField(
        "Jenis Kelamin",
        formData.jenis_kelamin,
        "Pilih jenis kelamin",
        <User size={20} color="#666" className="mr-3" />,
        () => setShowGenderPicker(true),
        formData.jenis_kelamin
      )}

      {showGenderPicker && (
        <View className="border-none  rounded-full mt-2 mb-4 bg-white">
          <Picker
            selectedValue={formData.jenis_kelamin}
            onValueChange={(itemValue) => {
              handleChange("jenis_kelamin", itemValue)
              setShowGenderPicker(false)
            }}
          >
            <Picker.Item label="Laki-laki" value="Laki-laki" />
            <Picker.Item label="Perempuan" value="Perempuan" />
          </Picker>
        </View>
      )}
    </View>
  )

  const renderStep2 = () => (
    <View>
      <View className="items-center mb-6">
        <Image 
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/2876/2876880.png" }} 
          className="w-48 h-48" 
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mt-4">Informasi Pekerjaan</Text>
        <Text className="text-gray-600 text-center">Langkah 2 dari {totalSteps}</Text>
      </View>

      {renderPickerField(
        "Pangkat",
        formData.id_pangkat,
        "Pilih pangkat",
        <Award size={20} color="#666" className="mr-3" />,
        () => setShowPangkatPicker(true),
        formData.id_pangkat
          ? pangkatList.find((item) => item.id === formData.id_pangkat)?.nama_pangkat
          : ""
      )}

      {showPangkatPicker && (
        <View className="border-none  rounded-full mt-2 mb-4 bg-white">
          <Picker
            selectedValue={formData.id_pangkat}
            onValueChange={(itemValue) => {
              handleChange("id_pangkat", itemValue)
              setShowPangkatPicker(false)
            }}
          >
            <Picker.Item label="Pilih pangkat" value={null} />
            {pangkatList.map((item) => (
              <Picker.Item key={item.id} label={item.nama_pangkat} value={item.id} />
            ))}
          </Picker>
        </View>
      )}

      {renderPickerField(
        "Satuan Kerja",
        formData.id_satuankerja,
        "Pilih satuan kerja",
        <Briefcase size={20} color="#666" className="mr-3" />,
        () => setShowSatuanKerjaPicker(true),
        formData.id_satuankerja
          ? satuanKerjaList.find((item) => item.id === formData.id_satuankerja)?.nama_satuan_kerja
          : ""
      )}

      {showSatuanKerjaPicker && (
        <View className="border-none  rounded-full mt-2 mb-4 bg-white">
          <Picker
            selectedValue={formData.id_satuankerja}
            onValueChange={(itemValue) => {
              handleChange("id_satuankerja", itemValue)
              setShowSatuanKerjaPicker(false)
            }}
          >
            <Picker.Item label="Pilih satuan kerja" value={null} />
            {satuanKerjaList.map((item) => (
              <Picker.Item key={item.id} label={item.nama_satuan_kerja} value={item.id} />
            ))}
          </Picker>
        </View>
      )}

      {renderFieldWithIcon(
        "Jenis Pekerjaan", 
        formData.jenis_pekerjaan, 
        "Masukkan jenis pekerjaan", 
        <Briefcase size={20} color="#666" className="mr-3" />, 
        (text) => handleChange("jenis_pekerjaan", text)
      )}
    </View>
  )

  const renderStep3 = () => (
    <View>
      <View className="items-center mb-6">
        <Image 
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/2175/2175188.png" }} 
          className="w-48 h-48" 
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mt-4">Informasi Fisik</Text>
        <Text className="text-gray-600 text-center">Langkah 3 dari {totalSteps}</Text>
      </View>

      {renderFieldWithIcon(
        "Tinggi Badan (cm)", 
        formData.tinggi_badan || "", 
        "Masukkan tinggi badan", 
        <Ruler size={20} color="#666" className="mr-3" />, 
        (text) => handleChange("tinggi_badan", Number.parseInt(text) || 0),
        "numeric"
      )}

      {renderFieldWithIcon(
        "Intensitas Aktivitas (1-100)", 
        formData.intensitas || "", 
        "Masukkan intensitas aktivitas", 
        <Activity size={20} color="#666" className="mr-3" />, 
        (text) => handleChange("intensitas", Number.parseInt(text) || 0),
        "numeric"
      )}
    </View>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      default:
        return renderStep1()
    }
  }

  const renderProgressBar = () => (
    <View className="flex-row items-center mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View key={index} className="flex-1 flex-row items-center">
          <View 
            className={`h-8 w-8 rounded-full ${
              index + 1 <= currentStep ? 'bg-yellow-500' : 'bg-gray-300'
            } items-center justify-center`}
          >
            <Text className="text-white font-medium">{index + 1}</Text>
          </View>
          {index < totalSteps - 1 && (
            <View 
              className={`flex-1 h-1 ${
                index + 1 < currentStep ? 'bg-yellow-500' : 'bg-gray-300'
              }`}
            />
          )}
        </View>
      ))}
    </View>
  )

  const isLastStep = currentStep === totalSteps

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="bg-white p-4 flex-row items-center">
          <TouchableOpacity className="p-2" onPress={() => {
            if (navigation.canGoBack() && !needsProfileSetup) {
              navigation.goBack()
            }
          }}>
            <ArrowLeft size={24} color="#FFB800" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 ml-2">
            {needsProfileSetup ? "LENGKAPI PROFIL" : "DATA PERSONEL"}
          </Text>
        </View>

        <ScrollView className="flex-1 p-4">
          <Animated.View
            style={{ opacity: fadeAnimation }}
          >
            {renderProgressBar()}
            
            {renderCurrentStep()}

            <View className="flex-row mt-6 mb-6">
              {currentStep > 1 && (
                <TouchableOpacity
                  className="flex-1 bg-gray-300 py-4 rounded-full mr-2"
                  onPress={handlePrevious}
                >
                  <Text className="text-white text-center font-bold">KEMBALI</Text>
                </TouchableOpacity>
              )}
              
              {isLastStep ? (
                <TouchableOpacity
                  className="flex-1 bg-yellow-500 py-4 rounded-full ml-2"
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-white text-center font-bold">SIMPAN</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="flex-1 bg-yellow-500 py-4 rounded-full ml-2"
                  onPress={handleNext}
                >
                  <Text className="text-white text-center font-bold">LANJUT</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

export default PersonalDataScreen