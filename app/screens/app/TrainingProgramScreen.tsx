"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getAllWorkouts, getWorkoutDetail, saveTrainingSession } from "../../redux/slices/trainingSlice"
import { Save, Clock, Play } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import YoutubePlayer from "react-native-youtube-iframe"

const TrainingProgramScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { workoutList, selectedWorkout, isLoading } = useSelector((state: RootState) => state.training)

  const [duration, setDuration] = useState("")
  const [heartRate, setHeartRate] = useState("")
  const [distance, setDistance] = useState("")
  const [playing, setPlaying] = useState(false)

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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-yellow-500 p-4">
        <Text className="text-xl font-bold text-white">PROGRAM LATIHAN</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Pilih Jenis Latihan</Text>

          <View className="mb-6">
            <Text className="font-medium text-gray-700 mb-2">Aktivitas Tinggi</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {workoutList
                .filter((workout) => workout.kalori_ratarata_perdetik > 0.1)
                .map((workout) => (
                  <TouchableOpacity
                    key={workout.id}
                    className={`mr-3 p-3 rounded-lg ${
                      selectedWorkout?.id === workout.id ? "bg-yellow-500" : "bg-gray-100"
                    }`}
                    onPress={() => handleSelectWorkout(workout.id)}
                  >
                    <Text className={selectedWorkout?.id === workout.id ? "text-white font-medium" : "text-gray-800"}>
                      {workout.nama_latihan}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>

            <Text className="font-medium text-gray-700 mb-2">Aktivitas Rendah</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {workoutList
                .filter((workout) => workout.kalori_ratarata_perdetik <= 0.1)
                .map((workout) => (
                  <TouchableOpacity
                    key={workout.id}
                    className={`mr-3 p-3 rounded-lg ${
                      selectedWorkout?.id === workout.id ? "bg-yellow-500" : "bg-gray-100"
                    }`}
                    onPress={() => handleSelectWorkout(workout.id)}
                  >
                    <Text className={selectedWorkout?.id === workout.id ? "text-white font-medium" : "text-gray-800"}>
                      {workout.nama_latihan}
                    </Text>
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
            <View className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-xl font-bold text-gray-800 mb-2">{selectedWorkout.nama_latihan}</Text>

              <View className="flex-row flex-wrap mb-4">
                <View className="flex-row items-center mr-4 mb-2">
                  <Clock size={16} color="#FFB800" className="mr-1" />
                  <Text className="text-gray-600">
                    {Math.round(selectedWorkout.ratarata_waktu_perdetik / 60)} menit
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Play size={16} color="#FFB800" className="mr-1" />
                  <Text className="text-gray-600">
                    {Number.parseFloat(selectedWorkout.kalori_ratarata_perdetik) * 60} kal/menit
                  </Text>
                </View>
              </View>

              <Text className="text-gray-700 mb-4">{selectedWorkout.deskripsi_ketentuan_latihan}</Text>

              {selectedWorkout.video_ketentuan_latihan && (
                <View className="mb-4">
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
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                    value={duration}
                    onChangeText={setDuration}
                    placeholder="Masukkan durasi latihan"
                    keyboardType="numeric"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 mb-2 font-medium">Denyut Jantung Maksimal (per menit)</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                    value={heartRate}
                    onChangeText={setHeartRate}
                    placeholder="Masukkan denyut jantung"
                    keyboardType="numeric"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 mb-2 font-medium">Jarak Tempuh (km)</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                    value={distance}
                    onChangeText={setDistance}
                    placeholder="Masukkan jarak tempuh"
                    keyboardType="numeric"
                  />
                </View>

                {duration && selectedWorkout.kalori_ratarata_perdetik && (
                  <View className="bg-yellow-50 p-4 rounded-lg">
                    <Text className="font-medium text-gray-700">Estimasi Kalori Terbakar:</Text>
                    <Text className="text-2xl font-bold text-yellow-500">
                      {(
                        Number.parseFloat(selectedWorkout.kalori_ratarata_perdetik) *
                        Number.parseInt(duration) *
                        60
                      ).toFixed(0)}{" "}
                      kal
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          className="bg-yellow-500 py-4 px-6 rounded-lg flex-row items-center justify-center shadow-md mb-6"
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

