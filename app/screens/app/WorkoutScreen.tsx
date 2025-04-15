// app/screens/app/WorkoutScreen.tsx
"use client"

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../redux/store"
import {
  getAllWorkouts,
  getWorkoutHistory,
  getWorkoutStats
} from "../../redux/slices/workoutSlice"
import {
  getAllWorkoutSchedules
} from "../../redux/slices/workoutScheduleSlice"
import {
  Calendar,
  Clock,
  BarChart2,
  ArrowRight,
  Dumbbell,
  Activity,
  Heart,
  Menu,
  History
} from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { LinearGradient } from "expo-linear-gradient"
import { getWorkoutIcon, getActivityIcon, getWorkoutIconBackground, isHighIntensityWorkout } from "../../../assets/Icon/WorkoutIcon"
import RecentActivities from "./AktivitasTerbaru"

const screenWidth = Dimensions.get("window").width;

const WorkoutScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { 
    workoutList, 
    trainingHistory, 
    workoutStats, 
    isLoading 
  } = useSelector((state: RootState) => state.training)
  const { schedules } = useSelector((state: RootState) => state.workoutSchedule)

  const [featuredWorkouts, setFeaturedWorkouts] = useState<any[]>([])
  const [todaySchedules, setTodaySchedules] = useState<any[]>([])

  useEffect(() => {
    dispatch(getAllWorkouts())
    dispatch(getWorkoutHistory())
    dispatch(getWorkoutStats())
    dispatch(getAllWorkoutSchedules())
  }, [])

  useEffect(() => {
    if (workoutList.length > 0) {
      // Use all workouts for better filtering by intensity
      setFeaturedWorkouts(workoutList)
    }
  }, [workoutList])

  useEffect(() => {
    if (schedules) {
      // Get current day of week
      const days = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"]
      const today = days[new Date().getDay()]
      
      // Get today's schedules
      const todayWorkouts = schedules[today] || []
      setTodaySchedules(todayWorkouts)
    }
  }, [schedules])

  // Format waktu dari HH:MM menjadi format yang lebih bersahabat
  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":")
    const hourInt = parseInt(hour, 10)
    const ampm = hourInt >= 12 ? "PM" : "AM"
    const formattedHour = hourInt % 12 || 12
    return `${formattedHour}:${minute} ${ampm}`
  }

  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const navigateToWorkoutList = () => {
    navigation.navigate("WorkoutList")
  }

  const navigateToWorkoutHistory = () => {
    navigation.navigate("WorkoutHistory")
  }

  const navigateToWorkoutSchedule = () => {
    navigation.navigate("WorkoutSchedule")
  }

  const navigateToWorkoutAnalysis = () => {
    navigation.navigate("WorkoutAnalysis")
  }

  const navigateToWorkoutDetail = (workoutId: number) => {
    navigation.navigate("WorkoutDetail", { workoutId })
  }

  if (isLoading && workoutList.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB800" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#FFB800", "#FF8A00"]} style={styles.header}>
        <Text style={styles.headerTitle}>PROGRAM LATIHAN</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
              <Activity size={24} color="#FFB800" />
            </View>
            <Text style={styles.statValue}>{workoutStats?.total_workouts || 0}</Text>
            <Text style={styles.statLabel}>Total Latihan</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "#DCFCE7" }]}>
              <BarChart2 size={24} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{workoutStats?.total_calories_burned?.toFixed(0) || 0}</Text>
            <Text style={styles.statLabel}>Kalori</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: "#FEE2E2" }]}>
              <Heart size={24} color="#EF4444" />
            </View>
            <Text style={styles.statValue}>{workoutStats?.avg_heart_rate || 0}</Text>
            <Text style={styles.statLabel}>BPM</Text>
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Jadwal Hari Ini</Text>
            <TouchableOpacity onPress={navigateToWorkoutSchedule}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {todaySchedules.length > 0 ? (
            todaySchedules.map((schedule, index) => (
              <View key={index} style={styles.scheduleItem}>
                <View style={styles.scheduleIconContainer}>
                  <Calendar size={24} color="#FFB800" />
                </View>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleTitle}>{schedule.latihan?.nama_latihan}</Text>
                  <View style={styles.scheduleTimeContainer}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.scheduleTime}>
                      {formatTime(schedule.waktu_mulai)} • {schedule.durasi_menit} menit
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={() => navigateToWorkoutDetail(schedule.id_master_latihan)}
                >
                  <Text style={styles.startButtonText}>Mulai</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Calendar size={40} color="#E5E7EB" />
              <Text style={styles.emptyText}>Tidak ada jadwal untuk hari ini</Text>
              <TouchableOpacity 
                style={styles.addScheduleButton}
                onPress={navigateToWorkoutSchedule}
              >
                <Text style={styles.addScheduleText}>Atur Jadwal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* High Intensity Workouts */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktivitas Intensitas Tinggi</Text>
            <TouchableOpacity onPress={navigateToWorkoutList}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={featuredWorkouts.filter(workout => isHighIntensityWorkout(workout.kalori_ratarata_perdetik))}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.workoutCard}
                onPress={() => navigateToWorkoutDetail(item.id)}
              >
                <View style={[
                  styles.workoutIconContainer,
                  { backgroundColor: getWorkoutIconBackground(true) }
                ]}>
                  {getWorkoutIcon(item, false, true)}
                </View>
                <Text style={styles.workoutTitle}>{item.nama_latihan}</Text>
                <View style={styles.workoutStats}>
                  <View style={styles.workoutStat}>
                    <Clock size={14} color="#9CA3AF" />
                    <Text style={styles.workoutStatText}>
                      {Math.round(item.ratarata_waktu_perdetik / 60)} min
                    </Text>
                  </View>
                  <View style={styles.workoutStat}>
                    <BarChart2 size={14} color="#9CA3AF" />
                    <Text style={styles.workoutStatText}>
                      {Math.round(item.kalori_ratarata_perdetik * 60)} kal/min
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Dumbbell size={40} color="#E5E7EB" />
                <Text style={styles.emptyText}>Tidak ada latihan intensitas tinggi tersedia</Text>
              </View>
            }
          />
        </View>

        {/* Low Intensity Workouts */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktivitas Intensitas Rendah</Text>
            <TouchableOpacity onPress={navigateToWorkoutList}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={featuredWorkouts.filter(workout => !isHighIntensityWorkout(workout.kalori_ratarata_perdetik))}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.workoutCard}
                onPress={() => navigateToWorkoutDetail(item.id)}
              >
                <View style={[
                  styles.workoutIconContainer,
                  { backgroundColor: getWorkoutIconBackground(false) }
                ]}>
                  {getWorkoutIcon(item, false, false)}
                </View>
                <Text style={styles.workoutTitle}>{item.nama_latihan}</Text>
                <View style={styles.workoutStats}>
                  <View style={styles.workoutStat}>
                    <Clock size={14} color="#9CA3AF" />
                    <Text style={styles.workoutStatText}>
                      {Math.round(item.ratarata_waktu_perdetik / 60)} min
                    </Text>
                  </View>
                  <View style={styles.workoutStat}>
                    <BarChart2 size={14} color="#9CA3AF" />
                    <Text style={styles.workoutStatText}>
                      {Math.round(item.kalori_ratarata_perdetik * 60)} kal/min
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Dumbbell size={40} color="#E5E7EB" />
                <Text style={styles.emptyText}>Tidak ada latihan intensitas rendah tersedia</Text>
              </View>
            }
          />
        </View>

        <RecentActivities trainingHistory={trainingHistory} />

        {/* Menu Links */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToWorkoutList}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#FEF3C7" }]}>
              <Dumbbell size={24} color="#FFB800" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Daftar Latihan</Text>
              <Text style={styles.menuDesc}>Lihat semua jenis latihan yang tersedia</Text>
            </View>
            <ArrowRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToWorkoutSchedule}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#EFF6FF" }]}>
              <Calendar size={24} color="#3B82F6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Jadwal Latihan</Text>
              <Text style={styles.menuDesc}>Atur jadwal latihan mingguan Anda</Text>
            </View>
            <ArrowRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToWorkoutHistory}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#DCFCE7" }]}>
              <History size={24} color="#10B981" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Riwayat Latihan</Text>
              <Text style={styles.menuDesc}>Lihat riwayat aktivitas latihan Anda</Text>
            </View>
            <ArrowRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={navigateToWorkoutAnalysis}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#FEE2E2" }]}>
              <BarChart2 size={24} color="#EF4444" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Analisis Latihan</Text>
              <Text style={styles.menuDesc}>Lihat perkembangan dan analisis latihan Anda</Text>
            </View>
            <ArrowRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  statItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    width: (screenWidth - 48) / 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  seeAllText: {
    color: "#FFB800",
    fontWeight: "500",
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  scheduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  scheduleTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scheduleTime: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  startButton: {
    backgroundColor: "#FFB800",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#9CA3AF",
    marginVertical: 8,
    textAlign: "center",
  },
  addScheduleButton: {
    backgroundColor: "#FFB800",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  addScheduleText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  workoutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 160,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  workoutIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  workoutStats: {
    flexDirection: "column",
  },
  workoutStat: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  workoutStatText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  activityStats: {
    alignItems: "flex-end",
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFB800",
    marginBottom: 2,
  },
  durationText: {
    fontSize: 14,
    color: "#6B7280",
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    marginBottom: 30,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    marginBottom: 16,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  menuDesc: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default WorkoutScreen;