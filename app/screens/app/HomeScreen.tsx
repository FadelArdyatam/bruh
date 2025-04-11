"use client"

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StatusBar,
  Dimensions,
  StyleSheet
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getUserProfile } from "../../redux/slices/profileSlice"
import { getWeightData } from "../../redux/slices/imtSlice"
import { getAllWorkouts } from "../../redux/slices/workoutSlice"
import { BarChart2, TrendingUp, Activity, Award, User, History, ChevronRight } from "lucide-react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { LinearGradient } from "expo-linear-gradient"
import { useTheme } from "../../context/ThemeContext"
import { LineChart } from "react-native-chart-kit"
import { HomeScreenSkeleton } from "~/app/components/SkeletonLoaders"

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { personalData, isLoading: profileLoading } = useSelector((state: RootState) => state.profile)
  const { weightHistory, isLoading: weightLoading } = useSelector((state: RootState) => state.imt)
  const { trainingHistory, isLoading: trainingLoading } = useSelector((state: RootState) => state.training)
  const { theme, darkMode } = useTheme()
  
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    dispatch(getUserProfile())
    dispatch(getWeightData())
    dispatch(getAllWorkouts())

    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Selamat Pagi")
    else if (hour < 18) setGreeting("Selamat Siang")
    else setGreeting("Selamat Malam")
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      // Refresh data saat screen mendapatkan fokus
      dispatch(getWeightData());
      dispatch(getUserProfile());
      
      return () => {
        // cleanup jika diperlukan
      };
    }, [])
  );
  
  // Helper function to get person data
  const getPersonelData = () => {
    if (!personalData) return null
    return personalData.personel || null
  }

  // Mendapatkan berat badan terbaru (berdasarkan tanggal)
  const getLatestWeight = () => {
    if (weightHistory.length === 0) return null;
    
    // Urutkan data berdasarkan tanggal (terbaru di urutan pertama)
    const sortedData = [...weightHistory].sort(
      (a, b) => new Date(b.tgl_berat_badan).getTime() - new Date(a.tgl_berat_badan).getTime()
    );
    
    // Ambil berat badan dari data terurut pertama (terbaru)
    return sortedData[0].berat_badan;
  }

  // Calculate IMT if weight and height data available
  const calculateIMT = () => {
    const personelData = getPersonelData()
    const tinggiBadan = personelData?.tinggi_badan
    const latestWeight = getLatestWeight();

    if (latestWeight && tinggiBadan) {
      const height = tinggiBadan / 100 // convert to meters
      const imt = latestWeight / (height * height)

      let status = ""
      if (imt < 18.5) status = "Kurus"
      else if (imt >= 18.5 && imt < 25) status = "Normal"
      else if (imt >= 25 && imt < 30) status = "Kelebihan Berat Badan"
      else status = "Obesitas"

      return { imt: imt.toFixed(1), status }
    }
    return null
  }

  const imtData = calculateIMT()
  const personelData = getPersonelData()
  const latestWeight = getLatestWeight();
    // Determine if the screen is still loading data
  const isLoading = profileLoading || weightLoading || trainingLoading;
  
    // If any data is still loading and we don't have cached data, show skeleton
  if (isLoading || (!personalData || weightHistory.length === 0)) {
      return <HomeScreenSkeleton />;
  }  
  

  // Prepare weight history data for chart
  const prepareChartData = () => {
    if (weightHistory.length === 0) return null

    const sortedData = [...weightHistory].sort(
      (a, b) => new Date(a.tgl_berat_badan).getTime() - new Date(b.tgl_berat_badan).getTime(),
    ).slice(-7) // Get last 7 entries

    const labels = sortedData.map((item) => {
      const date = new Date(item.tgl_berat_badan)
      return `${date.getDate()}/${date.getMonth() + 1}`
    })

    const data = sortedData.map((item) => item.berat_badan)

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => theme.primary,
          strokeWidth: 3,
        },
      ],
    }
  }

  // Menghitung lebar grafik berdasarkan jumlah data
  const calculateChartWidth = (dataPoints: number) => {
    // Minimal lebar per titik data (dapat disesuaikan)
    const minWidthPerPoint = 50;
    
    // Hitung lebar berdasarkan jumlah titik data, minimal sama dengan lebar layar
    return Math.max(screenWidth - 40, dataPoints * minWidthPerPoint);
  }

  const chartData = prepareChartData()

  // Recent activities
  const getRecentActivities = () => {
    const activities: { type: string; date: Date; value?: number; unit?: string; name?: any; duration?: any; calories?: any }[] = [];

    // Add recent weight entries
    if (weightHistory && weightHistory.length > 0) {
      const recentWeights = [...weightHistory]
        .sort((a, b) => new Date(b.tgl_berat_badan).getTime() - new Date(a.tgl_berat_badan).getTime())
        .slice(0, 2);

      recentWeights.forEach(weight => {
        activities.push({
          type: 'weight',
          date: new Date(weight.tgl_berat_badan),
          value: weight.berat_badan,
          unit: 'kg'
        });
      });
    }

    // Add recent training sessions
    if (trainingHistory && trainingHistory.length > 0) {
      const recentTrainings = [...trainingHistory].slice(0, 2);

      recentTrainings.forEach(training => {
        activities.push({
          type: 'training',
          date: new Date(training.date),
          name: training.workout_name,
          duration: training.duration,
          calories: training.calories_burned
        });
      });
    }

    // Sort by date
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3);
  };

  const recentActivities = getRecentActivities();

  // Function to format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Hari ini';
    } else if (diffDays === 1) {
      return 'Kemarin';
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  // Handle navigation with error catching
  const handleNavigation = (screenName: string) => {
    try {
      navigation.navigate(screenName);
    } catch (error) {
      console.error(`Error navigating to ${screenName}:`, error);
      Alert.alert(
        "Kesalahan Navigasi",
        `Tidak bisa menuju ke halaman ${screenName}.`
      );
    }
  };

  if (profileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    )
  }

  return (
    <>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      <SafeAreaView style={[
        styles.container,
        { backgroundColor: darkMode ? theme.background.dark : theme.background.light }
      ]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header with gradient */}
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.greetingText}>{greeting},</Text>
                  <Text style={styles.nameText}>
                    {user?.name || personalData?.nama_lengkap || personelData?.nama_lengkap || "Pengguna"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleNavigation("ProfileTab")}
                  style={styles.avatarButton}
                >
                  <User size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              {/* IMT Status Card */}
              <View style={[
                styles.imtStatusCard,
                { backgroundColor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.2)' }
              ]}>
                <Text style={styles.imtStatusTitle}>Status Kebugaran</Text>
                <View style={styles.imtStatusRow}>
                  <View>
                    <Text style={styles.imtValue}>
                      {imtData ? imtData.imt : "-"}
                    </Text>
                    <Text style={styles.imtStatus}>
                      IMT ({imtData ? imtData.status : "Belum ada data"})
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.updateButton, { backgroundColor: theme.accent }]}
                    onPress={() => handleNavigation("IMTTab")}
                  >
                    <Text style={styles.updateButtonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* Main content */}
          <View style={styles.mainContent}>
            {/* Stats Card */}
            <View style={[
              styles.card,
              { backgroundColor: darkMode ? theme.background.dark : theme.background.card }
            ]}>
              <Text style={[
                styles.cardTitle,
                { color: darkMode ? theme.text.onDark : theme.text.primary }
              ]}>
                Statistik
              </Text>

              <View style={styles.statsGrid}>
                {/* IMT Stat */}
                <View style={styles.statHalfColumn}>
                  <View style={[
                    styles.statCard,
                    { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }
                  ]}>
                    <View style={[
                      styles.statIconContainer,
                      { backgroundColor: `${theme.primary}20` }
                    ]}>
                      <BarChart2 size={20} color={theme.primary} />
                    </View>
                    <Text style={[
                      styles.statLabel,
                      { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                    ]}>
                      IMT
                    </Text>
                    <Text style={[
                      styles.statValue,
                      { color: darkMode ? theme.text.onDark : theme.text.primary }
                    ]}>
                      {imtData ? imtData.imt : "-"}
                    </Text>
                  </View>
                </View>

                {/* Weight Stat */}
                <View style={styles.statHalfColumn}>
                  <View style={[
                    styles.statCard,
                    { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }
                  ]}>
                    <View style={[
                      styles.statIconContainer,
                      { backgroundColor: `${theme.accent}20` }
                    ]}>
                      <TrendingUp size={20} color={theme.accent} />
                    </View>
                    <Text style={[
                      styles.statLabel,
                      { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                    ]}>
                      Berat
                    </Text>
                    <Text style={[
                      styles.statValue,
                      { color: darkMode ? theme.text.onDark : theme.text.primary }
                    ]}>
                      {latestWeight ? `${latestWeight} kg` : "-"}
                    </Text>
                  </View>
                </View>

                {/* Training Stat */}
                <View style={styles.statHalfColumn}>
                  <View style={[
                    styles.statCard,
                    { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }
                  ]}>
                    <View style={[
                      styles.statIconContainer,
                      { backgroundColor: `${theme.secondary}20` }
                    ]}>
                      <Activity size={20} color={theme.secondary} />
                    </View>
                    <Text style={[
                      styles.statLabel,
                      { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                    ]}>
                      Latihan
                    </Text>
                    <Text style={[
                      styles.statValue,
                      { color: darkMode ? theme.text.onDark : theme.text.primary }
                    ]}>
                      {trainingHistory.length}
                    </Text>
                  </View>
                </View>

                {/* Height Stat */}
                <View style={styles.statHalfColumn}>
                  <View style={[
                    styles.statCard,
                    { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }
                  ]}>
                    <View style={[
                      styles.statIconContainer,
                      { backgroundColor: `${theme.primary}20` }
                    ]}>
                      <Award size={20} color={theme.primary} />
                    </View>
                    <Text style={[
                      styles.statLabel,
                      { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                    ]}>
                      Tinggi
                    </Text>
                    <Text style={[
                      styles.statValue,
                      { color: darkMode ? theme.text.onDark : theme.text.primary }
                    ]}>
                      {personelData?.tinggi_badan ? `${personelData.tinggi_badan} cm` : "-"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Chart Card */}
            {chartData && (
              <View style={[
                styles.card,
                { backgroundColor: darkMode ? theme.background.dark : theme.background.card }
              ]}>
                <View style={styles.cardHeaderRow}>
                  <Text style={[
                    styles.cardTitle,
                    { color: darkMode ? theme.text.onDark : theme.text.primary }
                  ]}>
                    Tren Berat Badan
                  </Text>
                  <TouchableOpacity onPress={() => handleNavigation("IMTTab")}>
                    <Text style={{ color: theme.primary }}>Lihat Semua</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={true}
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                  <LineChart
                    data={chartData}
                    width={calculateChartWidth(chartData.labels.length)}
                    height={220}
                    chartConfig={{
                      backgroundColor: darkMode ? theme.background.dark : theme.background.card,
                      backgroundGradientFrom: darkMode ? theme.background.dark : theme.background.card,
                      backgroundGradientTo: darkMode ? theme.background.dark : theme.background.card,
                      decimalPlaces: 0,
                      color: (opacity = 1) => darkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => darkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: theme.primary,
                      },
                    }}
                    bezier
                    style={styles.chart}
                  />
                </ScrollView>
                {/* Petunjuk scroll horizontal */}
                {chartData.labels.length > 5 && (
                  <Text style={[
                    styles.chartScrollHint,
                    { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                  ]}>
                    Geser ke kanan atau kiri untuk melihat semua data
                  </Text>
                )}
              </View>
            )}

            {/* Recent Activities */}
            <View style={[
              styles.card,
              { backgroundColor: darkMode ? theme.background.dark : theme.background.card }
            ]}>
              <Text style={[
                styles.cardTitle,
                { color: darkMode ? theme.text.onDark : theme.text.primary }
              ]}>
                Aktivitas Terbaru
              </Text>

              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <View
                    key={index}
                    style={[
                      styles.activityItem,
                      {
                        borderBottomWidth: index < recentActivities.length - 1 ? 1 : 0,
                        borderBottomColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      }
                    ]}
                  >
                    <View style={[
                      styles.activityIconContainer,
                      { backgroundColor: `${theme.primary}20` }
                    ]}>
                      {activity.type === 'weight' ? (
                        <TrendingUp size={24} color={theme.primary} />
                      ) : (
                        <Activity size={24} color={theme.primary} />
                      )}
                    </View>

                    <View style={styles.activityInfo}>
                      <Text style={[
                        styles.activityTitle,
                        { color: darkMode ? theme.text.onDark : theme.text.primary }
                      ]}>
                        {activity.type === 'weight'
                          ? `Berat Badan: ${activity.value} ${activity.unit}`
                          : `Latihan: ${activity.name}`
                        }
                      </Text>
                      <Text style={[
                        styles.activityDate,
                        { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                      ]}>
                        {formatDate(activity.date)}
                      </Text>
                    </View>

                    {activity.type === 'training' && (
                      <View style={styles.activityStats}>
                        <Text style={[
                          styles.caloriesText,
                          { color: darkMode ? theme.text.onDark : theme.text.primary }
                        ]}>
                          {Math.round(activity.calories)} kal
                        </Text>
                        <Text style={[
                          styles.durationText,
                          { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                        ]}>
                          {activity.duration} min
                        </Text>
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <View style={styles.emptyActivities}>
                  <History size={40} color={darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} />
                  <Text style={[
                    styles.emptyText,
                    { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                  ]}>
                    Belum ada aktivitas terbaru
                  </Text>
                </View>
              )}
            </View>

            {/* Quick Access Menu */}
            <View style={[
              styles.card,
              { backgroundColor: darkMode ? theme.background.dark : theme.background.card }
            ]}>
              <Text style={[
                styles.cardTitle,
                { color: darkMode ? theme.text.onDark : theme.text.primary }
              ]}>
                Menu Cepat
              </Text>

              <TouchableOpacity
                style={[
                  styles.menuItem,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  }
                ]}
                onPress={() => handleNavigation("IMTTab")}
              >
                <View style={[
                  styles.menuIconContainer,
                  { backgroundColor: `${theme.primary}20` }
                ]}>
                  <BarChart2 size={24} color={theme.primary} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[
                    styles.menuTitle,
                    { color: darkMode ? theme.text.onDark : theme.text.primary }
                  ]}>
                    Indeks Massa Tubuh
                  </Text>
                  <Text style={[
                    styles.menuDescription,
                    { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                  ]}>
                    Pantau IMT dan berat badan Anda
                  </Text>
                </View>
                <ChevronRight size={20} color={darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.menuItem,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  }
                ]}
                onPress={() => handleNavigation("TrainingProgramTab")}
              >
                <View style={[
                  styles.menuIconContainer,
                  { backgroundColor: `${theme.secondary}20` }
                ]}>
                  <Activity size={24} color={theme.secondary} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[
                    styles.menuTitle,
                    { color: darkMode ? theme.text.onDark : theme.text.primary }
                  ]}>
                    Program Latihan
                  </Text>
                  <Text style={[
                    styles.menuDescription,
                    { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                  ]}>
                    Pilih dan lakukan latihan kebugaran
                  </Text>
                </View>
                <ChevronRight size={20} color={darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation("FoodRecall")}
              >
                <View style={[
                  styles.menuIconContainer,
                  { backgroundColor: `${theme.accent}20` }
                ]}>
                  <Image
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/2771/2771406.png" }}
                    style={styles.menuIcon}
                  />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[
                    styles.menuTitle,
                    { color: darkMode ? theme.text.onDark : theme.text.primary }
                  ]}>
                    Recall Makan
                  </Text>
                  <Text style={[
                    styles.menuDescription,
                    { color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }
                  ]}>
                    Catat asupan makanan harian Anda
                  </Text>
                </View>
                <ChevronRight size={20} color={darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    paddingTop: 40,
    paddingBottom: 70,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  headerContent: {
    paddingHorizontal: 20
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  greetingText: {
    color: '#FFFFFF',
    fontSize: 16
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold'
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF'
  },
  imtStatusCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20
  },
  imtStatusTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8
  },
  imtStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  imtValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold'
  },
  imtStatus: {
    color: 'rgba(255,255,255,0.8)'
  },
  updateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  mainContent: {
    marginTop: -50,
    paddingHorizontal: 20
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  statHalfColumn: {
    width: '50%',
    paddingRight: 8,
    paddingLeft: 8,
    marginBottom: 16
  },
  statCard: {
    borderRadius: 12,
    padding: 12
  },
  statIconContainer: {
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8
  },
  statLabel: {
    marginBottom: 4
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16
  },
  chartScrollHint: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12
  },
  activityIconContainer: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12
  },
  activityInfo: {
    flex: 1
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  activityDate: {
    fontSize: 14
  },
  activityStats: {
    alignItems: 'flex-end'
  },
  caloriesText: {
    fontWeight: 'bold'
  },
  durationText: {
    fontSize: 14
  },
  emptyActivities: {
    padding: 20,
    alignItems: 'center'
  },
  emptyText: {
    marginTop: 10,
    textAlign: 'center'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12
  },
  menuIconContainer: {
    padding: 12,
    borderRadius: 12,
    marginRight: 16
  },
  menuIcon: {
    width: 24,
    height: 24
  },
  menuTextContainer: {
    flex: 1
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2
  },
  menuDescription: {
    fontSize: 14
  }
});

export default HomeScreen