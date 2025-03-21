"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getWeightData, saveWeightData } from "../../redux/slices/imtSlice"
import { getUserProfile } from "../../redux/slices/profileSlice"
import { Plus, Save, ArrowRight, Calendar } from "lucide-react-native"
import { LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import DateTimePicker from "@react-native-community/datetimepicker"

const screenWidth = Dimensions.get("window").width

const IMTScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { weightHistory, isLoading } = useSelector((state: RootState) => state.imt)
  const { personalData } = useSelector((state: RootState) => state.profile)

  const [beratBadan, setBeratBadan] = useState("")
  const [showIMTDetails, setShowIMTDetails] = useState(false)
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [mingguKe, setMingguKe] = useState("1")

  useEffect(() => {
    dispatch(getWeightData())
    dispatch(getUserProfile())
  }, [])

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date
    setShowDatePicker(false)
    setDate(currentDate)

    const formattedDate = currentDate.toISOString().split("T")[0] // YYYY-MM-DD
    setSelectedDate(formattedDate)
  }

  const calculateIMT = (weight: number, height: number) => {
    if (!weight || !height) return null

    const heightInMeters = height / 100
    const imt = weight / (heightInMeters * heightInMeters)

    let status = ""
    if (imt < 18.5) status = "Kurus"
    else if (imt >= 18.5 && imt < 25) status = "Normal"
    else if (imt >= 25 && imt < 30) status = "Kelebihan Berat Badan"
    else status = "Obesitas"

    return { imt: imt.toFixed(1), status }
  }

  const getCurrentIMT = () => {
    if (weightHistory.length > 0 && personalData?.tinggi_badan) {
      const latestWeight = weightHistory[weightHistory.length - 1].berat_badan
      return calculateIMT(latestWeight, personalData.tinggi_badan)
    }
    return null
  }

  const handleSaveWeight = async () => {
    if (!beratBadan) {
      Alert.alert("Error", "Berat badan harus diisi")
      return
    }

    if (!selectedDate) {
      Alert.alert("Error", "Tanggal harus dipilih")
      return
    }

    if (!mingguKe) {
      Alert.alert("Error", "Minggu ke harus diisi")
      return
    }

    const weight = Number.parseFloat(beratBadan)
    const week = Number.parseInt(mingguKe)

    if (isNaN(weight) || weight <= 0) {
      Alert.alert("Error", "Berat badan tidak valid")
      return
    }

    try {
      await dispatch(
        saveWeightData({
          berat_badan: weight,
          minggu_ke: week,
          tgl_berat_badan: selectedDate,
        }),
      ).unwrap()

      Alert.alert("Sukses", "Data berat badan berhasil disimpan")
      setBeratBadan("")
      setSelectedDate("")
      setMingguKe("1")
    } catch (err) {
      console.error("Failed to save weight data:", err)
    }
  }

  const prepareChartData = () => {
    if (weightHistory.length === 0) return null

    const sortedData = [...weightHistory].sort(
      (a, b) => new Date(a.tgl_berat_badan).getTime() - new Date(b.tgl_berat_badan).getTime(),
    )

    const labels = sortedData.map((item) => {
      const date = new Date(item.tgl_berat_badan)
      return `${date.getDate()}/${date.getMonth() + 1}`
    })

    const data = sortedData.map((item) => item.berat_badan)

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(255, 184, 0, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    }
  }

  const chartData = prepareChartData()
  const currentIMT = getCurrentIMT()

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-yellow-500 p-4">
        <Text className="text-xl font-bold text-white">INDEKS MASSA TUBUH (IMT)</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Status IMT Saat Ini</Text>

          <View className="bg-yellow-50 p-4 rounded-lg mb-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-500">Indeks Massa Tubuh</Text>
                <Text className="text-3xl font-bold text-yellow-500">{currentIMT ? currentIMT.imt : "-"}</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-500">Status</Text>
                <Text className="text-lg font-semibold text-gray-800">{currentIMT ? currentIMT.status : "-"}</Text>
              </View>
            </View>
          </View>

          {chartData && (
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Grafik Berat Badan</Text>
              <LineChart
                data={chartData}
                width={screenWidth - 48}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#FFB800",
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          )}

          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => setShowIMTDetails(!showIMTDetails)}
          >
            <Text className="text-blue-500 font-medium">
              {showIMTDetails ? "Sembunyikan Detail" : "Lihat Detail IMT"}
            </Text>
            <Plus size={20} color="#3B82F6" />
          </TouchableOpacity>

          {showIMTDetails && (
            <View className="mt-4 bg-gray-50 p-4 rounded-lg">
              <Text className="font-bold mb-2">Kategori IMT:</Text>
              <View className="space-y-2">
                <Text>• Kurus: IMT {"<"} 18.5</Text>
                <Text>• Normal: IMT 18.5 - 24.9</Text>
                <Text>• Kelebihan Berat Badan: IMT 25 - 29.9</Text>
                <Text>• Obesitas: IMT ≥ 30</Text>
              </View>

              {weightHistory.length > 0 && (
                <View className="mt-4">
                  <Text className="font-bold mb-2">Riwayat Berat Badan:</Text>
                  {weightHistory.map((item, index) => (
                    <View key={index} className="flex-row justify-between py-2 border-b border-gray-200">
                      <Text>{new Date(item.tgl_berat_badan).toLocaleDateString()}</Text>
                      <Text className="font-medium">{item.berat_badan} kg</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Input Berat Badan</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Berat Badan (kg)</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                value={beratBadan}
                onChangeText={setBeratBadan}
                placeholder="Masukkan berat badan"
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 font-medium">Tanggal</Text>
              <TouchableOpacity
                className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50"
                onPress={() => setShowDatePicker(true)}
              >
                <Text className={selectedDate ? "text-gray-800" : "text-gray-400"}>
                  {selectedDate ? selectedDate : "Pilih tanggal"}
                </Text>
                <Calendar size={20} color="#666" className="ml-auto" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
              )}
            </View>

            <View>
              <Text className="text-gray-700 mb-2 font-medium">Minggu Ke</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                value={mingguKe}
                onChangeText={setMingguKe}
                placeholder="Masukkan minggu ke"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            className="bg-yellow-500 py-3 rounded-lg flex-row items-center justify-center mt-6"
            onPress={handleSaveWeight}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Save size={20} color="white" className="mr-2" />
                <Text className="text-white font-bold">SIMPAN</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Recall Makan</Text>
          <Text className="text-gray-600 mb-4">
            Silahkan isi recall makan selama seminggu sebelum kegiatan latihan (hari Rabu dan Minggu).
          </Text>

          <TouchableOpacity
            className="bg-blue-500 py-3 rounded-lg flex-row items-center justify-center"
            onPress={() => navigation.navigate("FoodRecall")}
          >
            <Text className="text-white font-bold mr-2">ISI RECALL MAKAN</Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default IMTScreen

