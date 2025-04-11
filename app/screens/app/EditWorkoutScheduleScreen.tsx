// app/screens/app/EditWorkoutScheduleScreen.tsx
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
import { updateWorkoutSchedule } from "../../redux/slices/workoutScheduleSlice"
import { ArrowLeft, Check, Clock, Bell } from "lucide-react-native"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import DateTimePicker from "@react-native-community/datetimepicker"
import { LinearGradient } from "expo-linear-gradient"
import ScreenHeader from "~/app/components/ScreenHeader"
import SaveButton from "~/app/components/SaveButton"

type RouteParams = {
  EditWorkoutSchedule: {
    schedule: any;
  };
};

const EditWorkoutScheduleScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const route = useRoute<RouteProp<RouteParams, "EditWorkoutSchedule">>()
  
  const { schedule } = route.params || {}
  const { isLoading } = useSelector((state: RootState) => state.workoutSchedule)

  // Form state
  const [timeString, setTimeString] = useState(schedule?.waktu_mulai || "06:00")
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [time, setTime] = useState(() => {
    const [hours, minutes] = (schedule?.waktu_mulai || "06:00").split(":")
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    return date
  })
  const [duration, setDuration] = useState(schedule?.durasi_menit?.toString() || "30")
  const [reminder, setReminder] = useState(schedule?.pengingat || true)

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

  // Handler untuk menyimpan perubahan jadwal latihan
  const handleUpdateSchedule = async () => {
    if (!timeString) {
      Alert.alert("Error", "Silakan pilih waktu mulai")
      return
    }

    if (!duration || isNaN(parseInt(duration)) || parseInt(duration) < 5) {
      Alert.alert("Error", "Durasi latihan minimal 5 menit")
      return
    }

    try {
      await dispatch(updateWorkoutSchedule({
        id: schedule.id,
        data: {
          waktu_mulai: timeString,
          durasi_menit: parseInt(duration),
          pengingat: reminder,
        }
      })).unwrap()

      Alert.alert("Sukses", "Jadwal latihan berhasil diperbarui", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      console.error("Gagal memperbarui jadwal latihan:", error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header dengan gradient */}
      <ScreenHeader title="Edit Jadwal Latihan" />

      <ScrollView style={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Edit Jadwal Latihan</Text>
          
          {/* Info Latihan */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Jenis Latihan</Text>
            <Text style={styles.infoValue}>{schedule?.latihan?.nama_latihan}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Hari</Text>
            <Text style={styles.infoValue}>{schedule?.hari_label}</Text>
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
          <SaveButton onPress={handleUpdateSchedule} isLoading={isLoading} />
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
  infoContainer: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1F2937",
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

export default EditWorkoutScheduleScreen