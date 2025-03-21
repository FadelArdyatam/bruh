"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { changePassword } from "../../redux/slices/authSlice"
import { ArrowLeft, Eye, EyeOff, Save } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"

const ChangePasswordScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Semua kolom harus diisi")
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Password baru dan konfirmasi password tidak cocok")
      return
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password baru minimal 6 karakter")
      return
    }

    try {
      await dispatch(
        changePassword({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      ).unwrap()

      Alert.alert("Sukses", "Password berhasil diubah", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (err) {
      console.error("Password change failed:", err)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-yellow-500 p-4 flex-row items-center">
        <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white ml-2">UBAH PASSWORD</Text>
      </View>

      <View className="flex-1 p-4">
        <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-6">Ubah Password Anda</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Password Saat Ini</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-gray-50">
                <TextInput
                  className="flex-1 p-3"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Masukkan password saat ini"
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-gray-700 mb-2 font-medium">Password Baru</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-gray-50">
                <TextInput
                  className="flex-1 p-3"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Masukkan password baru"
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-gray-700 mb-2 font-medium">Konfirmasi Password Baru</Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-3 bg-gray-50">
                <TextInput
                  className="flex-1 p-3"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Konfirmasi password baru"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {error && (
            <View className="bg-red-100 p-4 rounded-lg mt-4">
              <Text className="text-red-500 text-center">{error}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          className="bg-yellow-500 py-4 px-6 rounded-lg flex-row items-center justify-center shadow-md"
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Save size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg">SIMPAN PASSWORD</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ChangePasswordScreen

