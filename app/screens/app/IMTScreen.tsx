"use client"

import { useState, useEffect } from "react"
import { View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Dimensions, StyleSheet, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getWeightData, saveWeightData } from "../../redux/slices/imtSlice"
import { getUserProfile } from "../../redux/slices/profileSlice"
import { Plus, Save, ArrowRight, Calendar, Info, Activity } from "lucide-react-native"
import { LineChart } from "react-native-chart-kit"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useTheme } from "../../context/ThemeContext"
import { IMTScreenSkeleton } from "~/app/components/SkeletonLoaders"
import Text from "~/app/components/Typography/Text"

const screenWidth = Dimensions.get("window").width;

const IMTScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useNavigation<StackNavigationProp<any>>()
  const { weightHistory, isLoading } = useSelector((state: RootState) => state.imt)
  const { personalData } = useSelector((state: RootState) => state.profile)
  const { theme, darkMode } = useTheme()

  const [beratBadan, setBeratBadan] = useState("")
  const [showIMTDetails, setShowIMTDetails] = useState(false)
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [mingguKe, setMingguKe] = useState("1")

  useEffect(() => {
    dispatch(getWeightData())
    dispatch(getUserProfile())
  }, [])

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date
    setShowDatePicker(false)
    setDate(currentDate)

    const formattedDate = currentDate.toISOString().split("T")[0]
    setSelectedDate(formattedDate)
  }

  if (isLoading) {
    return <IMTScreenSkeleton />
  }

  const getPersonelData = () => {
    if (!personalData) return null
    return personalData.personel || personalData
  }

  const calculateIMT = (weight: number, height: number) => {
    if (!weight || !height) return null

    const heightInMeters = height / 100
    const imt = weight / (heightInMeters * heightInMeters)

    let status = ""
    let color = theme.primary
    if (imt < 18.5) {
      status = "Kurus"
      color = "#3B82F6"
    } else if (imt >= 18.5 && imt < 25) {
      status = "Normal"
      color = "#10B981"
    } else if (imt >= 25 && imt < 30) {
      status = "Kelebihan Berat Badan"
      color = "#F59E0B"
    } else {
      status = "Obesitas"
      color = "#EF4444"
    }

    return { imt: imt.toFixed(1), status, color }
  }

  const getCurrentIMT = () => {
    const personelData = getPersonelData()
    const tinggiBadan = personelData?.tinggi_badan
    
    if (weightHistory.length > 0 && tinggiBadan) {
      const latestWeight = weightHistory[weightHistory.length - 1].berat_badan
      return calculateIMT(latestWeight, tinggiBadan)
    }
    return null
  }

  const handleSaveWeight = async () => {
    if (!beratBadan) {
      Alert.alert("Error", "Berat badan harus diisi")
      return
    }

    if (!selectedDate) {
      Alert.alert("Error", "Tanggal harus dipilih")
      return
    }

    if (!mingguKe) {
      Alert.alert("Error", "Minggu ke harus diisi")
      return
    }

    const weight = Number.parseFloat(beratBadan)
    const week = Number.parseInt(mingguKe)

    if (isNaN(weight) || weight <= 0) {
      Alert.alert("Error", "Berat badan tidak valid")
      return
    }

    try {
      await dispatch(
        saveWeightData({
          berat_badan: weight,
          minggu_ke: week,
          tgl_berat_badan: selectedDate,
        }),
      ).unwrap()

      Alert.alert("Sukses", "Data berat badan berhasil disimpan")
      setBeratBadan("")
      setSelectedDate("")
      setMingguKe("1")
      
      dispatch(getWeightData())
    } catch (err) {
      console.error("Failed to save weight data:", err)
    }
  }

  const prepareChartData = () => {
    if (weightHistory.length === 0) return null

    const sortedData = [...weightHistory].sort(
      (a, b) => new Date(a.tgl_berat_badan).getTime() - new Date(b.tgl_berat_badan).getTime(),
    )

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
  
  const calculateChartWidth = (dataPoints: number) => {
    const minWidthPerPoint = 50
    return Math.max(screenWidth - 40, dataPoints * minWidthPerPoint)
  }

  const currentIMT = getCurrentIMT()
  const chartData = prepareChartData()

  return (
    <>
      <SafeAreaView style={[
        styles.container,
        { backgroundColor: darkMode ? theme.background.dark : theme.background.light }
      ]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text variant="bold" size={24} style={[
              styles.headerTitle,
              { color: darkMode ? theme.text.onDark : theme.text.primary }
            ]}>
              Indeks Massa Tubuh (IMT)
            </Text>
            
            {/* IMT Status Card */}
            <View style={[
              styles.imtStatusCard,
              { backgroundColor: theme.primary }
            ]}>
              <Text style={[styles.imtStatusTitle, { color: theme.coklat || "#6c3c0c" }]}>
                Status IMT Anda
              </Text>
              <View style={styles.imtStatusRow}>
                <View>
                  <Text style={styles.imtValue}>
                    {currentIMT ? currentIMT.imt : "--"}
                  </Text>
                  <Text variant="medium" style={styles.imtStatus}>
                    {currentIMT ? currentIMT.status : "Belum ada data"}
                  </Text>
                </View>
                <View style={[
                  styles.imtStatusBadge,
                  { backgroundColor: darkMode ? theme.background.dark : theme.background.light }
                ]}>
                  <Text style={{ color: currentIMT?.color || theme.primary }}>
                    {currentIMT?.status || "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* IMT Gauge Card */}
            <View style={[
              styles.card,
              { backgroundColor: darkMode ? theme.background.dark : theme.background.card }
            ]}>
              <Text variant="medium" size={18} style={[
                { color: darkMode ? theme.text.onDark : theme.text.primary }
              ]}>
                Kategori IMT
              </Text>

              <View style={[
                styles.gaugeContainer,
                { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }
              ]}>
                <View style={[
                  styles.gaugeCircle,
                  { 
                    borderColor: currentIMT ? currentIMT.color : theme.primary,
                    backgroundColor: currentIMT ? `${currentIMT.color}20` : `${theme.primary}20`
                  }
                ]}>
                  <Text size={32} style={{ color: currentIMT ? currentIMT.color : theme.primary }}>
                    {currentIMT ? currentIMT.imt : "--"}
                  </Text>
                  <Text style={{ color: currentIMT ? currentIMT.color : theme.primary }}>
                    {currentIMT ? currentIMT.status : "Belum ada data"}
                  </Text>
                </View>

                {/* IMT Categories */}
                <View style={styles.imtCategories}>
                  <View style={styles.categoryItem}>
                    <View style={[styles.categoryIndicator, { backgroundColor: "#3B82F6" }]} />
                    <Text style={styles.categoryLabel}>Kurus</Text>
                    <Text style={styles.categoryValue}>&lt; 18.5</Text>
                  </View>
                  <View style={styles.categoryItem}>
                    <View style={[styles.categoryIndicator, { backgroundColor: "#10B981" }]} />
                    <Text style={styles.categoryLabel}>Normal</Text>
                    <Text style={styles.categoryValue}>18.5 - 24.9</Text>
                  </View>
                  <View style={styles.categoryItem}>
                    <View style={[styles.categoryIndicator, { backgroundColor: "#F59E0B" }]} />
                    <Text style={styles.categoryLabel}>Berlebih</Text>
                    <Text style={styles.categoryValue}>25.0 - 29.9</Text>
                  </View>
                  <View style={styles.categoryItem}>
                    <View style={[styles.categoryIndicator, { backgroundColor: "#EF4444" }]} />
                    <Text style={styles.categoryLabel}>Obesitas</Text>
                    <Text style={styles.categoryValue}>≥ 30.0</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.infoButton,
                    { backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                  ]}
                  onPress={() => setShowIMTDetails(!showIMTDetails)}
                >
                  <Text style={{ color: theme.primary }}>
                    {showIMTDetails ? "Sembunyikan Info" : "Apa itu IMT?"}
                  </Text>
                  <Info size={18} color={theme.primary} />
                </TouchableOpacity>
              </View>

              {showIMTDetails && (
                <View style={[
                  styles.infoContainer,
                  { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }
                ]}>
                  <Text variant="bold" style={[
                    styles.infoTitle,
                    { color: darkMode ? theme.text.onDark : theme.text.primary }
                  ]}>
                    Tentang Indeks Massa Tubuh (IMT)
                  </Text>
                  <Text style={[
                    styles.infoText,
                    { color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
                  ]}>
                    IMT adalah cara mengukur massa tubuh berdasarkan berat dan tinggi badan untuk mengetahui apakah berat badan Anda ideal.
                  </Text>
                  <Text style={[
                    styles.infoText,
                    { color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
                  ]}>
                    IMT dihitung dengan rumus: Berat Badan (kg) ÷ [Tinggi Badan (m)]²
                  </Text>
                </View>
              )}
            </View>

            {/* Weight Chart Card */}
            {chartData && (
              <View style={[
                styles.card,
                { backgroundColor: darkMode ? theme.background.dark : theme.background.card }
              ]}>
                <View style={styles.cardHeaderRow}>
                  <Text variant="medium" size={18} style={[
                    { color: darkMode ? theme.text.onDark : theme.text.primary }
                  ]}>
                    Grafik Berat Badan
                  </Text>
                  <TouchableOpacity onPress={() => dispatch(getWeightData())}>
                    <Text style={{ color: theme.primary }}>Refresh</Text>
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
                      color: (opacity = 1) => theme.primary,
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

            {/* Input Weight Card */}
            <View style={[
              styles.card,
              { backgroundColor: darkMode ? theme.background.dark : theme.background.card }
            ]}>
              <Text variant="medium" size={18} style={[
                { color: darkMode ? theme.text.onDark : theme.text.primary }
              ]}>
                Input Berat Badan
              </Text>

              <View style={styles.inputContainer}>
                <View style={styles.inputGroup}>
                  <Text style={[
                    styles.inputLabel,
                    { color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
                  ]}>
                    Berat Badan (kg)
                  </Text>
                  <TextInput
                    style={[
                      styles.inputField,
                      { 
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        color: darkMode ? theme.text.onDark : theme.text.primary
                      }
                    ]}
                    value={beratBadan}
                    onChangeText={setBeratBadan}
                    placeholder="Masukkan berat badan"
                    placeholderTextColor={darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[
                    styles.inputLabel,
                    { color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
                  ]}>
                    Tanggal
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.inputField,
                      { 
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }
                    ]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={[
                      { color: selectedDate ? (darkMode ? theme.text.onDark : theme.text.primary) : (darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)') }
                    ]}>
                      {selectedDate || "Pilih tanggal"}
                    </Text>
                    <Calendar size={20} color={theme.primary} />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker 
                      value={date} 
                      mode="date" 
                      display="default" 
                      onChange={handleDateChange} 
                    />
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[
                    styles.inputLabel,
                    { color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
                  ]}>
                    Minggu Ke
                  </Text>
                  <TextInput
                    style={[
                      styles.inputField,
                      { 
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        color: darkMode ? theme.text.onDark : theme.text.primary
                      }
                    ]}
                    value={mingguKe}
                    onChangeText={setMingguKe}
                    placeholder="Masukkan minggu ke"
                    placeholderTextColor={darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: theme.primary }
                ]}
                onPress={handleSaveWeight}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Save size={20} color="white" style={styles.saveIcon} />
                    <Text style={styles.saveButtonText}>SIMPAN</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Quick Menu Card */}
            <View style={[
              styles.card,
              { backgroundColor: darkMode ? theme.background.dark : theme.background.card }
            ]}>
              <Text variant="medium" size={18} style={[
                { color: darkMode ? theme.text.onDark : theme.text.primary }
              ]}>
                Menu Cepat
              </Text>

              <TouchableOpacity
                style={[
                  styles.menuItem,
                  { 
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    borderBottomWidth: 1,
                    borderBottomColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                  }
                ]}
                onPress={() => navigation.navigate("FoodRecall")}
              >
                <View style={[
                  styles.menuIcon,
                  { backgroundColor: `${theme.primary}20` }
                ]}>
                  <Plus size={24} color={theme.primary} />
                </View>
                <View style={styles.menuText}>
                  <Text variant="bold" style={{ color: darkMode ? theme.text.onDark : theme.text.primary }}>
                    Recall Makan
                  </Text>
                  <Text style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                    Catat asupan makanan hari Rabu dan Minggu
                  </Text>
                </View>
                <ArrowRight size={20} color={darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.menuItem,
                  { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }
                ]}
                onPress={() => navigation.navigate("ActivityStatus")}
              >
                <View style={[
                  styles.menuIcon,
                  { backgroundColor: `${theme.secondary}20` }
                ]}>
                  <Activity size={24} color={theme.secondary} />
                </View>
                <View style={styles.menuText}>
                  <Text variant="bold" style={{ color: darkMode ? theme.text.onDark : theme.text.primary }}>
                    Status Aktivitas
                  </Text>
                  <Text style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                    Pantau detak jantung dan aktivitas Anda
                  </Text>
                </View>
                <ArrowRight size={20} color={darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'} />
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10
  },
  headerTitle: {
    marginBottom: 20
  },
  imtStatusCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imtStatusTitle: {
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
  imtStatusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  mainContent: {
    paddingHorizontal: 20
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,

  },
  gaugeContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 16
  },
  gaugeCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    marginBottom: 20
  },
  imtCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1
  },
  categoryIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginBottom: 4
  },
  categoryLabel: {
    fontSize: 12,
    marginBottom: 2
  },
  categoryValue: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center'
  },
  infoContainer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 12
  },
  infoTitle: {
    marginBottom: 8
  },
  infoText: {
    marginBottom: 8,
    fontSize: 14
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16
  },
  chartScrollHint: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8
  },
  inputContainer: {
    marginTop: 16
  },
  inputGroup: {
    marginBottom: 16
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14
  },
  inputField: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  saveIcon: {
    marginRight: 8
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 12
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  menuText: {
    flex: 1
  }
})

export default IMTScreen