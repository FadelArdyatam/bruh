// app/screens/app/LogWorkoutScreen.tsx
"use client"

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import { getWorkoutDetail, logWorkout } from "../../../redux/slices/workoutSlice"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"
import { ArrowLeft, Heart, Clock, MapPin, Calendar, Save } from "lucide-react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { RootState } from "~/app/redux/store"
import { Action,ThunkDispatch } from "@reduxjs/toolkit"

const LogWorkoutScreen = () => {
    const dispatch: ThunkDispatch<RootState, unknown, Action> = useDispatch();
  const navigation = useNavigation()
  const route = useRoute<RouteProp<Record<string, WorkoutSelectedRouteParams>>>();
  const { selectedWorkoutId } = route.params || {}
  type WorkoutSelectedRouteParams ={
    selectedWorkoutId: number,
}
  
  const { selectedWorkout, isLoading } = useSelector((state: RootState) => state.training);
  
  const [heartRate, setHeartRate] = useState("")
  const [duration, setDuration] = useState("")
  const [distance, setDistance] = useState("")
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  
  useEffect(() => {
    if (selectedWorkoutId) {
      dispatch(getWorkoutDetail(selectedWorkoutId))
    }
  }, [selectedWorkoutId])
  
  const handleSave = async () => {
    if (!heartRate || !duration) {
      Alert.alert("Error", "Denyut jantung dan durasi latihan harus diisi");
      return;
    }
  
    try {
      const workoutData = {
       id_master_latihan: selectedWorkoutId,
       denyut_jantung: parseInt(heartRate, 10),
       waktu_latihan: parseInt(duration, 10),
       tgl_latihan: formatDateForAPI(date), // Format date for API
       jarak_tempuh: distance ? parseFloat(distance) : 0,
     };
  
      await dispatch(logWorkout(workoutData)).unwrap();
  
      Alert.alert("Sukses", "Data latihan berhasil disimpan", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan data latihan");
      console.error(error);
    }
  };
  
  // Helper function to format date for API
  const formatDateForAPI = (date: Date) => {
    const dateString = date.toISOString();
    return dateString.split('T')[0]; // Return date part in ISO format
  };
  
  
  if (isLoading && !selectedWorkout) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB800" />
      </View>
    )
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Catat Latihan</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.workoutCard}>
          <Text style={styles.workoutTitle}>
            {selectedWorkout?.nama_latihan || "Latihan"}
          </Text>
          
          <Text style={styles.sectionTitle}>Detail Latihan</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Heart size={20} color="#EF4444" />
              <Text style={styles.labelText}>Denyut Jantung Maksimal (bpm)</Text>
            </View>
            <TextInput
              style={styles.input}
              value={heartRate}
              onChangeText={setHeartRate}
              placeholder="Masukkan denyut jantung"
              keyboardType="number-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Clock size={20} color="#3B82F6" />
              <Text style={styles.labelText}>Durasi Latihan (menit)</Text>
            </View>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="Masukkan durasi latihan"
              keyboardType="number-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <MapPin size={20} color="#10B981" />
              <Text style={styles.labelText}>Jarak Tempuh (km) [Opsional]</Text>
            </View>
            <TextInput
              style={styles.input}
              value={distance}
              onChangeText={setDistance}
              placeholder="Masukkan jarak tempuh"
              keyboardType="decimal-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Calendar size={20} color="#8B5CF6" />
              <Text style={styles.labelText}>Tanggal Latihan</Text>
            </View>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false)
                  if (selectedDate) {
                    setDate(selectedDate)
                  }
                }}
              />
            )}
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Save size={20} color="white" />
              <Text style={styles.saveButtonText}>SIMPAN LATIHAN</Text>
            </>
          )}
        </TouchableOpacity>
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  workoutCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  dateInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#FFB800',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 24,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
})

export default LogWorkoutScreen