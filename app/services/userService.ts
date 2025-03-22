import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../config" // Ambil dari config

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
    try {
      const token = await AsyncStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log("Token ditambahkan ke header request")
      } else {
        console.log("Token tidak ditemukan di AsyncStorage")
      }
    } catch (error) {
      console.error("Error saat mengambil token:", error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Tambahkan response interceptor untuk debug
api.interceptors.response.use(
  (response) => {
    console.log(`Response dari ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    console.error(`Error dari ${error.config?.url}:`, error.response?.status || error.message)
    return Promise.reject(error)
  }
)

// Get user profile
const getUserProfile = async () => {
  try {
    console.log("Memanggil API users untuk profil")
    const response = await api.get("/users")
    console.log("Response getUserProfile:", response.status, response.data)
    return response.data
  } catch (error: any) {
    console.error("Error getUserProfile:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch user profile")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Update user profile
const updateUserProfile = async (userData: any) => {
  try {
    console.log("Mengirim data update profil:", userData)
    const response = await api.post("/users/update", userData)
    console.log("Response updateUserProfile:", response.status)

    // Update stored user data
    if (response.data.user) {
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user))
      console.log("User data disimpan di AsyncStorage")
    }

    return response.data
  } catch (error: any) {
    console.error("Error updateUserProfile:", error.response?.data || error.message)
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