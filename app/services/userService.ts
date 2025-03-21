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

// Get user profile
const getUserProfile = async () => {
  try {
    const response = await api.get("/users")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch user profile")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Update user profile
const updateUserProfile = async (userData: any) => {
  try {
    const response = await api.post("/users/update", userData)

    // Update stored user data
    if (response.data.user) {
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user))
    }

    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update user profile")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get all pangkat
const getAllPangkat = async () => {
  try {
    const response = await api.get("/pangkat")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch pangkat data")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get all satuan kerja
const getAllSatuanKerja = async () => {
  try {
    const response = await api.get("/satuan-kerja")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch satuan kerja data")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get parent satuan kerja
const getParentSatuanKerja = async () => {
  try {
    const response = await api.get("/satuan-kerja/parents")
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch parent satuan kerja")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Get child satuan kerja
const getChildSatuanKerja = async (parentId: number) => {
  try {
    const response = await api.get(`/satuan-kerja/children/${parentId}`)
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch child satuan kerja")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

const userService = {
  getUserProfile,
  updateUserProfile,
  getAllPangkat,
  getAllSatuanKerja,
  getParentSatuanKerja,
  getChildSatuanKerja,
}

export default userService

