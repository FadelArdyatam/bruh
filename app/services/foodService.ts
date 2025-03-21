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

// Get all food data
const getAllFood = async () => {
  try {
    const response = await api.get("/makanan")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch food data")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get specific food detail
const getFoodDetail = async (id: number) => {
  try {
    const response = await api.get(`/makanan/${id}`)
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch food detail")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Submit food suggestion
const submitFoodSuggestion = async (data: { nama_makanan: string; kalori: string; volume: string; satuan: string }) => {
  try {
    const response = await api.post("/makanan-usulan", data)
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to submit food suggestion")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

const foodService = {
  getAllFood,
  getFoodDetail,
  submitFoodSuggestion,
}

export default foodService

