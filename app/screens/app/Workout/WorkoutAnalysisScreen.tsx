// app/screens/app/WorkoutAnalysisScreen.tsx
"use client"

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import { getWorkoutAnalysis, getWorkoutStats } from "../../../redux/slices/workoutSlice"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, TrendingUp, Calendar, Activity, Heart, BarChart2 } from "lucide-react-native"
import { LineChart, BarChart, PieChart } from "react-native-chart-kit"
import { LinearGradient } from "expo-linear-gradient"
import { RootState } from "~/app/redux/store"
import { Action, ThunkDispatch } from "@reduxjs/toolkit"

const screenWidth = Dimensions.get("window").width - 40

const WorkoutAnalysisScreen = () => {
  const dispatch: ThunkDispatch<RootState, unknown, Action> = useDispatch();
  const navigation = useNavigation()
  const { workoutAnalysis, workoutStats, isLoading } = useSelector((state: RootState) => state.training);
  
  const [activeTab, setActiveTab] = useState("weekly")
  
  useEffect(() => {
    dispatch(getWorkoutAnalysis())
    dispatch(getWorkoutStats())
  }, [])
  
  // Prepare data for weekly chart
  const prepareWeeklyData = () => {
    if (!workoutAnalysis?.weekly_data) return null
    
    const labels: string[] = []
    const data: any[] = []
    
    // Sort weeks chronologically
    const sortedWeeks = Object.keys(workoutAnalysis.weekly_data)
      .sort((a, b) => Number(a) - Number(b))
      .slice(-6) // Last 6 weeks
    
    sortedWeeks.forEach(week => {
      const weekData = workoutAnalysis.weekly_data[week]
      labels.push(`W${week}`)
      data.push(weekData.total_calories_burned || 0)
    })
    
    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(255, 184, 0, ${opacity})`,
          strokeWidth: 2
        }
      ],
      legend: ["Kalori"]
    }
  }
  
  // Prepare data for intensity chart
  const prepareIntensityData = () => {
    if (!workoutAnalysis?.intensity_distribution) return null
    
    return [
      {
        name: "Rendah",
        population: workoutAnalysis.intensity_distribution.low || 0,
        color: "#3B82F6",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12
      },
      {
        name: "Sedang",
        population: workoutAnalysis.intensity_distribution.medium || 0,
        color: "#10B981",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12
      },
      {
        name: "Tinggi",
        population: workoutAnalysis.intensity_distribution.high || 0,
        color: "#FFB800",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12
      },
      {
        name: "Sangat Tinggi",
        population: workoutAnalysis.intensity_distribution.very_high || 0,
        color: "#EF4444",
        legendFontColor: "#7F7F7F",
        legendFontSize: 12
      }
    ]
  }
  
  if (isLoading && !workoutStats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB800" />
      </View>
    )
  }
  
  const weeklyData = prepareWeeklyData()
  const intensityData = prepareIntensityData()
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#FFB800", "#FF8A00"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
        {activeTab === "weekly" ? (
          <>
            {/* Stats Overview */}
            <View style={styles.statsOverview}>
              <Text style={styles.sectionTitle}>Ringkasan</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
                    <Activity size={24} color="#FFB800" />
                  </View>
                  <Text style={styles.statValue}>{workoutStats?.total_workouts || 0}</Text>
                  <Text style={styles.statLabel}>Total Latihan</Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: "#DCFCE7" }]}>
                    <TrendingUp size={24} color="#10B981" />
                  </View>
                  <Text style={styles.statValue}>{workoutStats?.total_calories_burned?.toFixed(0) || 0}</Text>
                  <Text style={styles.statLabel}>Kalori Terbakar</Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: "#EFF6FF" }]}>
                    <Calendar size={24} color="#3B82F6" />
                  </View>
                  <Text style={styles.statValue}>{workoutStats?.current_streak || 0}</Text>
                  <Text style={styles.statLabel}>Hari Berturut</Text>
                </View>
                
                <View style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: "#FEE2E2" }]}>
                    <Heart size={24} color="#EF4444" />
                  </View>
                  <Text style={styles.statValue}>{workoutStats?.avg_heart_rate || 0}</Text>
                  <Text style={styles.statLabel}>Rata-rata BPM</Text>
                </View>
              </View>
            </View>
            
            {/* Weekly Chart */}
            {weeklyData && (
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Kalori Terbakar per Minggu</Text>
                <LineChart
                  data={weeklyData}
                  width={screenWidth}
                  height={220}
                  chartConfig={{
                    backgroundColor: "#FFFFFF",
                    backgroundGradientFrom: "#FFFFFF",
                    backgroundGradientTo: "#FFFFFF",
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
                  style={styles.chart}
                />
              </View>
            )}
            
            {/* Recommendation */}
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationTitle}>Rekomendasi</Text>
              <Text style={styles.recommendationText}>
                Berdasarkan aktivitas latihan Anda, untuk hasil optimal sebaiknya tingkatkan frekuensi latihan di zona kardio (70-85% detak jantung maksimal). Pola latihan Anda menunjukkan perbaikan, pertahankan konsistensi ini!
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Intensity Distribution */}
            <View style={styles.intenseStatsRow}>
              <View style={styles.intenseStat}>
                <View style={styles.intenseStatIcon}>
                  <Heart size={24} color="#EF4444" />
                </View>
                <View>
                  <Text style={styles.intenseStatValue}>{workoutStats?.avg_heart_rate || 0} bpm</Text>
                  <Text style={styles.intenseStatLabel}>Rata-rata Detak Jantung</Text>
                </View>
              </View>
              
              <View style={styles.intenseStat}>
                <View style={styles.intenseStatIcon}>
                  <BarChart2 size={24} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.intenseStatValue}>{workoutStats?.avg_intensity || 0}%</Text>
                  <Text style={styles.intenseStatLabel}>Rata-rata Intensitas</Text>
                </View>
              </View>
            </View>
            
            {/* Intensity Pie Chart */}
            {intensityData && (
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Distribusi Intensitas Latihan</Text>
                <PieChart
                  data={intensityData}
                  width={screenWidth}
                  height={220}
                  chartConfig={{
                    backgroundColor: "#FFFFFF",
                    backgroundGradientFrom: "#FFFFFF",
                    backgroundGradientTo: "#FFFFFF",
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                />
              </View>
            )}
            
            {/* Intensity Explanation */}
            <View style={styles.explanationCard}>
              <Text style={styles.explanationTitle}>Zona Intensitas Latihan</Text>
              
              <View style={styles.zoneItem}>
                <View style={[styles.zoneColor, { backgroundColor: "#3B82F6" }]} />
                <View style={styles.zoneInfo}>
                  <Text style={styles.zoneName}>Zona Rendah: 50-60%</Text>
                  <Text style={styles.zoneDesc}>Pemulihan aktif, pemanasan, latihan ringan</Text>
                </View>
              </View>
              
              <View style={styles.zoneItem}>
                <View style={[styles.zoneColor, { backgroundColor: "#10B981" }]} />
                <View style={styles.zoneInfo}>
                  <Text style={styles.zoneName}>Zona Sedang: 60-70%</Text>
                  <Text style={styles.zoneDesc}>Pembakaran lemak, ketahanan dasar</Text>
                </View>
              </View>
              
              <View style={styles.zoneItem}>
                <View style={[styles.zoneColor, { backgroundColor: "#FFB800" }]} />
                <View style={styles.zoneInfo}>
                  <Text style={styles.zoneName}>Zona Tinggi: 70-85%</Text>
                  <Text style={styles.zoneDesc}>Kardiovaskular, peningkatan kapasitas aerobik</Text>
                </View>
              </View>
              
              <View style={styles.zoneItem}>
                <View style={[styles.zoneColor, { backgroundColor: "#EF4444" }]} />
                <View style={styles.zoneInfo}>
                  <Text style={styles.zoneName}>Zona Sangat Tinggi: 85-100%</Text>
                  <Text style={styles.zoneDesc}>Anaerobik, pelatihan interval intensif</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFB800',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginTop: -16,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsOverview: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  recommendationCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#92400E',
  },
  intenseStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  intenseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  intenseStatIcon: {
    marginRight: 12,
  },
  intenseStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  intenseStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  explanationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  zoneItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  zoneColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    marginTop: 4,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  zoneDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
})

export default WorkoutAnalysisScreen