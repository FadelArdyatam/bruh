// app/utils/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../config"
import { isAuthError, handleAuthError } from "./authErrorHandler"

/**
 * Membuat instance Axios dengan interceptor untuk menangani error autentikasi
 * secara konsisten di seluruh aplikasi
 */
const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })

  // Request interceptor untuk menambahkan token ke semua request
  api.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log(`Token ditambahkan ke request: ${config.url}`)
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor untuk menangani error autentikasi
  api.interceptors.response.use(
    (response) => {
      console.log(`Response dari ${response.config.url}:`, response.status)
      return response
    },
    async (error) => {
      // Cek apakah error adalah masalah autentikasi (401 Unauthorized)
      if (isAuthError(error)) {
        console.log("Terdeteksi error unauthenticated:", error.response?.status)
        // Panggil handler untuk logout dan redirect
        await handleAuthError()
      }
      return Promise.reject(error)
    }
  )

  return api
}

// Export instance API yang sudah dikonfigurasi
export const apiClient = createApiClient()

// Fungsi wrapper untuk HTTP methods
export const apiGet = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const response = await apiClient.get(url, config)
    return response.data
  } catch (error) {
    throw error
  }
}

export const apiPost = async (url: string, data?: any, config?: AxiosRequestConfig) => {
  try {
    const response = await apiClient.post(url, data, config)
    return response.data
  } catch (error) {
    throw error
  }
}

export const apiPut = async (url: string, data?: any, config?: AxiosRequestConfig) => {
  try {
    const response = await apiClient.put(url, data, config)
    return response.data
  } catch (error) {
    throw error
  }
}

export const apiDelete = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const response = await apiClient.delete(url, config)
    return response.data
  } catch (error) {
    throw error
  }
}

// Function untuk multipart/form-data
export const apiPostFormData = async (url: string, formData: FormData, config?: AxiosRequestConfig) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    ...(config?.headers || {})
  }
  
  try {
    const response = await apiClient.post(url, formData, { 
      ...config,
      headers 
    })
    return response.data
  } catch (error) {
    throw error
  }
}