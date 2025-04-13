    // CalorieRecommendation.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const CalorieRecommendation = () => {
  const { personalData } = useSelector((state: RootState) => state.profile);
  const { weightHistory } = useSelector((state: RootState) => state.imt);
  const { trainingHistory } = useSelector((state: RootState) => state.training);
  
  const [recommendation, setRecommendation] = useState({
    dailyCalories: 0,
    maintenance: 0,
    loseWeight: 0,
    gainWeight: 0
  });

  useEffect(() => {
    if (personalData && weightHistory.length > 0) {
      calculateCalorieRecommendation();
    }
  }, [personalData, weightHistory, trainingHistory]);

  const calculateCalorieRecommendation = () => {
    // Mendapatkan data profil pengguna
    const userData = personalData.personel || personalData;
    
    // Mendapatkan berat badan terbaru
    const latestWeight = weightHistory.length > 0 ? 
      [...weightHistory].sort((a, b) => new Date(b.tgl_berat_badan).getTime() - new Date(a.tgl_berat_badan).getTime())[0].berat_badan : 
      0;
    
    if (!userData || !latestWeight) return;
    
    const height = userData.tinggi_badan || 0;
    const age = calculateAge(userData.tanggal_lahir) || 30;
    const gender = userData.jenis_kelamin || "Laki-laki";
    
    // Menghitung BMR
    let bmr = 0;
    if (gender === "Laki-laki") {
      bmr = 10 * latestWeight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * latestWeight + 6.25 * height - 5 * age - 161;
    }
    
    // Menentukan faktor aktivitas berdasarkan riwayat latihan
    let activityFactor = 1.2; // Default: Sedentary
    
    // Hitung rata-rata latihan per minggu
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentWorkouts = trainingHistory.filter(
      workout => new Date(workout.date) >= oneWeekAgo
    ).length;
    
    if (recentWorkouts >= 6) {
      activityFactor = 1.725; // Berat
    } else if (recentWorkouts >= 3) {
      activityFactor = 1.55; // Sedang
    } else if (recentWorkouts >= 1) {
      activityFactor = 1.375; // Ringan
    }
    
    // Hitung TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityFactor;
    
    // Set rekomendasi kalori
    setRecommendation({
      dailyCalories: Math.round(tdee),
      maintenance: Math.round(tdee),
      loseWeight: Math.round(tdee - 500), // Defisit 500 kalori untuk penurunan berat badan
      gainWeight: Math.round(tdee + 300) // Surplus 300 kalori untuk penambahan berat badan
    });
  };
  
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rekomendasi Kalori Harian</Text>
      
      {recommendation.dailyCalories > 0 ? (
        <View>
          <View style={styles.mainRecommendation}>
            <Text style={styles.mainRecommendationText}>
              {recommendation.dailyCalories} kalori
            </Text>
            <Text style={styles.mainRecommendationLabel}>
              Rekomendasi Harian
            </Text>
          </View>
          
          <View style={styles.otherRecommendations}>
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationValue}>
                {recommendation.loseWeight} kal
              </Text>
              <Text style={styles.recommendationLabel}>
                Penurunan BB
              </Text>
            </View>
            
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationValue}>
                {recommendation.maintenance} kal
              </Text>
              <Text style={styles.recommendationLabel}>
                Pemeliharaan
              </Text>
            </View>
            
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationValue}>
                {recommendation.gainWeight} kal
              </Text>
              <Text style={styles.recommendationLabel}>
                Penambahan BB
              </Text>
            </View>
          </View>
          
          <Text style={styles.disclaimer}>
            * Rekomendasi ini berdasarkan data profil dan aktivitas Anda
          </Text>
        </View>
      ) : (
        <Text style={styles.noData}>
          Lengkapi data profil dan berat badan untuk mendapatkan rekomendasi kalori
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1F2937",
  },
  mainRecommendation: {
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  mainRecommendationText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFB800",
    marginBottom: 4,
  },
  mainRecommendationLabel: {
    fontSize: 14,
    color: "#92400E",
  },
  otherRecommendations: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recommendationItem: {
    alignItems: "center",
    flex: 1,
  },
  recommendationValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  recommendationLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  disclaimer: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#9CA3AF",
    textAlign: "center",
  },
  noData: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    padding: 16,
  },
});

export default CalorieRecommendation;