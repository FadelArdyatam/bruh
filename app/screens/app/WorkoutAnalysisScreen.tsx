// app/screens/app/WorkoutAnalysisScreen.tsx
import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import { getWorkoutAnalysis, getWorkoutStats } from "../../redux/slices/workoutSlice"
import { ArrowLeft, TrendingUp, BarChart2, Calendar, Activity, Heart, Zap } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"
import { LinearGradient } from "expo-linear-gradient"

const screenWidth = Dimensions.get("window").width

const WorkoutAnalysisScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const { workoutAnalysis, workoutStats, isLoading } = useSelector((state) => state.training)
  
  const [activeTab, setActiveTab] = useState("weekly")
  
  useEffect(() => {
    dispatch(getWorkoutAnalysis())
    dispatch(getWorkoutStats())
  }, [dispatch])
  
// app/screens/app/WorkoutAnalysisScreen.tsx (lanjutan)
  // Prepare data for weekly chart
  const prepareWeeklyData = () => {
    if (!workoutAnalysis?.weekly_data) return null
    
    const labels = []
    const caloriesData = []
    const durationData = []
    
    // Sort weeks chronologically
    const sortedWeeks = Object.keys(workoutAnalysis.weekly_data)
      .sort((a, b) => Number(workoutAnalysis.weekly_data[a].week) - Number(workoutAnalysis.weekly_data[b].week))
    
    sortedWeeks.forEach(key => {
      const weekData = workoutAnalysis.weekly_data[key]
      labels.push(`W${weekData.week}`)
      caloriesData.push(weekData.total_calories_burned || 0)
      durationData.push(weekData.total_duration || 0)
    })
    
    return {
      labels,
      caloriesData,
      durationData
    }
  }
  
  // Prepare data for intensity chart
  const prepareIntensityData = () => {
    if (!workoutAnalysis?.intensity_data) return null
    
    const data = []
    const colors = ["#FFB800", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"]
    let i = 0
    
    Object.keys(workoutAnalysis.intensity_data).forEach(key => {
      const intensity = workoutAnalysis.intensity_data[key]
      data.push({
        name: intensity.zone,
        count: intensity.count,
        color: colors[i % colors.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 12
      })
      i++
    })
    
    return data
  }
  
  // Helper to render weekly chart
  const renderWeeklyChart = () => {
    const data = prepareWeeklyData()
    
    if (!data) return null
    
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.caloriesData,
          color: (opacity = 1) => `rgba(255, 184, 0, ${opacity})`,
          strokeWidth: 2
        }
      ],
      legend: ["Kalori Terbakar"]
    }
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Kalori Terbakar per Minggu</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#FFFFFF",
            backgroundGradientFrom: "#FFFFFF",
            backgroundGradientTo: "#FFFFFF",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#FFB800"
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>
    )
  }
  
  // Helper to render intensity chart
  const renderIntensityChart = () => {
    const data = prepareIntensityData()
    
    if (!data) return null
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribusi Intensitas Latihan</Text>
        <PieChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#FFFFFF",
            backgroundGradientFrom: "#FFFFFF",
            backgroundGradientTo: "#FFFFFF",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          absolute
        />
      </View>
    )
  }
  
  // Render summary stats
  const renderSummaryStats = () => {
    if (!workoutStats) return null
    
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Ringkasan</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#FFB800" />
            <Text style={styles.statValue}>{workoutStats.total_workouts || 0}</Text>
            <Text style={styles.statLabel}>Total Latihan</Text>
          </View>
          
          <View style={styles.statCard}>
            <BarChart2 size={24} color="#10B981" />
            <Text style={styles.statValue}>{workoutStats.total_calories_burned || 0}</Text>
            <Text style={styles.statLabel}>Kalori Terbakar</Text>
          </View>
          
          <View style={styles.statCard}>
            <Calendar size={24} color="#3B82F6" />
            <Text style={styles.statValue}>{workoutStats.current_streak || 0}</Text>
            <Text style={styles.statLabel}>Hari Berturut</Text>
          </View>
          
          <View style={styles.statCard}>
            <Activity size={24} color="#F59E0B" />
            <Text style={styles.statValue}>{workoutStats.total_duration || 0}</Text>
            <Text style={styles.statLabel}>Menit Latihan</Text>
          </View>
        </View>
      </View>
    )
  }
  
  // Render active tab content
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFB800" />
        </View>
      )
    }
    
    switch (activeTab) {
      case "weekly":
        return (
          <>
            {renderSummaryStats()}
            {renderWeeklyChart()}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Rekomendasi</Text>
              <Text style={styles.infoText}>
                Berdasarkan analisis, Anda disarankan untuk meningkatkan frekuensi latihan untuk hasil yang lebih optimal.
              </Text>
            </View>
          </>
        )
      case "intensity":
        return (
          <>
            <View style={styles.intensityHeader}>
              <View style={styles.intensityInfo}>
                <Heart size={24} color="#EF4444" />
                <View style={styles.intensityTextContainer}>
                  <Text style={styles.intensityValue}>{workoutStats?.avg_heart_rate || 0} bpm</Text>
                  <Text style={styles.intensityLabel}>Rata-rata Detak Jantung</Text>
                </View>
              </View>
              
              <View style={styles.intensityInfo}>
                <Zap size={24} color="#FFB800" />
                <View style={styles.intensityTextContainer}>
                  <Text style={styles.intensityValue}>{workoutStats?.avg_intensity || 0}%</Text>
                  <Text style={styles.intensityLabel}>Rata-rata Intensitas</Text>
                </View>
              </View>
            </View>
            
            {renderIntensityChart()}
            
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Zona Intensitas</Text>
              <Text style={styles.infoText}>
                Pastikan latihan Anda berada pada zona 70-85% dari detak jantung maksimal untuk hasil pembakaran lemak yang optimal.
              </Text>
            </View>
          </>
        )
      default:
        return null
    }
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#FFB800", "#FF8A00"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analisis Latihan</Text>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "weekly" && styles.activeTab]}
            onPress={() => setActiveTab("weekly")}
          >
            <Text style={[styles.tabText, activeTab === "weekly" && styles.activeTabText]}>
              Mingguan
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === "intensity" && styles.activeTab]}
            onPress={() => setActiveTab("intensity")}
          >
            <Text style={[styles.tabText, activeTab === "intensity" && styles.activeTabText]}>
              Intensitas
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.content}>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingTop: 16,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFB800",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  loadingContainer: {
    paddingVertical: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  statCard: {
    width: "50%",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statInner: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  infoCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400E",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#92400E",
  },
  intensityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  intensityInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  intensityTextContainer: {
    marginLeft: 12,
  },
  intensityValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  intensityLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
})

export default WorkoutAnalysisScreen