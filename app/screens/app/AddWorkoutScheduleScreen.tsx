// app/screens/app/AddWorkoutScheduleScreen.tsx
"use client"

import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
  StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { createWorkoutSchedule } from "../../redux/slices/workoutScheduleSlice"
import { getAllWorkouts } from "../../redux/slices/trainingSlice"
import { ArrowLeft, Check, Clock, Bell } from "lucide-react-native"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Picker } from "@react-native-picker/picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import { LinearGradient } from "expo-linear-gradient"
import ScreenHeader from "~/app/components/ScreenHeader"
import SaveButton from "~/app/components/SaveButton"

// Array nama hari dalam bahasa Indonesia
const HARI = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"]
const HARI_LABEL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

type RouteParams = {
  AddWorkoutSchedule: {
    selectedDay: string;
  };
};

const AddWorkoutScheduleScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const route = useRoute<RouteProp<RouteParams, "AddWorkoutSchedule">>()
  
  const { selectedDay = "senin" } = route.params || {}
  const { workoutList, isLoading: workoutsLoading } = useSelector((state: RootState) => state.training)
  const { isLoading } = useSelector((state: RootState) => state.workoutSchedule)

  // Form state
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null)
  const [currentDay, setCurrentDay] = useState(selectedDay);
  const [showDayPicker, setShowDayPicker] = useState(false)
  const [timeString, setTimeString] = useState("06:00")
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [time, setTime] = useState(new Date())
  const [duration, setDuration] = useState("30")
  const [reminder, setReminder] = useState(true)

  useEffect(() => {
    // Ambil daftar latihan jika belum diambil
    if (workoutList.length === 0) {
      dispatch(getAllWorkouts())
    }

    // Set waktu default
    const today = new Date()
    today.setHours(6, 0, 0, 0)
    setTime(today)
  }, [])

  // Handler untuk perubahan waktu
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false)
    if (selectedDate) {
      setTime(selectedDate)
      const hours = selectedDate.getHours().toString().padStart(2, "0")
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0")
      setTimeString(`${hours}:${minutes}`)
    }
  }

  // Handler
   // Handler untuk menyimpan jadwal latihan
   const handleSaveSchedule = async () => {
    if (!selectedWorkoutId) {
      Alert.alert("Error", "Silakan pilih jenis latihan")
      return
    }

    if (!timeString) {
      Alert.alert("Error", "Silakan pilih waktu mulai")
      return
    }

    if (!duration || isNaN(parseInt(duration)) || parseInt(duration) < 5) {
      Alert.alert("Error", "Durasi latihan minimal 5 menit")
      return
    }

    try {
      await dispatch(createWorkoutSchedule({
        id_master_latihan: selectedWorkoutId,
        hari: selectedDay,
        waktu_mulai: timeString,
        durasi_menit: parseInt(duration),
        pengingat: reminder,
      })).unwrap()

      Alert.alert("Sukses", "Jadwal latihan berhasil dibuat", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      console.error("Gagal membuat jadwal latihan:", error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header dengan gradient */}
      <ScreenHeader title="Tambah Jadwal" />

      <ScrollView style={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Tambah Jadwal Baru</Text>

          {/* Pilih Latihan */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Jenis Latihan</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedWorkoutId}
                onValueChange={(itemValue) => setSelectedWorkoutId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Pilih Jenis Latihan" value={null} />
                {workoutList.map((workout) => (
                  <Picker.Item
                    key={workout.id}
                    label={workout.nama_latihan}
                    value={workout.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Pilih Hari */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Hari</Text>
              <Text>
                {HARI_LABEL[HARI.indexOf(selectedDay)] || "Pilih Hari"}
              </Text>
            {showDayPicker && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedDay}
                  onValueChange={(itemValue) => {
                    setCurrentDay(itemValue)
                    setShowDayPicker(false)
                  }}
                >
                  {HARI.map((hari, index) => (
                    <Picker.Item
                      key={hari}
                      label={HARI_LABEL[index]}
                      value={hari}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          {/* Pilih Waktu */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Waktu Mulai</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={18} color="#6B7280" />
              <Text style={styles.inputText}>{timeString}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>

          {/* Durasi */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Durasi (menit)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholder="Masukkan durasi dalam menit"
            />
          </View>

          {/* Reminder */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Pengingat</Text>
            <View style={styles.reminderContainer}>
              <View style={styles.reminderContent}>
                <Bell size={20} color={reminder ? "#10B981" : "#6B7280"} />
                <Text style={styles.reminderText}>
                  {reminder ? "Pengingat Aktif" : "Pengingat Nonaktif"}
                </Text>
              </View>
              <Switch
                value={reminder}
                onValueChange={setReminder}
                trackColor={{ false: "#E5E7EB", true: "#FEF3C7" }}
                thumbColor={reminder ? "#FFB800" : "#9CA3AF"}
              />
            </View>
          </View>

          {/* Tombol Simpan */}
          <SaveButton onPress={handleSaveSchedule} isLoading={isLoading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4B5563",
    marginBottom: 8,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  inputText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#1F2937",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    marginTop: 4,
  },
  picker: {
    height: 50,
  },
  reminderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  reminderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#1F2937",
  },
})

export default AddWorkoutScheduleScreen