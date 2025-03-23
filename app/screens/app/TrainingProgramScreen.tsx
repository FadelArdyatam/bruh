"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getAllWorkouts, getWorkoutDetail, saveTrainingSession } from "../../redux/slices/trainingSlice"
import { Save, Clock, Play, Calendar, Zap, Heart, BarChart, ArrowRight } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import YoutubePlayer from "react-native-youtube-iframe"
import { LinearGradient } from "expo-linear-gradient"

const TrainingProgramScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { workoutList, selectedWorkout, isLoading } = useSelector((state: RootState) => state.training)

  const [duration, setDuration] = useState("")
  const [heartRate, setHeartRate] = useState("")
  const [distance, setDistance] = useState("")
  const [playing, setPlaying] = useState(false)
  const [selectedTab, setSelectedTab] = useState("high")

  useEffect(() => {
    dispatch(getAllWorkouts())
  }, [])

  const handleSelectWorkout = (id: number) => {
    dispatch(getWorkoutDetail(id))
  }

  const handleSaveTraining = async () => {
    if (!selectedWorkout) {
      Alert.alert("Error", "Pilih jenis latihan terlebih dahulu")
      return
    }

    if (!duration) {
      Alert.alert("Error", "Masukkan durasi latihan")
      return
    }

    if (!heartRate) {
      Alert.alert("Error", "Masukkan denyut jantung maksimal")
      return
    }

    try {
      const durationInSeconds = Number.parseInt(duration) * 60 // Convert minutes to seconds
      const caloriesBurned = durationInSeconds * Number.parseFloat(selectedWorkout.kalori_ratarata_perdetik)

      await dispatch(
        saveTrainingSession({
          workout_id: selectedWorkout.id,
          workout_name: selectedWorkout.nama_latihan,
          duration: Number.parseInt(duration),
          heart_rate: Number.parseInt(heartRate),
          distance: distance ? Number.parseFloat(distance) : 0,
          calories_burned: caloriesBurned,
        }),
      ).unwrap()

      Alert.alert("Sukses", `Latihan ${selectedWorkout.nama_latihan} berhasil disimpan`)
      setDuration("")
      setHeartRate("")
      setDistance("")
    } catch (err) {
      console.error("Failed to save training session:", err)
    }
  }

  const getYoutubeVideoId = (url: string) => {
    if (!url) return null

    // Extract video ID from YouTube URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)

    return match && match[2].length === 11 ? match[2] : null
  }

  const getTopWorkouts = () => {
    return workoutList
      .filter((workout) => 
        selectedTab === "high" 
          ? workout.kalori_ratarata_perdetik > 0.1 
          : workout.kalori_ratarata_perdetik <= 0.1
      )
      .slice(0, 5); // Just show top 5 workouts
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LinearGradient colors={["#FFB800", "#FF8A00"]} className="p-4 pt-8 pb-12 rounded-b-3xl">
        <Text className="text-xl font-bold text-white">PROGRAM LATIHAN</Text>
        
        <View className="mt-4 bg-white/20 p-1 rounded-full flex-row">
          <TouchableOpacity 
            className={`flex-1 rounded-full p-3 ${selectedTab === 'high' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedTab('high')}
          >
            <Text className={`text-center font-medium ${selectedTab === 'high' ? 'text-amber-500' : 'text-white'}`}>
              Aktivitas Tinggi
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 rounded-full p-3 ${selectedTab === 'low' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedTab('low')}
          >
            <Text className={`text-center font-medium ${selectedTab === 'low' ? 'text-amber-500' : 'text-white'}`}>
              Aktivitas Rendah
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 -mt-6">
        {/* Top Workouts Cards */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
            {getTopWorkouts().map((workout) => (
              <TouchableOpacity
                key={workout.id}
                className={`mr-4 p-4 rounded-2xl w-40 shadow-sm
                  ${selectedWorkout?.id === workout.id ? "bg-amber-500" : "bg-white"}`}
                onPress={() => handleSelectWorkout(workout.id)}
              >
                <View className="items-center mb-2">
                  {workout.kalori_ratarata_perdetik > 0.2 ? (
                    <Zap size={32} color={selectedWorkout?.id === workout.id ? "#FFF" : "#FFB800"} />
                  ) : (
                    <Heart size={32} color={selectedWorkout?.id === workout.id ? "#FFF" : "#FFB800"} />
                  )}
                </View>
                
                <Text className={`text-center font-bold ${selectedWorkout?.id === workout.id ? "text-white" : "text-gray-800"}`}>
                  {workout.nama_latihan}
                </Text>
                
                <View className="flex-row items-center justify-center mt-2">
                  <Clock size={14} color={selectedWorkout?.id === workout.id ? "#FFF" : "#9CA3AF"} />
                  <Text className={`text-xs ml-1 ${selectedWorkout?.id === workout.id ? "text-white" : "text-gray-500"}`}>
                    {Math.round(workout.ratarata_waktu_perdetik / 60)} menit
                  </Text>
                </View>
                
                <View className="flex-row items-center justify-center mt-1">
                  <BarChart size={14} color={selectedWorkout?.id === workout.id ? "#FFF" : "#9CA3AF"} />
                  <Text className={`text-xs ml-1 ${selectedWorkout?.id === workout.id ? "text-white" : "text-gray-500"}`}>
                    {Math.round(Number.parseFloat(workout.kalori_ratarata_perdetik) * 60)} kal/menit
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {isLoading && (
          <View className="items-center py-4">
            <ActivityIndicator size="large" color="#FFB800" />
          </View>
        )}

        {selectedWorkout && (
          <View className="bg-white rounded-3xl p-6 shadow-sm mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-2">{selectedWorkout.nama_latihan}</Text>

            <View className="flex-row flex-wrap mb-4">
              <View className="flex-row items-center mr-4 mb-2">
                <Clock size={16} color="#FFB800" className="mr-1" />
                <Text className="text-gray-600">
                  {Math.round(selectedWorkout.ratarata_waktu_perdetik / 60)} menit
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                <Zap size={16} color="#FFB800" className="mr-1" />
                <Text className="text-gray-600">
                  {Math.round(Number.parseFloat(selectedWorkout.kalori_ratarata_perdetik) * 60)} kal/menit
                </Text>
              </View>
            </View>

            <Text className="text-gray-700 mb-4">{selectedWorkout.deskripsi_ketentuan_latihan}</Text>

            {selectedWorkout.video_ketentuan_latihan && (
              <View className="mb-6 overflow-hidden rounded-2xl">
                <Text className="font-medium text-gray-700 mb-2">Video Tutorial</Text>
                <YoutubePlayer
                  height={200}
                  play={playing}
                  videoId={getYoutubeVideoId(selectedWorkout.video_ketentuan_latihan)}
                  onChangeState={(state) => {
                    if (state === "playing") setPlaying(true)
                    else if (state === "paused") setPlaying(false)
                  }}
                />
              </View>
            )}

            <View className="space-y-4 mt-4">
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Durasi Latihan (menit)</Text>
                <TextInput
                  className="border-none bg-yellow-50 rounded-full p-4 text-center text-lg"
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="Masukkan durasi latihan"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View>
                <Text className="text-gray-700 mb-2 font-medium">Denyut Jantung Maksimal (per menit)</Text>
                <TextInput
                  className="border-none bg-yellow-50 rounded-full p-4 text-center text-lg"
                  value={heartRate}
                  onChangeText={setHeartRate}
                  placeholder="Masukkan denyut jantung"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View>
                <Text className="text-gray-700 mb-2 font-medium">Jarak Tempuh (km)</Text>
                <TextInput
                  className="border-none bg-yellow-50 rounded-full p-4 text-center text-lg"
                  value={distance}
                  onChangeText={setDistance}
                  placeholder="Masukkan jarak tempuh"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {duration && selectedWorkout.kalori_ratarata_perdetik && (
                <View className="bg-yellow-50 p-4 rounded-2xl">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-medium text-gray-700">Estimasi Kalori Terbakar:</Text>
                    <Text className="text-2xl font-bold text-amber-500">
                      {(
                        Number.parseFloat(selectedWorkout.kalori_ratarata_perdetik) *
                        Number.parseInt(duration) *
                        60
                      ).toFixed(0)}{" "}
                      kal
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {!selectedWorkout && (
          <View className="bg-white rounded-3xl p-6 shadow-sm mb-6 items-center">
            <Calendar size={64} color="#FFB800" className="mb-4" />
            <Text className="text-xl font-bold text-gray-800 mb-2 text-center">Pilih jenis latihan</Text>
            <Text className="text-gray-500 text-center mb-4">
              Silakan pilih jenis latihan yang ingin Anda lakukan dari daftar di atas
            </Text>
          </View>
        )}

        <TouchableOpacity
          className="bg-yellow-500 py-4 px-6 rounded-full flex-row items-center justify-center shadow-md mb-6"
          onPress={handleSaveTraining}
          disabled={isLoading || !selectedWorkout}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Save size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg">SIMPAN LATIHAN</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TrainingProgramScreen