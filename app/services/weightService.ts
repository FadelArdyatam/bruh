import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = "https://demo.sosiogrow.my.id/api/v1"

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
  },
)

// Get weight data
const getWeightData = async () => {
  try {
    const response = await api.get("/berat-badan")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch weight data")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Save weight data
const saveWeightData = async (data: { berat_badan: number; minggu_ke: number; tgl_berat_badan: string }) => {
  try {
    const response = await api.post("/berat-badan", data)
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to save weight data")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

const weightService = {
  getWeightData,
  saveWeightData,
}

export default weightService

