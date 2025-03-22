"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { getUserProfile, updateUserProfile, getAllPangkat, getAllSatuanKerja } from "../../redux/slices/profileSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import { SafeAreaView } from "react-native-safe-area-context"
import { Picker } from "@react-native-picker/picker"
import { Save, ArrowLeft, Calendar, ChevronDown } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import DateTimePicker from "@react-native-community/datetimepicker"

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
  const { needsProfileSetup } = useSelector((state: RootState) => state.auth);
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
  
  useEffect(() => {
    dispatch(getUserProfile())
    dispatch(getAllPangkat())
    dispatch(getAllSatuanKerja())
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

  const handle = async () => {
    if (!validateForm()) return

    try {
      await dispatch(updateUserProfile(formData)).unwrap()
      Alert.alert("Sukses", "Data personil berhasil disimpan", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (err) {
      console.error("Update profile failed:", err)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      
      // Jika ini adalah pengaturan profil awal, atur needsProfileSetup menjadi false
      if (needsProfileSetup) {
        dispatch({ type: 'auth/setupProfileComplete' });
        // Navigasi ke halaman utama
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      } else {
        // Kembali ke halaman sebelumnya jika hanya update profil biasa
        Alert.alert("Sukses", "Data personil berhasil disimpan", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (err) {
      console.error("Update profile failed:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-yellow-500 p-4 flex-row items-center">
        <TouchableOpacity className="p-2" onPress={() => {
          if (navigation.canGoBack()){
            navigation.goBack()
          }else{
            navigation.navigate("MainApp")
          }
        }}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white ml-2">DATA PERSONEL</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Informasi Pribadi</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Nama Lengkap</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                placeholder="Masukkan nama lengkap"
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
              <Text className="text-gray-700 mb-2 font-medium">Jenis Kelamin</Text>
              <TouchableOpacity
                className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50"
                onPress={() => setShowGenderPicker(true)}
              >
                <Text className="text-gray-800">{formData.jenis_kelamin}</Text>
                <ChevronDown size={20} color="#666" className="ml-auto" />
              </TouchableOpacity>

              {showGenderPicker && (
                <View className="border border-gray-300 rounded-lg mt-2 bg-white">
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
          </View>
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Informasi Pekerjaan</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Pangkat</Text>
              <TouchableOpacity
                className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50"
                onPress={() => setShowPangkatPicker(true)}
              >
                <Text className={formData.id_pangkat ? "text-gray-800" : "text-gray-400"}>
                  {formData.id_pangkat
                    ? pangkatList.find((item) => item.id === formData.id_pangkat)?.nama_pangkat
                    : "Pilih pangkat"}
                </Text>
                <ChevronDown size={20} color="#666" className="ml-auto" />
              </TouchableOpacity>

              {showPangkatPicker && (
                <View className="border border-gray-300 rounded-lg mt-2 bg-white">
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
            </View>

            <View>
              <Text className="text-gray-700 mb-2 font-medium">Satuan Kerja</Text>
              <TouchableOpacity
                className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50"
                onPress={() => setShowSatuanKerjaPicker(true)}
              >
                <Text className={formData.id_satuankerja ? "text-gray-800" : "text-gray-400"}>
                  {formData.id_satuankerja
                    ? satuanKerjaList.find((item) => item.id === formData.id_satuankerja)?.nama_satuan_kerja
                    : "Pilih satuan kerja"}
                </Text>
                <ChevronDown size={20} color="#666" className="ml-auto" />
              </TouchableOpacity>

              {showSatuanKerjaPicker && (
                <View className="border border-gray-300 rounded-lg mt-2 bg-white">
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
            </View>

            <View>
              <Text className="text-gray-700 mb-2 font-medium">Jenis Pekerjaan</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                value={formData.jenis_pekerjaan}
                onChangeText={(text) => handleChange("jenis_pekerjaan", text)}
                placeholder="Masukkan jenis pekerjaan"
              />
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Informasi Fisik</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Tinggi Badan (cm)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                value={formData.tinggi_badan ? formData.tinggi_badan.toString() : ""}
                onChangeText={(text) => handleChange("tinggi_badan", Number.parseInt(text) || 0)}
                placeholder="Masukkan tinggi badan"
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 font-medium">Intensitas Aktivitas (1-100)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                value={formData.intensitas ? formData.intensitas.toString() : ""}
                onChangeText={(text) => handleChange("intensitas", Number.parseInt(text) || 0)}
                placeholder="Masukkan intensitas aktivitas"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-yellow-500 py-4 px-6 rounded-lg flex-row items-center justify-center shadow-md mb-6"
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Save size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg">SIMPAN</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PersonalDataScreen

