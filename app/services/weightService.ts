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
      console.log("Token ditambahkan ke header request weight service")
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`Response weight service dari ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    console.error(`Error weight service dari ${error.config?.url}:`, error.response?.status || error.message)
    return Promise.reject(error)
  }
)

// Get weight data
const getWeightData = async () => {
  try {
    console.log("Memanggil API /berat-badan")
    const response = await api.get("/berat-badan")
    console.log("Response getWeightData:", response.status, response.data)
    return response.data
  } catch (error: any) {
    console.error("Error getWeightData:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch weight data")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Save weight data
const saveWeightData = async (data: { berat_badan: number; minggu_ke: number; tgl_berat_badan: string }) => {
  try {
    console.log("Menyimpan data berat badan:", data)
    const response = await api.post("/berat-badan", data)
    console.log("Response saveWeightData:", response.status, response.data)
    return response.data
  } catch (error: any) {
    console.error("Error saveWeightData:", error.response?.data || error.message)
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