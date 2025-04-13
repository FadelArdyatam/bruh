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

// Add token to requests
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

// Get diet plans
const getDietPlans = async () => {
  try {
    const response = await api.get("/diet")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to fetch diet plans")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Create new diet plan
const createDietPlan = async (dietData: {
  target_kalori: number
  target_berat: number
  tanggal_mulai: string
  tanggal_selesai: string
}) => {
  try {
    const response = await api.post("/diet", dietData)
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to create diet plan")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Complete diet plan
const completeDietPlan = async (dietPlanId: number) => {
  try {
    const response = await api.put(`/diet/${dietPlanId}/complete`)
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to complete diet plan")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Cancel diet plan
const cancelDietPlan = async (dietPlanId: number) => {
  try {
    const response = await api.put(`/diet/${dietPlanId}/cancel`)
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to cancel diet plan")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

const dietService = {
  getDietPlans,
  createDietPlan,
  completeDietPlan,
  cancelDietPlan,
}

export default dietService