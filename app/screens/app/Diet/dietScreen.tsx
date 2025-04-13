"use client"

import React, { useEffect, useState } from "react"
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  TextInput,
  StyleSheet 
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../../redux/store"
import { getDietPlans, createDietPlan, completeDietPlan, cancelDietPlan } from "../../../redux/slices/dietSlice"
import { 
  Calendar, 
  Target, 
  TrendingDown, 
  Clock, 
  Plus,
  Award,
  Check,
  X,
  ChevronRight,
  Flame,
  Scale 
} from "lucide-react-native"
import { LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { LinearGradient } from "expo-linear-gradient"

const screenWidth = Dimensions.get("window").width

const DietScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { 
    activeDietPlan, 
    completedDietPlans, 
    weightHistory,
    recommendedCalories,
    currentWeight,
    idealWeight,
    isLoading, 
    error 
  } = useSelector((state: RootState) => state.diet)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [targetKalori, setTargetKalori] = useState("")
  const [targetBerat, setTargetBerat] = useState("")
  const [tanggalMulai, setTanggalMulai] = useState(new Date())
  const [tanggalSelesai, setTanggalSelesai] = useState(new Date(new Date().setDate(new Date().getDate() + 30)))
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)

  useEffect(() => {
    dispatch(getDietPlans())
  }, [])

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || tanggalMulai
    setShowStartDatePicker(false)
    setTanggalMulai(currentDate)
  }

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || tanggalSelesai
    setShowEndDatePicker(false)
    setTanggalSelesai(currentDate)
  }

  const handleCreateDietPlan = async () => {
    if (!targetKalori || !targetBerat) {
      Alert.alert("Error", "Semua kolom harus diisi")
      return
    }

    const tKalori = Number.parseInt(targetKalori)
    const tBerat = Number.parseFloat(targetBerat)

    if (isNaN(tKalori) || tKalori <= 0) {
      Alert.alert("Error", "Target kalori tidak valid")
      return
    }

    if (isNaN(tBerat) || tBerat <= 0) {
      Alert.alert("Error", "Target berat tidak valid")
      return
    }

    try {
      const startDateStr = tanggalMulai.toISOString().split('T')[0]
      const endDateStr = tanggalSelesai.toISOString().split('T')[0]

      await dispatch(createDietPlan({
        target_kalori: tKalori,
        target_berat: tBerat,
        tanggal_mulai: startDateStr,
        tanggal_selesai: endDateStr
      })).unwrap()

      Alert.alert("Sukses", "Rencana diet berhasil dibuat")
      setShowCreateForm(false)
      setTargetKalori("")
      setTargetBerat("")
    } catch (err: any) {
      Alert.alert("Error", err)
    }
  }

  const handleCompleteDietPlan = (id: number) => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menyelesaikan rencana diet ini?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Ya", 
          onPress: async () => {
            try {
              await dispatch(completeDietPlan(id)).unwrap()
              Alert.alert("Sukses", "Rencana diet berhasil diselesaikan")
              dispatch(getDietPlans())
            } catch (err: any) {
              Alert.alert("Error", err)
            }
          }
        }
      ]
    )
  }

  const handleCancelDietPlan = (id: number) => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin membatalkan rencana diet ini?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Ya", 
          onPress: async () => {
            try {
              await dispatch(cancelDietPlan(id)).unwrap()
              Alert.alert("Sukses", "Rencana diet berhasil dibatalkan")
              dispatch(getDietPlans())
            } catch (err: any) {
              Alert.alert("Error", err)
            }
          }
        }
      ]
    )
  }

  const prepareWeightChartData = () => {
    if (!weightHistory || weightHistory.length === 0) return null

    const labels = weightHistory.map(item => {
      const date = new Date(item.date)
      return `${date.getDate()}/${date.getMonth() + 1}`
    })

    const data = weightHistory.map(item => item.weight)

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(255, 184, 0, ${opacity})`,
          strokeWidth: 3
        }
      ],
    }
  }

  const chartData = prepareWeightChartData()

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }

  if (isLoading && !activeDietPlan && !completedDietPlans) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFB800" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <LinearGradient colors={["#FFB800", "#FF8A00"]} style={styles.headerGradient}>
          <Text style={styles.headerTitle}>RENCANA DIET</Text>
          
          {!activeDietPlan && !showCreateForm && (
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => setShowCreateForm(true)}
            >
              <Plus size={20} color="#FFF" />
              <Text style={styles.createButtonText}>Buat Rencana Diet</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>

      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Content akan ditambahkan di sini */}
        {error && (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
)}

{showCreateForm && (
  <View style={styles.formCard}>
    <Text style={styles.formTitle}>Buat Rencana Diet Baru</Text>
    
    <View style={styles.formGroup}>
      <Text style={styles.label}>Target Kalori (per hari)</Text>
      <TextInput
        style={styles.input}
        value={targetKalori}
        onChangeText={setTargetKalori}
        placeholder="Masukkan target kalori"
        keyboardType="numeric"
      />
    </View>
    
    <View style={styles.formGroup}>
      <Text style={styles.label}>Target Berat Badan (kg)</Text>
      <TextInput
        style={styles.input}
        value={targetBerat}
        onChangeText={setTargetBerat}
        placeholder="Masukkan target berat"
        keyboardType="numeric"
      />
    </View>
    
    <View style={styles.formGroup}>
      <Text style={styles.label}>Tanggal Mulai</Text>
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowStartDatePicker(true)}
      >
        <Calendar size={20} color="#6B7280" />
        <Text style={styles.dateText}>
          {tanggalMulai.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={tanggalMulai}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
    
    <View style={styles.formGroup}>
      <Text style={styles.label}>Tanggal Selesai</Text>
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowEndDatePicker(true)}
      >
        <Calendar size={20} color="#6B7280" />
        <Text style={styles.dateText}>
          {tanggalSelesai.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={tanggalSelesai}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
          minimumDate={new Date(tanggalMulai.getTime() + 86400000)} // minimum 1 day after start date
        />
      )}
    </View>
    
    <View style={styles.formActions}>
      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={() => setShowCreateForm(false)}
      >
        <Text style={styles.cancelButtonText}>Batal</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleCreateDietPlan}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.submitButtonText}>Buat Rencana</Text>
        )}
      </TouchableOpacity>
    </View>
  </View>
)}

{/* Weight Status Card */}
{!showCreateForm && (
  <View style={styles.statusCard}>
    <Text style={styles.cardTitle}>Status Berat Badan</Text>
    
    <View style={styles.weightInfoRow}>
      <View style={styles.weightInfoItem}>
        <Text style={styles.weightInfoLabel}>Berat Saat Ini</Text>
        <Text style={styles.weightInfoValue}>{currentWeight ? `${currentWeight} kg` : "-"}</Text>
      </View>
      
      <View style={styles.weightInfoItem}>
        <Text style={styles.weightInfoLabel}>Berat Ideal</Text>
        <Text style={styles.weightInfoValue}>{idealWeight ? `${idealWeight} kg` : "-"}</Text>
      </View>
    </View>
    
    <View style={styles.infoBox}>
      <Flame size={20} color="#FFB800" />
      <Text style={styles.infoBoxText}>
        Kebutuhan kalori harian: <Text style={styles.infoHighlight}>{recommendedCalories} kal</Text>
      </Text>
    </View>
  </View>
)}

{/* Active Diet Plan Card */}
{activeDietPlan && !showCreateForm && (
  <View style={styles.activePlanCard}>
    <View style={styles.planHeader}>
      <Text style={styles.planTitle}>Rencana Diet Aktif</Text>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Aktif</Text>
      </View>
    </View>
    
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${Math.min(activeDietPlan.progress, 100)}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{activeDietPlan.progress}% Selesai</Text>
    </View>
    
    <View style={styles.planDetails}>
      <View style={styles.planDetailItem}>
        <Target size={20} color="#FFB800" />
        <View style={styles.detailContent}>
          <Text style={styles.detailLabel}>Target Kalori</Text>
          <Text style={styles.detailValue}>{activeDietPlan.target_kalori} kal/hari</Text>
        </View>
      </View>
      
      <View style={styles.planDetailItem}>
        <Scale size={20} color="#FFB800" />
        <View style={styles.detailContent}>
          <Text style={styles.detailLabel}>Target Berat</Text>
          <Text style={styles.detailValue}>{activeDietPlan.target_berat} kg</Text>
        </View>
      </View>
      
      <View style={styles.planDetailItem}>
        <Calendar size={20} color="#FFB800" />
        <View style={styles.detailContent}>
          <Text style={styles.detailLabel}>Periode</Text>
          <Text style={styles.detailValue}>
            {formatDate(activeDietPlan.tanggal_mulai)} - {formatDate(activeDietPlan.tanggal_selesai)}
          </Text>
        </View>
      </View>
      
      <View style={styles.planDetailItem}>
        <Clock size={20} color="#FFB800" />
        <View style={styles.detailContent}>
          <Text style={styles.detailLabel}>Sisa Waktu</Text>
          <Text style={styles.detailValue}>{activeDietPlan.remaining_days} hari lagi</Text>
        </View>
      </View>
    </View>
    
    <View style={styles.planActions}>
      <TouchableOpacity 
        style={styles.completeButton}
        onPress={() => handleCompleteDietPlan(activeDietPlan.id)}
      >
        <Check size={20} color="#FFF" />
        <Text style={styles.actionButtonText}>Selesaikan</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.cancelPlanButton}
        onPress={() => handleCancelDietPlan(activeDietPlan.id)}
      >
        <X size={20} color="#FFF" />
        <Text style={styles.actionButtonText}>Batalkan</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

{/* Weight History Chart */}
{chartData && !showCreateForm && (
  <View style={styles.chartCard}>
    <Text style={styles.cardTitle}>Riwayat Berat Badan</Text>
    
    <View style={styles.chartContainer}>
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 1,
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
  </View>
)}

{/* Completed Diet Plans */}
{completedDietPlans && completedDietPlans.length > 0 && !showCreateForm && (
  <View style={styles.historyCard}>
    <Text style={styles.cardTitle}>Riwayat Diet</Text>
    
    {completedDietPlans.map((plan, index) => (
      <View key={index} style={styles.historyItem}>
        <View style={styles.historyItemHeader}>
          <Text style={styles.historyItemTitle}>Rencana Diet {index + 1}</Text>
          <View style={[
            styles.statusBadge,
            plan.status === "selesai" ? styles.completedBadge : styles.cancelledBadge
          ]}>
            <Text style={styles.statusText}>
              {plan.status === "selesai" ? "Selesai" : "Dibatalkan"}
            </Text>
          </View>
        </View>
        
        <View style={styles.historyItemDetails}>
          <View style={styles.historyDetailRow}>
            <Text style={styles.historyDetailLabel}>Target Kalori:</Text>
            <Text style={styles.historyDetailValue}>{plan.target_kalori} kal/hari</Text>
          </View>
          
          <View style={styles.historyDetailRow}>
            <Text style={styles.historyDetailLabel}>Target Berat:</Text>
            <Text style={styles.historyDetailValue}>{plan.target_berat} kg</Text>
          </View>
          
          <View style={styles.historyDetailRow}>
            <Text style={styles.historyDetailLabel}>Periode:</Text>
            <Text style={styles.historyDetailValue}>
              {formatDate(plan.tanggal_mulai)} - {formatDate(plan.tanggal_selesai)}
            </Text>
          </View>
          
          {plan.status === "selesai" && (
            <View style={styles.historyDetailRow}>
              <Text style={styles.historyDetailLabel}>Progress:</Text>
              <Text style={styles.historyDetailValue}>{plan.progress}%</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity style={styles.viewDetailButton}>
          <Text style={styles.viewDetailText}>Lihat Detail</Text>
          <ChevronRight size={16} color="#FFB800" />
        </TouchableOpacity>
      </View>
    ))}
  </View>
)}

{/* Empty State */}
{!activeDietPlan && !showCreateForm && (!completedDietPlans || completedDietPlans.length === 0) && (
  <View style={styles.emptyState}>
    <Award size={80} color="#E5E7EB" />
    <Text style={styles.emptyStateTitle}>Belum Ada Rencana Diet</Text>
    <Text style={styles.emptyStateText}>
      Buat rencana diet pertama Anda untuk mulai mengelola asupan kalori dan mencapai berat badan ideal.
    </Text>
    <TouchableOpacity 
      style={styles.emptyStateButton}
      onPress={() => setShowCreateForm(true)}
    >
      <Plus size={20} color="#FFF" />
      <Text style={styles.emptyStateButtonText}>Buat Rencana Diet</Text>
    </TouchableOpacity>
  </View>
)}
        <Text>Content Diet Plan akan muncul di sini</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

// Menambahkan placeholder styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  headerContainer: {
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24
  },
  createButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500'
  },
  scrollContent: {
    marginTop: -60
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16
  },
  errorText: {
    color: '#B91C1C',
    textAlign: 'center'
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16
  },
  dateButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#1F2937'
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 16
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#FFB800',
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: 'center'
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16
  },
  weightInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  weightInfoItem: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4
  },
  weightInfoLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 4
  },
  weightInfoValue: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: 'bold'
  },
  infoBox: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoBoxText: {
    marginLeft: 8,
    color: '#92400E',
    flex: 1
  },
  infoHighlight: {
    fontWeight: 'bold'
  },
  activePlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  statusBadge: {
    backgroundColor: '#FFB800',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12
  },
  progressContainer: {
    marginBottom: 16
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFB800',
    borderRadius: 4
  },
  progressText: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'right'
  },
  planDetails: {
    marginBottom: 16
  },
  planDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  detailContent: {
    marginLeft: 12,
    flex: 1
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: 12
  },
  detailValue: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500'
  },
  planActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  completeButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginRight: 8
  },
  cancelPlanButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8
  },
  chart: {
    borderRadius: 16
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 12,
    marginBottom: 12
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937'
  },
  completedBadge: {
    backgroundColor: '#10B981'
  },
  cancelledBadge: {
    backgroundColor: '#EF4444'
  },
  historyItemDetails: {
    marginBottom: 12
  },
  historyDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  historyDetailLabel: {
    color: '#6B7280',
    fontSize: 14
  },
  historyDetailValue: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500'
  },
  viewDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  viewDetailText: {
    color: '#FFB800',
    fontWeight: '500',
    marginRight: 4
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8
  },
  emptyStateText: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB800',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8
  }
})

export default DietScreen