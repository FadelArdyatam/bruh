// app/screens/app/WorkoutDetailScreen.tsx
"use client"

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import { getWorkoutDetail } from "../../../redux/slices/workoutSlice"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"
import { ArrowLeft, Clock, BarChart2, Calendar, Play } from "lucide-react-native"
import YoutubePlayer from "react-native-youtube-iframe"
import { RootState } from "~/app/redux/store"
import { Action, ThunkDispatch } from "@reduxjs/toolkit"
import { StackNavigationProp } from "@react-navigation/stack"

const WorkoutDetailScreen = () => {

  type WorkoutDetailScreenRouteParams = {
    workoutId: number,
  }

  type WorkoutDetailScreenNavigationProp = StackNavigationProp<{
    WorkoutDetail: { workoutId: number };
    AddWorkoutSchedule: { selectedWorkoutId: number };
    LogWorkout: { selectedWorkoutId: number };
    // Add other screens as needed
  }>;

  const dispatch: ThunkDispatch<RootState, unknown, Action> = useDispatch();
  const navigation = useNavigation<WorkoutDetailScreenNavigationProp>();

  const route = useRoute<RouteProp<Record<string, WorkoutDetailScreenRouteParams>>>();
  const { workoutId } = route.params || {};

  const { selectedWorkout, isLoading } = useSelector((state: RootState) => state.training);
  const [playing, setPlaying] = useState(false)

  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(() => {
    if (workoutId) {
      dispatch(getWorkoutDetail(workoutId))
    }
  }, [workoutId])

  // Helper function to extract YouTube video ID
  const getYoutubeVideoId = (url: string): string | undefined => {
    if (!url) return undefined;
    
    // Handle youtu.be links
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split(/[?&#]/)[0];
      return id.length === 11 ? id : undefined;
    }
  
    // Handle regular YouTube URLs
    const regExp = /^.*(youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtu\.be\/|youtube\.com\/watch\?.*v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : undefined;
  };


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB800" />
      </View>
    )
  }

  if (!selectedWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Latihan</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Latihan tidak ditemukan</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Latihan</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutTitle}>{selectedWorkout.nama_latihan}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Clock size={20} color="#6B7280" />
              <Text style={styles.statText}>
                {Math.round(selectedWorkout.ratarata_waktu_perdetik / 60)} menit
              </Text>
            </View>

            <View style={styles.statItem}>
              <BarChart2 size={20} color="#6B7280" />
              <Text style={styles.statText}>
                {Math.round(selectedWorkout.kalori_ratarata_perdetik * 60)} kal/min
              </Text>
            </View>
          </View>
        </View>

        {/* Video Tutorial */}
        {selectedWorkout.video_ketentuan_latihan && (
  <View style={styles.videoContainer}>
    <Text style={styles.sectionTitle}>Video Tutorial</Text>
    {playbackError ? (
      <View style={styles.errorView}>
        <Text style={styles.errorText}>{playbackError}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setPlaybackError(null);
            setPlaying(true);
          }}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <YoutubePlayer
        height={220}
        play={playing}
        videoId={getYoutubeVideoId(selectedWorkout.video_ketentuan_latihan) || undefined}
        onChangeState={(state) => {
          if (state === "playing") setPlaying(true);
          else if (state === "paused") setPlaying(false);
        }}
        onError={(error) => {
          setPlaybackError("Video playback failed. Please check your connection.");
          setPlaying(false);
        }}
      />
    )}
  </View>
)}

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.descriptionText}>
            {selectedWorkout.deskripsi_ketentuan_latihan}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Update the navigation calls in your buttons */}
          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={() => navigation.navigate('AddWorkoutSchedule', {
              selectedWorkoutId: workoutId
            })}
          >
            <Calendar size={20} color="white" />
            <Text style={styles.buttonText}>Jadwalkan Latihan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('LogWorkout', {
              selectedWorkoutId: workoutId
            })}
          >
            <Play size={20} color="white" />
            <Text style={styles.buttonText}>Mulai Latihan</Text>
          </TouchableOpacity>
        </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  workoutHeader: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  videoContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  errorView: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    padding: 16,
  },
  retryButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
})

export default WorkoutDetailScreen