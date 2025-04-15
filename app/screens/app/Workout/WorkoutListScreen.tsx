// app/screens/app/WorkoutListScreen.tsx
"use client"

import React, { useEffect, useState } from "react"
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import { getAllWorkouts, getAllWorkoutCategories, TrainingState } from "../../../redux/slices/workoutSlice"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { Dumbbell, ChevronRight, Filter } from "lucide-react-native"
import { AppDispatch, RootState } from "~/app/redux/store"


const WorkoutListScreen = () => {
  const dispatch: AppDispatch = useDispatch()
  const navigation = useNavigation<NavigationProp<TrainingState>>();
  const { workoutList, workoutCategories, isLoading } = useSelector((state: RootState) => state.training)
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  useEffect(() => {
    dispatch(getAllWorkouts())
    dispatch(getAllWorkoutCategories())
  }, [])
  
  // Filter workouts by category if selected
  const filteredWorkouts = selectedCategory 
    ? workoutList.filter((workout: { id_kategori: any }) => workout.id_kategori === selectedCategory) 
    : workoutList
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB800" />
      </View>
    )
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Latihan</Text>
      </View>
      
      {/* Category Pills */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.categoryPill, !selectedCategory && styles.categoryPillActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>
              Semua
            </Text>
          </TouchableOpacity>
          
          {workoutCategories.map(category => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.categoryPill, 
                selectedCategory === category.id && styles.categoryPillActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.nama_kategori}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Workout List */}
      <FlatList
        data={filteredWorkouts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.workoutItem}
            onPress={() => navigation.navigate('WorkoutDetail', { workoutId: item.id })}
          >
            <View style={styles.workoutIconContainer}>
              <Dumbbell size={24} color="#FFB800" />
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>{item.nama_latihan}</Text>
              <Text style={styles.workoutDetails}>
                {Math.round(item.ratarata_waktu_perdetik / 60)} menit • 
                {Math.round(item.kalori_ratarata_perdetik * 60)} kal/min
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Tidak ada latihan yang tersedia
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFB800',
    padding: 16,
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
  },
  categoryContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  categoryPillActive: {
    backgroundColor: '#FFB800',
  },
  categoryText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  workoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  workoutDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
})

export default WorkoutListScreen