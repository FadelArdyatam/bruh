// app/services/trainingService.ts
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../config"

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Get workout history and statistics
const getWorkoutHistory = async () => {
  try {
    const response = await api.get("/workouts")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout history")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Log a new workout
const logWorkout = async (workoutData: {
  id_master_latihan: number;
  denyut_jantung: number;
  jarak_tempuh?: number;
  waktu_latihan: number;
  tgl_latihan: string;
  mood?: string;
  tingkat_kelelahan?: number;
}) => {
  try {
    const response = await api.post("/workouts", workoutData)
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to log workout")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get workout statistics
const getWorkoutStats = async () => {
  try {
    const response = await api.get("/workouts/stats")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout statistics")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get workout analysis
const getWorkoutAnalysis = async () => {
  try {
    const response = await api.get("/workouts/analysis")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout analysis")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get today's workouts
const getTodayWorkouts = async () => {
  try {
    const response = await api.get("/workouts/today")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch today's workouts")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get workout recommendations
const getWorkoutRecommendations = async () => {
  try {
    const response = await api.get("/workouts/recommendations")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout recommendations")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

const trainingService = {
  getWorkoutHistory,
  logWorkout,
  getWorkoutStats,
  getWorkoutAnalysis,
  getTodayWorkouts,
  getWorkoutRecommendations
}

export default trainingService