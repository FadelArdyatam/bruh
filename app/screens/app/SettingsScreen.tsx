"use client"

import React from "react"
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../redux/store"
import { logoutUser } from "../../redux/slices/authSlice"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Lock, LogOut, Bell, Moon, Info, Shield, ChevronRight, BarChart2 } from "lucide-react-native"

const SettingsScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()

  const [darkMode, setDarkMode] = React.useState(false)
  const [notifications, setNotifications] = React.useState(true)

  const handleLogout = () => {
    Alert.alert("Konfirmasi Logout", "Apakah Anda yakin ingin keluar dari aplikasi?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => dispatch(logoutUser()),
        style: "destructive",
      },
    ])
  }

  const handleAbout = () => {
    Alert.alert(
      "Tentang SI POLGAR",
      "Sistem Informasi Polisi Bugar (SI POLGAR) adalah aplikasi untuk memantau kebugaran dan kesehatan personel kepolisian.\n\nVersi: 1.0.0",
      [{ text: "OK" }],
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-yellow-500 p-4">
        <Text className="text-xl font-bold text-white">PENGATURAN</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="bg-purple-100 p-2 rounded-lg mr-4">
                <Bell size={20} color="#8B5CF6" />
              </View>
              <Text className="text-gray-800 font-medium">Notifikasi</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#D1D5DB", true: "#FFB800" }}
              thumbColor={notifications ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>

          {/* Tambahkan opsi pengaturan notifikasi lebih detail */}
          <TouchableOpacity
            className="p-4 border-b border-gray-100 flex-row items-center justify-between"
            onPress={() => navigation.navigate("NotificationSettings")}
          >
            <View className="flex-row items-center">
              <View className="bg-purple-100 p-2 rounded-lg mr-4">
                <Bell size={20} color="#8B5CF6" />
              </View>
              <Text className="text-gray-800 font-medium">Pengaturan Notifikasi</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="bg-indigo-100 p-2 rounded-lg mr-4">
                <Moon size={20} color="#6366F1" />
              </View>
              <Text className="text-gray-800 font-medium">Mode Gelap</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#D1D5DB", true: "#FFB800" }}
              thumbColor={darkMode ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>
        </View>

        <View className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Tambahkan opsi laporan statistik */}
          <TouchableOpacity
            className="p-4 border-b border-gray-100 flex-row items-center justify-between"
            onPress={() => navigation.navigate("AnalyticsReport")}
          >
            <View className="flex-row items-center">
              <View className="bg-green-100 p-2 rounded-lg mr-4">
                <BarChart2 size={20} color="#10B981" />
              </View>
              <Text className="text-gray-800 font-medium">Laporan & Statistik</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="p-4 border-b border-gray-100 flex-row items-center justify-between"
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View className="flex-row items-center">
              <View className="bg-blue-100 p-2 rounded-lg mr-4">
                <Lock size={20} color="#3B82F6" />
              </View>
              <Text className="text-gray-800 font-medium">Ubah Password</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            className="p-4 border-b border-gray-100 flex-row items-center justify-between"
            onPress={handleAbout}
          >
            <View className="flex-row items-center">
              <View className="bg-green-100 p-2 rounded-lg mr-4">
                <Info size={20} color="#10B981" />
              </View>
              <Text className="text-gray-800 font-medium">Tentang Aplikasi</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="p-4 border-b border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-yellow-100 p-2 rounded-lg mr-4">
                <Shield size={20} color="#FFB800" />
              </View>
              <Text className="text-gray-800 font-medium">Kebijakan Privasi</Text>
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

        <View className="items-center mb-6">
          <Text className="text-gray-400 text-sm">SI POLGAR v1.0.0</Text>
          <Text className="text-gray-400 text-sm">© 2025 Kepolisian Republik Indonesia</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SettingsScreen