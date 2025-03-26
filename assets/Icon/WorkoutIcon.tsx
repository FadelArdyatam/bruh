// Utilitas untuk mengelola ikon latihan
import React from "react";
import { 
  Activity, 
  TrendingUp, 
  Heart, 
  Zap, 
  Bike, 
  Dumbbell,
  PlayCircle
} from "lucide-react-native";

/**
 * Menentukan ikon yang sesuai untuk setiap jenis latihan berdasarkan nama dan intensitas
 */
export const getWorkoutIcon = (
  workout: { nama_latihan: string }, 
  isSelected: boolean, 
  isHighIntensity: boolean
): React.ReactNode => {
  const iconColor = isSelected ? "#FFFFFF" : (isHighIntensity ? "#FF8A00" : "#10B981");
  const iconSize = 32;
  
  const name = workout.nama_latihan.toLowerCase();
  
  // Mencocokan nama latihan dengan ikon yang sesuai
  if (name.includes("lari")) {
    return <Activity size={iconSize} color={iconColor} />;
  } else if (name.includes("renang")) {
    return <TrendingUp size={iconSize} color={iconColor} />;
  } else if (name.includes("jalan")) {
    return <TrendingUp size={iconSize} color={iconColor} />;
  } else if (name.includes("aerobik")) {
    return <Activity size={iconSize} color={iconColor} />;
  } else if (name.includes("sepeda")) {
    return <Bike size={iconSize} color={iconColor} />;
  } else if (name.includes("tabata") || name.includes("hiit")) {
    return <Dumbbell size={iconSize} color={iconColor} />;
  } else if (isHighIntensity) {
    return <Zap size={iconSize} color={iconColor} />;
  } else {
    return <Heart size={iconSize} color={iconColor} />;
  }
};

/**
 * Menentukan ikon untuk aktivitas berdasarkan nama (versi ukuran kecil untuk daftar aktivitas)
 */
export const getActivityIcon = (activityName: string, color: string = "#FFB800"): React.ReactNode => {
  const iconSize = 24;
  const name = activityName.toLowerCase();
  
  if (name.includes("lari")) {
    return <Activity size={iconSize} color={color} />;
  } else if (name.includes("renang")) {
    return <TrendingUp size={iconSize} color={color} />;
  } else if (name.includes("jalan")) {
    return <TrendingUp size={iconSize} color={color} />;
  } else if (name.includes("aerobik")) {
    return <Activity size={iconSize} color={color} />;
  } else if (name.includes("sepeda")) {
    return <Bike size={iconSize} color={color} />;
  } else if (name.includes("tabata") || name.includes("hiit")) {
    return <Dumbbell size={iconSize} color={color} />;
  } else {
    return <Activity size={iconSize} color={color} />;
  }
};

/**
 * Menentukan warna latar belakang untuk ikon berdasarkan intensitas latihan
 */
export const getWorkoutIconBackground = (isHighIntensity: boolean): string => {
  return isHighIntensity ? "#FFECC7" : "#DCFCE7";
};

/**
 * Fungsi untuk mengecek apakah latihan termasuk intensitas tinggi berdasarkan nilai kalori
 */
export const isHighIntensityWorkout = (kalorPerDetik: number): boolean => {
  return kalorPerDetik > 0.1;
};