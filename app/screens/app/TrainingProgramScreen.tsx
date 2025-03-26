"use client"

import { useState, useEffect } from "react"
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getAllWorkouts, getWorkoutDetail, saveTrainingSession } from "../../redux/slices/trainingSlice"
import { 
  Save, 
  Clock, 
  Calendar, 
  BarChart2, 
  ArrowRight,
  Search,
  ChevronRight,
  Zap,
  Heart,
  Activity,
  TrendingUp,
} from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import YoutubePlayer from "react-native-youtube-iframe"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "../../context/ThemeContext"
import { getWorkoutIcon, getActivityIcon, getWorkoutIconBackground, isHighIntensityWorkout } from "../../../assets/Icon/WorkoutIcon"
import { TrainingProgramScreenSkeleton } from "~/app/components/SkeletonLoaders"

const screenWidth = Dimensions.get("window").width;

const TrainingProgramScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { workoutList, selectedWorkout, trainingHistory, isLoading } = useSelector((state: RootState) => state.training)
  const { theme, darkMode } = useTheme()

  const [duration, setDuration] = useState("")
  const [heartRate, setHeartRate] = useState("")
  const [distance, setDistance] = useState("")
  const [playing, setPlaying] = useState(false)
  const [selectedTab, setSelectedTab] = useState("high")
  const [searchQuery, setSearchQuery] = useState("")

  if(isLoading){
    <TrainingProgramScreenSkeleton/>
  }

  useEffect(() => {
    dispatch(getAllWorkouts())
  }, [])

  const handleSelectWorkout = (id: number) => {
    dispatch(getWorkoutDetail(id))
  }

  const handleSaveTraining = async () => {
    if (!selectedWorkout) {
      Alert.alert("Error", "Pilih jenis latihan terlebih dahulu")
      return
    }

    if (!duration) {
      Alert.alert("Error", "Masukkan durasi latihan")
      return
    }

    if (!heartRate) {
      Alert.alert("Error", "Masukkan denyut jantung maksimal")
      return
    }

    try {
      const durationInSeconds = Number.parseInt(duration) * 60 // Convert minutes to seconds
      const caloriesBurned = durationInSeconds * Number.parseFloat(selectedWorkout.kalori_ratarata_perdetik)

      await dispatch(
        saveTrainingSession({
          workout_id: selectedWorkout.id,
          workout_name: selectedWorkout.nama_latihan,
          duration: Number.parseInt(duration),
          heart_rate: Number.parseInt(heartRate),
          distance: distance ? Number.parseFloat(distance) : 0,
          calories_burned: caloriesBurned,
        }),
      ).unwrap()

      Alert.alert("Sukses", `Latihan ${selectedWorkout.nama_latihan} berhasil disimpan`)
      setDuration("")
      setHeartRate("")
      setDistance("")
    } catch (err) {
      console.error("Failed to save training session:", err)
    }
  }

  const getYoutubeVideoId = (url: string) => {
    if (!url) return null

    // Extract video ID from YouTube URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)

    return match && match[2].length === 11 ? match[2] : null
  }

  // Kita sudah menggantinya dengan getHighIntensityWorkouts dan getLowIntensityWorkouts

  const getHighIntensityWorkouts = () => {
    return workoutList
      .filter(workout => isHighIntensityWorkout(workout.kalori_ratarata_perdetik))
      .filter(workout => 
        searchQuery ? workout.nama_latihan.toLowerCase().includes(searchQuery.toLowerCase()) : true
      )
      .slice(0, 6); // Tampilkan 6 latihan teratas
  };
  
  const getLowIntensityWorkouts = () => {
    return workoutList
      .filter(workout => !isHighIntensityWorkout(workout.kalori_ratarata_perdetik))
      .filter(workout => 
        searchQuery ? workout.nama_latihan.toLowerCase().includes(searchQuery.toLowerCase()) : true
      )
      .slice(0, 6); // Tampilkan 6 latihan teratas
  };

  const getRecentTraining = () => {
    return trainingHistory.slice(0, 3); // Ambil 3 latihan terbaru
  };

  const calculateCaloriesBurned = () => {
    if (!duration || !selectedWorkout) return 0;
    
    const durationInSeconds = Number.parseInt(duration) * 60;
    return Number(durationInSeconds * Number.parseFloat(selectedWorkout.kalori_ratarata_perdetik)).toFixed(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header dengan gradient */}
      <View style={styles.headerContainer}>
        <LinearGradient 
          colors={["#FFB800", "#FF8A00"]} 
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>PROGRAM LATIHAN</Text>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={20} color="rgba(255,255,255,0.8)" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari latihan..."
              placeholderTextColor="rgba(255,255,255,0.6)"
            />
          </View>
          
          {/* Tab Selector */}
          <View style={styles.tabSelector}>
            <TouchableOpacity 
              style={[
                styles.tabButton,
                selectedTab === 'high' ? styles.activeTabButton : null
              ]}
              onPress={() => setSelectedTab('high')}
            >
              <Zap size={18} color={selectedTab === 'high' ? "#FFB800" : "#FFFFFF"} />
              <Text style={[
                styles.tabButtonText,
                selectedTab === 'high' ? styles.activeTabText : null
              ]}>
                Aktivitas Tinggi
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tabButton,
                selectedTab === 'low' ? styles.activeTabButton : null
              ]}
              onPress={() => setSelectedTab('low')}
            >
              <Heart size={18} color={selectedTab === 'low' ? "#FFB800" : "#FFFFFF"} />
              <Text style={[
                styles.tabButtonText,
                selectedTab === 'low' ? styles.activeTabText : null
              ]}>
                Aktivitas Rendah
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Workout Cards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilih Latihan</Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color="#FFB800" style={styles.loader} />
          ) : (
            <View>
              {/* Tab untuk Aktivitas Tinggi */}
              {selectedTab === 'high' && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  style={styles.cardsScrollView}
                  contentContainerStyle={styles.cardsContainer}
                >
                  {getHighIntensityWorkouts().map((workout) => (
                    <TouchableOpacity
                      key={workout.id}
                      style={[
                        styles.workoutCard,
                        selectedWorkout?.id === workout.id ? styles.selectedWorkoutCard : null
                      ]}
                      onPress={() => handleSelectWorkout(workout.id)}
                    >
                      <View style={[
                        styles.workoutIconContainer,
                        { backgroundColor: getWorkoutIconBackground(true) }
                      ]}>
                        {getWorkoutIcon(workout, selectedWorkout?.id === workout.id, true)}
                      </View>
                      
                      <Text style={[
                        styles.workoutTitle,
                        selectedWorkout?.id === workout.id ? styles.selectedWorkoutTitle : null
                      ]}>
                        {workout.nama_latihan}
                      </Text>
                      
                      <View style={styles.workoutStats}>
                        <View style={styles.workoutStat}>
                          <Clock 
                            size={14} 
                            color={selectedWorkout?.id === workout.id ? "#FFFFFF" : "#9CA3AF"} 
                          />
                          <Text style={[
                            styles.workoutStatText,
                            selectedWorkout?.id === workout.id ? styles.selectedWorkoutStatText : null
                          ]}>
                            {Math.round(workout.ratarata_waktu_perdetik / 60)} min
                          </Text>
                        </View>
                        
                        <View style={styles.workoutStat}>
                          <BarChart2 
                            size={14} 
                            color={selectedWorkout?.id === workout.id ? "#FFFFFF" : "#9CA3AF"} 
                          />
                          <Text style={[
                            styles.workoutStatText,
                            selectedWorkout?.id === workout.id ? styles.selectedWorkoutStatText : null
                          ]}>
                            {Math.round(Number.parseFloat(workout.kalori_ratarata_perdetik) * 60)} kal/min
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                  
                  {getHighIntensityWorkouts().length === 0 && (
                    <View style={styles.emptyTabState}>
                      <Text style={styles.emptyTabStateText}>
                        Tidak ada latihan intensitas tinggi yang sesuai dengan pencarian
                      </Text>
                    </View>
                  )}
                </ScrollView>
              )}
              
              {/* Tab untuk Aktivitas Rendah */}
              {selectedTab === 'low' && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  style={styles.cardsScrollView}
                  contentContainerStyle={styles.cardsContainer}
                >
                  {getLowIntensityWorkouts().map((workout) => (
                    <TouchableOpacity
                      key={workout.id}
                      style={[
                        styles.workoutCard,
                        selectedWorkout?.id === workout.id ? styles.selectedWorkoutCard : null
                      ]}
                      onPress={() => handleSelectWorkout(workout.id)}
                    >
                      <View style={[
                        styles.workoutIconContainer,
                        { backgroundColor: getWorkoutIconBackground(false) }
                      ]}>
                        {getWorkoutIcon(workout, selectedWorkout?.id === workout.id, false)}
                      </View>
                      
                      <Text style={[
                        styles.workoutTitle,
                        selectedWorkout?.id === workout.id ? styles.selectedWorkoutTitle : null
                      ]}>
                        {workout.nama_latihan}
                      </Text>
                      
                      <View style={styles.workoutStats}>
                        <View style={styles.workoutStat}>
                          <Clock 
                            size={14} 
                            color={selectedWorkout?.id === workout.id ? "#FFFFFF" : "#9CA3AF"} 
                          />
                          <Text style={[
                            styles.workoutStatText,
                            selectedWorkout?.id === workout.id ? styles.selectedWorkoutStatText : null
                          ]}>
                            {Math.round(workout.ratarata_waktu_perdetik / 60)} min
                          </Text>
                        </View>
                        
                        <View style={styles.workoutStat}>
                          <BarChart2 
                            size={14} 
                            color={selectedWorkout?.id === workout.id ? "#FFFFFF" : "#9CA3AF"} 
                          />
                          <Text style={[
                            styles.workoutStatText,
                            selectedWorkout?.id === workout.id ? styles.selectedWorkoutStatText : null
                          ]}>
                            {Math.round(Number.parseFloat(workout.kalori_ratarata_perdetik) * 60)} kal/min
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                  
                  {getLowIntensityWorkouts().length === 0 && (
                    <View style={styles.emptyTabState}>
                      <Text style={styles.emptyTabStateText}>
                        Tidak ada latihan intensitas rendah yang sesuai dengan pencarian
                      </Text>
                    </View>
                  )}
                </ScrollView>
              )}
            </View>
          )}
        </View>

        {/* Selected Workout Details */}
        {selectedWorkout ? (
          <View style={styles.workoutDetailCard}>
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutDetailTitle}>{selectedWorkout.nama_latihan}</Text>
              
              <View style={styles.workoutDetailStats}>
                <View style={styles.detailStat}>
                  <Clock size={16} color="#FFB800" />
                  <Text style={styles.detailStatText}>
                    {Math.round(selectedWorkout.ratarata_waktu_perdetik / 60)} menit
                  </Text>
                </View>
                
                <View style={styles.detailStat}>
                  <Zap size={16} color="#FFB800" />
                  <Text style={styles.detailStatText}>
                    {Math.round(Number.parseFloat(selectedWorkout.kalori_ratarata_perdetik) * 60)} kal/menit
                  </Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.workoutDescription}>{selectedWorkout.deskripsi_ketentuan_latihan}</Text>
            
            {/* YouTube Video Player */}
            {selectedWorkout.video_ketentuan_latihan && (
              <View style={styles.videoContainer}>
                <Text style={styles.videoTitle}>Video Tutorial</Text>
                <YoutubePlayer
                  height={200}
                  play={playing}
                  videoId={getYoutubeVideoId(selectedWorkout.video_ketentuan_latihan)}
                  onChangeState={(state) => {
                    if (state === "playing") setPlaying(true)
                    else if (state === "paused") setPlaying(false)
                  }}
                />
              </View>
            )}
            
            {/* Input Fields */}
            <View style={styles.inputsContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Durasi Latihan (menit)</Text>
                <TextInput
                  style={styles.input}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="Masukkan durasi latihan"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Denyut Jantung Maksimal (per menit)</Text>
                <TextInput
                  style={styles.input}
                  value={heartRate}
                  onChangeText={setHeartRate}
                  placeholder="Masukkan denyut jantung"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Jarak Tempuh (km)</Text>
                <TextInput
                  style={styles.input}
                  value={distance}
                  onChangeText={setDistance}
                  placeholder="Masukkan jarak tempuh"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            
            {/* Calories Estimation */}
            {duration && selectedWorkout.kalori_ratarata_perdetik && (
              <View style={styles.caloriesCard}>
                <Text style={styles.caloriesTitle}>Estimasi Kalori Terbakar:</Text>
                <Text style={styles.caloriesValue}>
                  {calculateCaloriesBurned()} kal
                </Text>
              </View>
            )}
            
            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveTraining}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Save size={20} color="white" style={styles.saveButtonIcon} />
                  <Text style={styles.saveButtonText}>SIMPAN LATIHAN</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyStateCard}>
            <Image 
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/2936/2936886.png" }}
              style={styles.emptyStateImage}
            />
            <Text style={styles.emptyStateTitle}>Pilih Jenis Latihan</Text>
            <Text style={styles.emptyStateDescription}>
              Pilih salah satu jenis latihan di atas untuk melihat detail dan melacak aktivitas Anda
            </Text>
          </View>
        )}
        
        {/* Recent Activities Section */}
        <View style={styles.recentActivitiesCard}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          
          {trainingHistory.length > 0 ? (
            getRecentTraining().map((training, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIconContainer}>
                  <Activity size={24} color="#FFB800" />
                </View>
                
                <View style={styles.activityDetails}>
                  <Text style={styles.activityTitle}>{training.workout_name}</Text>
                  <Text style={styles.activityDate}>
                    {new Date(training.date).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </Text>
                </View>
                
                <View style={styles.activityStats}>
                  <Text style={styles.activityCalories}>{Math.round(training.calories_burned)} kal</Text>
                  <Text style={styles.activityDuration}>{training.duration} min</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyActivities}>
              <Calendar size={40} color="#E5E7EB" />
              <Text style={styles.emptyActivitiesText}>Belum ada aktivitas latihan</Text>
            </View>
          )}
        </View>
        
        {/* Quick Links Section */}
        <View style={styles.quickLinksCard}>
          <Text style={styles.sectionTitle}>Menu Cepat</Text>
          
          <TouchableOpacity 
            style={styles.quickLinkItem}
            onPress={() => navigation.navigate("FoodRecall")}
          >
            <View style={[styles.quickLinkIcon, { backgroundColor: "#FEF3C7" }]}>
              <TrendingUp size={24} color="#F59E0B" />
            </View>
            
            <View style={styles.quickLinkContent}>
              <Text style={styles.quickLinkTitle}>Recall Makan</Text>
              <Text style={styles.quickLinkDescription}>Catat asupan makanan harian Anda</Text>
            </View>
            
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickLinkItem}
            onPress={() => navigation.navigate("IMTTab")}
          >
            <View style={[styles.quickLinkIcon, { backgroundColor: "#DBEAFE" }]}>
              <BarChart2 size={24} color="#3B82F6" />
            </View>
            
            <View style={styles.quickLinkContent}>
              <Text style={styles.quickLinkTitle}>Indeks Massa Tubuh</Text>
              <Text style={styles.quickLinkDescription}>Pantau IMT dan berat badan Anda</Text>
            </View>
            
            <ChevronRight size={20} color="#9CA3AF" />
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
  headerContainer: {
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    marginLeft: 8,
    paddingVertical: 4,
  },
  tabSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: "#FFFFFF",
  },
  tabButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 4,
  },
  activeTabText: {
    color: "#FFB800",
  },
  scrollContent: {
    marginTop: -60,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllLink: {
    color: "#FFB800",
    fontWeight: "500",
  },
  cardsScrollView: {
    marginHorizontal: -4,
  },
  cardsContainer: {
    paddingLeft: 4,
    paddingRight: 4,
  },
  workoutCard: {
    width: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: "#000",
    marginBottom: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedWorkoutCard: {
    backgroundColor: "#FFB800",
  },
  workoutIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    borderRadius: 16,
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  selectedWorkoutTitle: {
    color: "#FFFFFF",
  },
  workoutStats: {
    gap: 4,
  },
  workoutStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  workoutStatText: {
    fontSize: 12,
    color: "#6B7280",
  },
  selectedWorkoutStatText: {
    color: "#FFFFFF",
  },
  workoutDetailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  workoutHeader: {
    marginBottom: 16,
  },
  workoutDetailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  workoutDetailStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailStatText: {
    color: "#6B7280",
  },
  workoutDescription: {
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 16,
  },
  videoContainer: {
    marginBottom: 20,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  inputsContainer: {
    gap: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: "center",
  },
  caloriesCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  caloriesTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#92400E",
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFB800",
  },
  saveButton: {
    backgroundColor: "#FFB800",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    shadowColor: "#FFB800",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyStateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyStateDescription: {
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  recentActivitiesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  activityIconContainer: {
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  activityDetails: {
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
  activityCalories: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8A00",
    marginBottom: 2,
  },
  activityDuration: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyActivities: {
    alignItems: "center",
    padding: 24,
  },
  emptyActivitiesText: {
    marginTop: 8,
    color: "#9CA3AF",
  },
  emptyTabState: {
    width: 200,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTabStateText: {
    textAlign: "center",
    color: "#9CA3AF",
  },
  quickLinksCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickLinkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  quickLinkIcon: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  quickLinkContent: {
    flex: 1,
  },
  quickLinkTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  quickLinkDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  loader: {
    marginVertical: 20,
  },
});

export default TrainingProgramScreen