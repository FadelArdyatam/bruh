// app/services/workoutScheduleService.ts
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
      console.log("Token ditambahkan ke header request")
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Get all workout schedules
const getAllWorkoutSchedules = async () => {
  try {
    console.log("Memanggil API /workout-schedules")
    const response = await api.get("/workout-schedules")
    console.log("Response getAllWorkoutSchedules:", response.status)
    return response.data
  } catch (error: any) {
    console.error("Error getAllWorkoutSchedules:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Gagal mengambil jadwal latihan")
    }
    throw new Error("Network error. Silakan periksa koneksi Anda.")
  }
}

// Get workout schedule detail
const getWorkoutScheduleDetail = async (id: number) => {
  try {
    console.log(`Memanggil API /workout-schedules/${id}`)
    const response = await api.get(`/workout-schedules/${id}`)
    console.log("Response getWorkoutScheduleDetail:", response.status)
    return response.data
  } catch (error: any) {
    console.error("Error getWorkoutScheduleDetail:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Gagal mengambil detail jadwal latihan")
    }
    throw new Error("Network error. Silakan periksa koneksi Anda.")
  }
}

// Create workout schedule
const createWorkoutSchedule = async (data: { 
  id_master_latihan: number; 
  hari: string; 
  waktu_mulai: string; 
  durasi_menit: number; 
  pengingat: boolean 
}) => {
  try {
    console.log("Membuat jadwal latihan baru:", data)
    const response = await api.post("/workout-schedules", data)
    console.log("Response createWorkoutSchedule:", response.status)
    return response.data
  } catch (error: any) {
    console.error("Error createWorkoutSchedule:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Gagal membuat jadwal latihan")
    }
    throw new Error("Network error. Silakan periksa koneksi Anda.")
  }
}

// Update workout schedule
const updateWorkoutSchedule = async (id: number, data: { 
  waktu_mulai?: string; 
  durasi_menit?: number; 
  pengingat?: boolean 
}) => {
  try {
    console.log(`Memperbarui jadwal latihan ${id}:`, data)
    const response = await api.put(`/workout-schedules/${id}`, data)
    console.log("Response updateWorkoutSchedule:", response.status)
    return response.data
  } catch (error: any) {
    console.error("Error updateWorkoutSchedule:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Gagal memperbarui jadwal latihan")
    }
    throw new Error("Network error. Silakan periksa koneksi Anda.")
  }
}

// Delete workout schedule
const deleteWorkoutSchedule = async (id: number) => {
  try {
    console.log(`Menghapus jadwal latihan ${id}`)
    const response = await api.delete(`/workout-schedules/${id}`)
    console.log("Response deleteWorkoutSchedule:", response.status)
    return response.data
  } catch (error: any) {
    console.error("Error deleteWorkoutSchedule:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Gagal menghapus jadwal latihan")
    }
    throw new Error("Network error. Silakan periksa koneksi Anda.")
  }
}

const workoutScheduleService = {
  getAllWorkoutSchedules,
  getWorkoutScheduleDetail,
  createWorkoutSchedule,
  updateWorkoutSchedule,
  deleteWorkoutSchedule,
}

export default workoutScheduleService