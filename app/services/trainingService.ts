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

// Get all workout data
const getAllWorkouts = async () => {
  try {
    const response = await api.get("/latihan")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout data")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get specific workout detail
const getWorkoutDetail = async (id: number) => {
  try {
    const response = await api.get(`/latihan/${id}`)
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout detail")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

const trainingService = {
  getAllWorkouts,
  getWorkoutDetail,
}

export default trainingService

