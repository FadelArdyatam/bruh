"use client";

import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { getWorkoutHistory, getWorkoutStats } from "../../../redux/slices/workoutSlice";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Activity, Calendar, FireExtinguisher, Clock, ChevronRight } from "lucide-react-native";
import { RootState } from "~/app/redux/store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";

const WorkoutHistoryScreen = () => {
  const dispatch: ThunkDispatch<RootState, unknown, Action> = useDispatch();
  const navigation = useNavigation();
  const { trainingHistory, workoutStats, isLoading } = useSelector((state: RootState) => state.training);

  useEffect(() => {
    async function fetchData() {
      try {
        // Muat data history terlebih dahulu
        await dispatch(getWorkoutHistory()).unwrap();
        // Setelah history dimuat, hitung stats
        dispatch(getWorkoutStats());
      } catch (error) {
        console.error("Error loading workout data:", error);
      }
    }
  
    fetchData();
  }, []);

  // Function to format date
// Perbaikan untuk formatDate dan item rendering
const formatDate = (dateString: string | number | Date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    // Cek apakah dateString valid
    if (!dateString) return 'Tanggal tidak tersedia';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.warn("Invalid date:", dateString);
      return 'Tanggal tidak valid';
    }
    
    return date.toLocaleDateString('id-ID', options);
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return 'Tanggal tidak valid';
  }
};

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB800" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Latihan</Text>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
  <View style={styles.statCard}>
    <Activity size={24} color="#FFB800" />
    <Text style={styles.statValue}>{workoutStats?.total_workouts || 0}</Text>
    <Text style={styles.statLabel}>Total Latihan</Text>
  </View>

  <View style={styles.statCard}>
    <FireExtinguisher size={24} color="#EF4444" />
    <Text style={styles.statValue}>
      {workoutStats?.total_calories_burned 
        ? workoutStats.total_calories_burned.toLocaleString('id-ID')
        : '0'} kal
    </Text>
    <Text style={styles.statLabel}>Kalori Terbakar</Text>
  </View>

  <View style={styles.statCard}>
    <Clock size={24} color="#8B5CF6" />
    <Text style={styles.statValue}>
      {workoutStats?.total_duration ? workoutStats.total_duration.toLocaleString('id-ID') : '0'} min
    </Text>
    <Text style={styles.statLabel}>Menit Latihan</Text>
  </View>
</View>

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>Riwayat Aktivitas</Text>
        <TouchableOpacity
          style={styles.analysisButton}
          onPress={() => navigation.navigate('WorkoutAnalysis')}
        >
          <Text style={styles.analysisButtonText}>Lihat Analisis</Text>
          <ChevronRight size={16} color="#FFB800" />
        </TouchableOpacity>
      </View>

      <FlatList
  data={trainingHistory}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyIconContainer}>
        <Activity size={24} color="#FFB800" />
      </View>
      <View style={styles.historyInfo}>
        {/* Gunakan optional chaining dan fallback untuk menghindari error */}
        <Text style={styles.historyWorkoutName}>
          {item.workout_name || item.nama_latihan || 'Latihan Tidak Diketahui'}
        </Text>
        <Text style={styles.historyDate}>
          {formatDate(item.date || item.tgl_latihan || item.tanggal)}
        </Text>
      </View>
      <View style={styles.historyStats}>
        {/* Gunakan optional chaining dan fallback untuk menghindari error */}
        <Text style={styles.historyCalories}>
          {Math.round(item.calories_burned || item.kalori_dibakar || 0)} kal
        </Text>
        <Text style={styles.historyDuration}>
          {Math.round(item.duration || item.waktu_latihan || 0)} min
        </Text>
      </View>
    </View>
  )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
               Belum ada riwayat latihan
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFB800',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  listHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  analysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analysisButtonText: {
    color: '#FFB800',
    marginRight: 4,
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  historyIconContainer: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyWorkoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  historyStats: {
    alignItems: 'flex-end',
  },
  historyCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
    marginBottom: 4,
  },
  historyDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default WorkoutHistoryScreen;