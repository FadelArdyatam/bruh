"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getWeightData, saveWeightData } from "../../redux/slices/imtSlice"
import { getUserProfile } from "../../redux/slices/profileSlice"
import { Plus, Save, ArrowRight, Calendar, Info, Activity } from "lucide-react-native"
import { LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import DateTimePicker from "@react-native-community/datetimepicker"
import Svg, { Circle, Text as SvgText, Path, G } from 'react-native-svg'
import { LinearGradient } from "expo-linear-gradient"
import { IMTScreenSkeleton } from "~/app/components/SkeletonLoaders"

const screenWidth = Dimensions.get("window").width;

const IMTScreen = () => {
  // Function to generate semi-circle gauge path
  const createSemiCircle = (percentage: number) => {
    const center = 50;
    const radius = 45;
    const startAngle = 180; // bottom of semi-circle
    const endAngle = 0; // top of semi-circle
    const angleRange = startAngle - endAngle;
    const finalAngle = startAngle - (percentage * angleRange);
    
    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const finalRad = (finalAngle * Math.PI) / 180;
    
    // Calculate points
    const startX = center + radius * Math.cos(startRad);
    const startY = center + radius * Math.sin(startRad);
    const finalX = center + radius * Math.cos(finalRad);
    const finalY = center + radius * Math.sin(finalRad);
    
    // Create path
    const largeArcFlag = percentage > 0.5 ? 1 : 0;
    const path = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${finalX} ${finalY}`;
    
    return path;
  };

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

  if(isLoading){
    <IMTScreenSkeleton/>
  }

  // Helper function untuk mengakses data personel
  const getPersonelData = () => {
    if (!personalData) return null
    
    // Cek apakah personel ada dalam data respons
    return personalData.personel || personalData
  }

  const calculateIMT = (weight: number, height: number) => {
    if (!weight || !height) return null

    const heightInMeters = height / 100
    const imt = weight / (heightInMeters * heightInMeters)

    let status = ""
    let color = ""
    if (imt < 18.5) {
      status = "Kurus"
      color = "#3B82F6" // blue
    } else if (imt >= 18.5 && imt < 25) {
      status = "Normal"
      color = "#10B981" // green
    } else if (imt >= 25 && imt < 30) {
      status = "Kelebihan Berat Badan"
      color = "#F59E0B" // amber
    } else {
      status = "Obesitas"
      color = "#EF4444" // red
    }

    return { imt: imt.toFixed(1), status, color }
  }

  const getCurrentIMT = () => {
    const personelData = getPersonelData()
    const tinggiBadan = personelData?.tinggi_badan
    
    if (weightHistory.length > 0 && tinggiBadan) {
      const latestWeight = weightHistory[weightHistory.length - 1].berat_badan
      return calculateIMT(latestWeight, tinggiBadan)
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
      
      // Refresh data berat setelah menyimpan
      dispatch(getWeightData())
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
          strokeWidth: 3,
        },
      ],
    }
  }
  
  // Menambahkan fungsi untuk menghitung lebar grafik berdasarkan jumlah data
  const calculateChartWidth = (dataPoints: number) => {
    // Minimal lebar per titik data (dapat disesuaikan)
    const minWidthPerPoint = 50;
    
    // Hitung lebar berdasarkan jumlah titik data, minimal sama dengan lebar layar
    return Math.max(screenWidth - 60, dataPoints * minWidthPerPoint);
  }

  const currentIMT = getCurrentIMT()
  const chartData = prepareChartData()
  
  // Calculate IMT percentage for the gauge (approx between 15-40)
  const imtPercentage = currentIMT ? 
    Math.min(Math.max((parseFloat(currentIMT.imt) - 15) / 25, 0), 1) : 0.5;
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50 rounded-lg">
      <View style={{ overflow: 'hidden', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
      <LinearGradient colors={["#FFB800", "#FF8A00"]} className="p-4 pt-8 pb-12 rounded-full">
        <Text className="text-xl font-bold text-white">INDEKS MASSA TUBUH (IMT)</Text>
        
        {/* Status IMT Ringkasan */}
        <View className="bg-white/20 p-4 rounded-2xl mt-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-sm opacity-80">Status IMT Anda</Text>
              <Text className="text-white text-2xl font-bold">{currentIMT ? currentIMT.imt : "--"}</Text>
            </View>
            <View className="bg-white px-4 py-2 rounded-full">
              <Text 
                className="font-bold"
                style={{ color: currentIMT ? currentIMT.color : "#FFB800" }}
              >
                {currentIMT ? currentIMT.status : "Belum ada data"}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      </View>
      
      <ScrollView className="flex-1 px-6 -mt-6">
        {/* Kartu IMT Gauge dan Grafik */}
        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          {/* IMT Gauge Display */}
        {/* Kartu IMT Gauge */}
        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Kategori IMT</Text>
          
          {/* IMT Gauge Display */}
          <View className="items-center mb-2 border border-gray-100 bg-gray-50 py-6 px-4 rounded-2xl">
            {/* IMT Value besar di tengah */}
            <View style={{ 
              width: 150, 
              height: 150, 
              borderRadius: 60, 
              backgroundColor: currentIMT ? `${currentIMT.color}20` : '#FFB80020',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 4,
              borderColor: currentIMT ? currentIMT.color : '#FFB800'
            }}>
              <Text className="text-4xl font-bold" style={{ color: currentIMT ? currentIMT.color : '#FFB800' }}>
                {currentIMT ? currentIMT.imt : "--"}
              </Text>
              <Text className="text-base font-medium" style={{ color: currentIMT ? currentIMT.color : '#FFB800' }}>
                {currentIMT ? currentIMT.status : "Belum ada data"}
              </Text>
            </View>
          
            {/* Kategori IMT */}
            <View className="flex-row justify-between mt-6 bg-white p-2 rounded-xl shadow-sm w-full">
              <View className="border-l-4 border-blue-500 pl-2 flex-1 mr-1">
                <Text className="text-xs text-gray-500">Kurus</Text>
                <Text className="text-xs font-bold text-blue-500">&lt; 18.5</Text>
              </View>
              <View className="border-l-4 border-green-500 pl-2 flex-1 mr-1">
                <Text className="text-xs text-gray-500">Normal</Text>
                <Text className="text-xs font-bold text-green-500">18.5 - 24.9</Text>
              </View>
              <View className="border-l-4 border-amber-500 pl-2 flex-1 mr-1">
                <Text className="text-xs text-gray-500">Berlebih</Text>
                <Text className="text-xs font-bold text-amber-500">25.0 - 29.9</Text>
              </View>
              <View className="border-l-4 border-red-500 pl-2 flex-1">
                <Text className="text-xs text-gray-500">Obesitas</Text>
                <Text className="text-xs font-bold text-red-500">≥ 30.0</Text>
              </View>
            </View>
          
            <TouchableOpacity
              className="flex-row items-center justify-center mt-4 bg-amber-50 p-3 rounded-full border border-amber-200"
              onPress={() => setShowIMTDetails(!showIMTDetails)}
            >
              <Text className="text-amber-700 font-medium mr-2">
                {showIMTDetails ? "Sembunyikan Info" : "Apa itu IMT?"}
              </Text>
              <Info size={18} color="#B45309" />
            </TouchableOpacity>
            
            {showIMTDetails && (
              <View className="mt-4 bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <Text className="font-bold text-gray-800 mb-2">Tentang Indeks Massa Tubuh (IMT)</Text>
                <Text className="text-gray-700 mb-2">
                  IMT adalah cara mengukur massa tubuh berdasarkan berat dan tinggi badan untuk mengetahui apakah berat badan Anda ideal.
                </Text>
                <Text className="text-gray-700">
                  IMT dihitung dengan rumus: Berat Badan (kg) ÷ [Tinggi Badan (m)]²
                </Text>
              </View>
            )}
          </View>
        </View>

          {/* Weight History Graph */}
          {chartData && (
            <View className="mb-4">
              <Text className="text-gray-800 font-bold mb-2">Grafik Berat Badan</Text>
              
              {/* Container ScrollView horizontal untuk grafik yang bisa di-scroll */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                <LineChart
                  data={chartData}
                  width={calculateChartWidth(chartData.labels.length)}
                  height={220}
                  chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 184, 0, ${opacity})`,
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
              </ScrollView>
              
              {/* Petunjuk scroll horizontall */}
              {chartData.labels.length > 5 && (
                <Text className="text-center text-gray-500 mt-2 italic text-xs">
                  Geser ke kanan atau kiri untuk melihat semua data
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            className="flex-row items-center justify-between mt-2 bg-gray-50 p-3 rounded-full"
            onPress={() => setShowIMTDetails(!showIMTDetails)}
          >
            <Text className="text-gray-700 font-medium">
              {showIMTDetails ? "Sembunyikan Detail" : "Lihat Detail IMT"}
            </Text>
            <Info size={18} color="#6B7280" />
          </TouchableOpacity>

          {showIMTDetails && (
            <View className="mt-4 bg-gray-50 p-4 rounded-2xl">
              <Text className="font-bold text-gray-800 mb-2">Kategori IMT:</Text>
              <View className="space-y-2">
                <Text className="text-gray-700">• Kurus: IMT {"<"} 18.5</Text>
                <Text className="text-gray-700">• Normal: IMT 18.5 - 24.9</Text>
                <Text className="text-gray-700">• Kelebihan Berat Badan: IMT 25 - 29.9</Text>
                <Text className="text-gray-700">• Obesitas: IMT ≥ 30</Text>
              </View>

              {weightHistory.length > 0 && (
                <View className="mt-4">
                  <Text className="font-bold text-gray-800 mb-2">Riwayat Berat Badan:</Text>
                  {weightHistory.map((item, index) => (
                    <View key={index} className="flex-row justify-between py-2 border-b border-gray-200">
                      <Text className="text-gray-700">{new Date(item.tgl_berat_badan).toLocaleDateString()}</Text>
                      <Text className="font-medium text-gray-800">{item.berat_badan} kg</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Input Berat Badan Card */}
        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Input Berat Badan</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Berat Badan (kg)</Text>
              <TextInput
                className="border border-gray-200 rounded-full p-4 text-center text-lg bg-white"
                value={beratBadan}
                onChangeText={setBeratBadan}
                placeholder="Masukkan berat badan"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 font-medium">Tanggal</Text>
              <TouchableOpacity
                className="flex-row items-center justify-between border border-gray-200 rounded-full p-4 bg-white"
                onPress={() => setShowDatePicker(true)}
              >
                <Text className={selectedDate ? "text-gray-800" : "text-gray-400"}>
                  {selectedDate ? selectedDate : "Pilih tanggal"}
                </Text>
                <Calendar size={20} color="#FFB800" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
              )}
            </View>

            <View>
              <Text className="text-gray-700 mb-2 font-medium">Minggu Ke</Text>
              <TextInput
                className="border border-gray-200 rounded-full p-4 text-center text-lg bg-white"
                value={mingguKe}
                onChangeText={setMingguKe}
                placeholder="Masukkan minggu ke"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <TouchableOpacity
            className="bg-amber-500 py-4 rounded-full flex-row items-center justify-center mt-6 shadow-md"
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

        {/* Menu Cepat */}
        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Menu Cepat</Text>
          
          <TouchableOpacity
            className="flex-row items-center bg-amber-50 p-4 rounded-2xl mb-4"
            onPress={() => navigation.navigate("FoodRecall")}
          >
            <View className="w-12 h-12 bg-amber-500 rounded-full items-center justify-center mr-4">
              <Plus size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-bold">Recall Makan</Text>
              <Text className="text-gray-600">Catat asupan makanan hari Rabu dan Minggu</Text>
            </View>
            <ArrowRight size={20} color="#FFB800" />
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-row items-center bg-blue-50 p-4 rounded-2xl"
            onPress={() => navigation.navigate("ActivityStatus")}
          >
            <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
              <Activity size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-bold">Status Aktivitas</Text>
              <Text className="text-gray-600">Pantau detak jantung dan aktivitas Anda</Text>
            </View>
            <ArrowRight size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default IMTScreen