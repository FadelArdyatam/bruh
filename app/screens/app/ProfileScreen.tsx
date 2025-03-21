"use client"

import { useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getUserProfile } from "../../redux/slices/profileSlice"
import { logoutUser } from "../../redux/slices/authSlice"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import {
  User,
  Edit,
  Lock,
  LogOut,
  ChevronRight,
  Shield,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Award,
} from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { personalData, isLoading } = useSelector((state: RootState) => state.profile)

  useEffect(() => {
    dispatch(getUserProfile())
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null

    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FFB800" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        <LinearGradient colors={["#FFB800", "#FF8A00"]} className="pt-6 pb-16 rounded-b-3xl">
          <View className="items-center">
            <View className="relative">
              <Image
                source={{ uri: "https://placeholder.com/120" }}
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <TouchableOpacity
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md"
                onPress={() => navigation.navigate("PersonalData")}
              >
                <Edit size={16} color="#FFB800" />
              </TouchableOpacity>
            </View>

            <Text className="text-white text-xl font-bold mt-3">
              {personalData?.nama_lengkap || user?.name || "Pengguna"}
            </Text>
            <Text className="text-white opacity-80">{personalData?.pangkat?.nama_pangkat || "Belum ada pangkat"}</Text>
          </View>
        </LinearGradient>

        <View className="px-6 -mt-10">
          <View className="bg-white rounded-xl shadow-md p-5 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">Informasi Pribadi</Text>

            <View className="space-y-4">
              <View className="flex-row items-center">
                <View className="bg-yellow-100 p-2 rounded-lg mr-4">
                  <Shield size={20} color="#FFB800" />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm">NRP/NIP</Text>
                  <Text className="text-gray-800 font-medium">{personalData?.username || user?.username || "-"}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="bg-yellow-100 p-2 rounded-lg mr-4">
                  <Calendar size={20} color="#FFB800" />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm">Tanggal Lahir & Umur</Text>
                  <Text className="text-gray-800 font-medium">
                    {personalData?.tanggal_lahir
                      ? `${personalData.tanggal_lahir} (${calculateAge(personalData.tanggal_lahir)} tahun)`
                      : "-"}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="bg-yellow-100 p-2 rounded-lg mr-4">
                  <MapPin size={20} color="#FFB800" />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm">Tempat Lahir</Text>
                  <Text className="text-gray-800 font-medium">{personalData?.tempat_lahir || "-"}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="bg-yellow-100 p-2 rounded-lg mr-4">
                  <Phone size={20} color="#FFB800" />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm">Nomor Handphone</Text>
                  <Text className="text-gray-800 font-medium">{personalData?.no_hp || "-"}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="bg-yellow-100 p-2 rounded-lg mr-4">
                  <Mail size={20} color="#FFB800" />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm">Email</Text>
                  <Text className="text-gray-800 font-medium">{personalData?.email || user?.email || "-"}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="bg-yellow-100 p-2 rounded-lg mr-4">
                  <Briefcase size={20} color="#FFB800" />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm">Satuan Kerja</Text>
                  <Text className="text-gray-800 font-medium">
                    {personalData?.satuan_kerja?.nama_satuan_kerja || "-"}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="bg-yellow-100 p-2 rounded-lg mr-4">
                  <Award size={20} color="#FFB800" />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm">Jenis Pekerjaan</Text>
                  <Text className="text-gray-800 font-medium">{personalData?.jenis_pekerjaan || "-"}</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <TouchableOpacity
              className="p-4 border-b border-gray-100 flex-row items-center justify-between"
              onPress={() => navigation.navigate("PersonalData")}
            >
              <View className="flex-row items-center">
                <View className="bg-blue-100 p-2 rounded-lg mr-4">
                  <User size={20} color="#3B82F6" />
                </View>
                <Text className="text-gray-800 font-medium">Edit Profil</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="p-4 border-b border-gray-100 flex-row items-center justify-between"
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <View className="flex-row items-center">
                <View className="bg-purple-100 p-2 rounded-lg mr-4">
                  <Lock size={20} color="#8B5CF6" />
                </View>
                <Text className="text-gray-800 font-medium">Ubah Password</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="p-4 flex-row items-center justify-between" onPress={handleLogout}>
              <View className="flex-row items-center">
                <View className="bg-red-100 p-2 rounded-lg mr-4">
                  <LogOut size={20} color="#EF4444" />
                </View>
                <Text className="text-red-500 font-medium">Logout</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen

