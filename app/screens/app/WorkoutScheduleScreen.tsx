
import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import {
  getAllWorkoutSchedules,
  deleteWorkoutSchedule,
} from "../../redux/slices/workoutScheduleSlice"
import { getAllWorkouts } from "../../redux/slices/workoutSlice"
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  Trash2,
  Edit,
  Bell,
  BellOff,
} from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { LinearGradient } from "expo-linear-gradient"

// Array nama hari dalam bahasa Indonesia
const HARI = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"]
const HARI_LABEL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

const WorkoutScheduleScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { schedules, isLoading } = useSelector((state: RootState) => state.workoutSchedule)
  
  // State untuk hari aktif yang dipilih
  const [activeDay, setActiveDay] = useState("senin")

  useEffect(() => {
    // Mengambil semua jadwal latihan dan daftar latihan yang tersedia
    dispatch(getAllWorkoutSchedules())
    dispatch(getAllWorkouts())
  }, [])

  // Handler untuk menghapus jadwal latihan
  const handleDeleteSchedule = (id: number) => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menghapus jadwal latihan ini?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          onPress: async () => {
            try {
              await dispatch(deleteWorkoutSchedule(id)).unwrap()
              Alert.alert("Sukses", "Jadwal latihan berhasil dihapus")
            } catch (error) {
              console.error("Gagal menghapus jadwal latihan:", error)
            }
          },
          style: "destructive",
        },
      ]
    )
  }

  // Handler untuk mengedit jadwal latihan
  const handleEditSchedule = (schedule: any) => {
    navigation.navigate("EditWorkoutSchedule", { schedule })
  }

  // Handler untuk menambah jadwal latihan baru
  const handleAddSchedule = () => {
    navigation.navigate("AddWorkoutSchedule", { selectedDay: activeDay })
  }

  // Format waktu dari HH:MM menjadi format yang lebih bersahabat
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":")
    const hourInt = parseInt(hour, 10)
    const ampm = hourInt >= 12 ? "PM" : "AM"
    const formattedHour = hourInt % 12 || 12
    return `${formattedHour}:${minute} ${ampm}`
  }

  // Mendapatkan jadwal untuk hari yang aktif
  const getSchedulesForActiveDay = () => {
    return schedules[activeDay] || []
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#1d1617" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jadwal Latihan</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Konten utama */}
      <View style={styles.content}>
        {/* Tab selector hari */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dayTabsContainer}
        >
          {HARI.map((hari, index) => (
            <TouchableOpacity
              key={hari}
              style={[
                styles.dayTab,
                activeDay === hari && styles.activeDayTab
              ]}
              onPress={() => setActiveDay(hari)}
            >
              <Text
                style={[
                  styles.dayTabText,
                  activeDay === hari && styles.activeDayTabText
                ]}
              >
                {HARI_LABEL[index]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Daftar jadwal latihan */}
        <View style={styles.scheduleListContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#FFB800" style={styles.loader} />
          ) : (
            <>
              <View style={styles.scheduleListHeader}>
                <Text style={styles.scheduleListTitle}>
                  Jadwal Latihan {HARI_LABEL[HARI.indexOf(activeDay)]}
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddSchedule}
                >
                  <Plus size={20} color="#FFB800" />
                  <Text style={styles.addButtonText}>Tambah</Text>
                </TouchableOpacity>
              </View>

              {getSchedulesForActiveDay().length > 0 ? (
                <ScrollView style={styles.scheduleList}>
                  {getSchedulesForActiveDay().map((schedule: any) => (
                    <View key={schedule.id} style={styles.scheduleItem}>
                      <View style={styles.scheduleContent}>
                        <View style={styles.scheduleIconContainer}>
                          <Calendar size={24} color="#FFB800" />
                        </View>
                        <View style={styles.scheduleDetails}>
                          <Text style={styles.scheduleName}>
                            {schedule.latihan.nama_latihan}
                          </Text>
                          <View style={styles.scheduleTime}>
                            <Clock size={16} color="#6B7280" />
                            <Text style={styles.scheduleTimeText}>
                              {formatTime(schedule.waktu_mulai)} • {schedule.durasi_menit} menit
                            </Text>
                          </View>
                          <View style={styles.reminderStatus}>
                            {schedule.pengingat ? (
                              <>
                                <Bell size={16} color="#10B981" />
                                <Text style={styles.reminderStatusText}>
                                  Pengingat aktif
                                </Text>
                              </>
                            ) : (
                              <>
                                <BellOff size={16} color="#EF4444" />
                                <Text style={[styles.reminderStatusText, { color: "#EF4444" }]}>
                                  Pengingat nonaktif
                                </Text>
                              </>
                            )}
                          </View>
                        </View>
                      </View>
                      <View style={styles.scheduleActions}>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleEditSchedule(schedule)}
                        >
                          <Edit size={20} color="#3B82F6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteSchedule(schedule.id)}
                        >
                          <Trash2 size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptySchedule}>
                  <Calendar size={64} color="#E5E7EB" />
                  <Text style={styles.emptyScheduleText}>
                    Belum ada jadwal latihan untuk hari {HARI_LABEL[HARI.indexOf(activeDay)]}
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyAddButton}
                    onPress={handleAddSchedule}
                  >
                    <Text style={styles.emptyAddButtonText}>
                      Tambah Jadwal Latihan
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f7f8f8",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1d1617",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dayTabsContainer: {
    marginBottom: 16,
  },
  dayTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  activeDayTab: {
    backgroundColor: "#6c3c0c",
  },
  dayTabText: {
    color: "#4B5563",
    fontWeight: "500",
  },
  activeDayTabText: {
    color: "white",
    fontWeight: "bold",
  },
  scheduleListContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scheduleListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  scheduleListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    marginLeft: 4,
    color: "#FFB800",
    fontWeight: "500",
  },
  scheduleList: {
    flex: 1,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  scheduleContent: {
    flexDirection: "row",
    flex: 1,
  },
  scheduleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  scheduleTime: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  scheduleTimeText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  reminderStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderStatusText: {
    fontSize: 14,
    color: "#10B981",
    marginLeft: 4,
  },
  scheduleActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptySchedule: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyScheduleText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyAddButton: {
    backgroundColor: "#FFB800",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyAddButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    alignSelf: "center",
  },
})

export default WorkoutScheduleScreen