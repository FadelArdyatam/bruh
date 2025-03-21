"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getUserProfile } from "../../redux/slices/profileSlice"
import { getWeightData } from "../../redux/slices/imtSlice"
import { getAllWorkouts } from "../../redux/slices/trainingSlice"
import { BarChart2, TrendingUp, Activity, Award } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { LinearGradient } from "expo-linear-gradient"

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { personalData, isLoading: profileLoading } = useSelector((state: RootState) => state.profile)
  const { weightHistory } = useSelector((state: RootState) => state.imt)
  const { trainingHistory } = useSelector((state: RootState) => state.training)

  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    dispatch(getUserProfile())
    dispatch(getWeightData())
    dispatch(getAllWorkouts())

    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Selamat Pagi")
    else if (hour < 18) setGreeting("Selamat Siang")
    else setGreeting("Selamat Malam")
  }, [])

  // Calculate IMT if weight and height data available
  const calculateIMT = () => {
    if (weightHistory.length > 0 && personalData?.tinggi_badan) {
      const latestWeight = weightHistory[weightHistory.length - 1].berat_badan
      const height = personalData.tinggi_badan / 100 // convert to meters
      const imt = latestWeight / (height * height)

      let status = ""
      if (imt < 18.5) status = "Kurus"
      else if (imt >= 18.5 && imt < 25) status = "Normal"
      else if (imt >= 25 && imt < 30) status = "Kelebihan Berat Badan"
      else status = "Obesitas"

      return { imt: imt.toFixed(1), status }
    }
    return null
  }

  const imtData = calculateIMT()

  const renderStatCard = (title: string, value: string, icon: any, color: string, bgColor: string) => (
    <View className={`${bgColor} p-4 rounded-xl flex-1 shadow-sm`}>
      <View className="flex-row justify-between items-start">
        <Text className="text-gray-700 font-medium">{title}</Text>
        <View className={`${color} p-2 rounded-full`}>{icon}</View>
      </View>
      <Text className="text-2xl font-bold mt-2">{value}</Text>
    </View>
  )

  if (profileLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FFB800" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        <LinearGradient colors={["#FFB800", "#FF8A00"]} className="p-6 pt-8 pb-12 rounded-b-3xl">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white text-lg">{greeting},</Text>
              <Text className="text-white text-2xl font-bold">
                {user?.name || personalData?.nama_lengkap || "Pengguna"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image
                source={{ uri: "https://placeholder.com/80" }}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </TouchableOpacity>
          </View>

          <View className="bg-white p-4 rounded-xl shadow-md">
            <Text className="text-gray-700 font-medium mb-2">Status Kebugaran</Text>
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-3xl font-bold text-yellow-500">{imtData ? imtData.imt : "-"}</Text>
                <Text className="text-gray-500">IMT ({imtData ? imtData.status : "Belum ada data"})</Text>
              </View>
              <TouchableOpacity
                className="bg-yellow-500 py-2 px-4 rounded-lg"
                onPress={() => navigation.navigate("IMT")}
              >
                <Text className="text-white font-medium">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View className="px-6 mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Statistik</Text>

          <View className="flex-row space-x-4 mb-4">
            {renderStatCard(
              "IMT",
              imtData ? imtData.imt : "-",
              <BarChart2 size={20} color="#FFB800" />,
              "bg-yellow-100",
              "bg-white",
            )}

            {renderStatCard(
              "Berat",
              weightHistory.length > 0 ? `${weightHistory[weightHistory.length - 1].berat_badan} kg` : "-",
              <TrendingUp size={20} color="#10B981" />,
              "bg-green-100",
              "bg-white",
            )}
          </View>

          <View className="flex-row space-x-4">
            {renderStatCard(
              "Latihan",
              `${trainingHistory.length}`,
              <Activity size={20} color="#3B82F6" />,
              "bg-blue-100",
              "bg-white",
            )}

            {renderStatCard(
              "Tinggi",
              personalData?.tinggi_badan ? `${personalData.tinggi_badan} cm` : "-",
              <Award size={20} color="#8B5CF6" />,
              "bg-purple-100",
              "bg-white",
            )}
          </View>
        </View>

        <View className="px-6 mt-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Menu Cepat</Text>

          <View className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <TouchableOpacity
              className="p-4 border-b border-gray-100 flex-row items-center"
              onPress={() => navigation.navigate("IMT")}
            >
              <View className="bg-yellow-100 p-2 rounded-lg mr-4">
                <BarChart2 size={24} color="#FFB800" />
              </View>
              <View>
                <Text className="text-gray-800 font-medium">Indeks Massa Tubuh</Text>
                <Text className="text-gray-500 text-sm">Pantau IMT dan berat badan Anda</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-4 border-b border-gray-100 flex-row items-center"
              onPress={() => navigation.navigate("TrainingProgram")}
            >
              <View className="bg-blue-100 p-2 rounded-lg mr-4">
                <Activity size={24} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-gray-800 font-medium">Program Latihan</Text>
                <Text className="text-gray-500 text-sm">Pilih dan lakukan latihan kebugaran</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="p-4 flex-row items-center" onPress={() => navigation.navigate("FoodRecall")}>
              <View className="bg-green-100 p-2 rounded-lg mr-4">
                <Image source={{ uri: "https://placeholder.com/24" }} className="w-6 h-6" />
              </View>
              <View>
                <Text className="text-gray-800 font-medium">Recall Makan</Text>
                <Text className="text-gray-500 text-sm">Catat asupan makanan harian Anda</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

