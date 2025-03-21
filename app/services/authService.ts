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

// Register user
const register = async (userData: any) => {
  try {
    console.log("Registering user with data:", userData)
    const response = await api.post("/register", userData)
    console.log("Registration response:", response.data)
    return response.data
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Verify email with OTP
const verifyEmail = async (data: { email: string; otp_code: string }) => {
  try {
    console.log("Verifying email with data:", data)
    const response = await api.post("/verify-email-otp", data)
    console.log("Email verification response:", response.data)
    return response.data
  } catch (error: any) {
    console.error("Email verification error:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Email verification failed")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Verify OTP (new method)
const verifyOTP = async (email: string, otp: string) => {
  try {
    console.log("Verifying OTP for email:", email, "with otp:", otp)
    const response = await api.post("/verify-email-otp", { email, otp_code: otp })
    console.log("OTP verification response:", response.data)
    return response.data
  } catch (error: any) {
    console.error("OTP verification error:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "OTP verification failed")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Regenerate OTP
const regenerateOTP = async (email: string) => {
  try {
    console.log("Regenerating OTP for email:", email)
    const response = await api.post("/regenerate-otp", { email })
    console.log("OTP regeneration response:", response.data)
    return response.data
  } catch (error: any) {
    console.error("OTP regeneration error:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "OTP regeneration failed")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Login user
const login = async (credentials: { username: string; password: string }) => {
  try {
    console.log("Logging in with credentials:", { username: credentials.username })
    const response = await api.post("/login", credentials)
    console.log("Login response received")

    if (response.data.token) {
      await AsyncStorage.setItem("token", response.data.token)
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user))
    }

    return response.data
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Forgot password
const forgotPassword = async (email: string) => {
  try {
    console.log("Requesting password reset for email:", email)
    const response = await api.post("/forgot-password", { email })
    console.log("Password reset response:", response.data)
    return response.data
  } catch (error: any) {
    console.error("Password reset error:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Password reset request failed")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Change password
const changePassword = async (data: { current_password: string; new_password: string }, token: string) => {
  try {
    console.log("Changing password")
    const response = await api.post("/change-password", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log("Password change response:", response.data)

    if (response.data.token) {
      await AsyncStorage.setItem("token", response.data.token)
    }

    return response.data
  } catch (error: any) {
    console.error("Password change error:", error.response?.data || error.message)
    if (error.response) {
      throw new Error(error.response.data.message || "Password change failed")
    }
    throw new Error("Network error. Please check your connection.")
  }
}

// Logout user
const logout = async () => {
  console.log("Logging out")
  await AsyncStorage.removeItem("token")
  await AsyncStorage.removeItem("user")
  console.log("Token and user data removed")
}

// Check if user is logged in
const checkAuthStatus = async () => {
  console.log("Checking auth status")
  const user = await AsyncStorage.getItem("user")
  const token = await AsyncStorage.getItem("token")
  console.log("Auth check result:", { hasUser: !!user, hasToken: !!token })

  return user && token ? { user: JSON.parse(user), token } : null
}

const authService = {
  register,
  verifyEmail,
  verifyOTP,
  regenerateOTP,
  login,
  forgotPassword,
  changePassword,
  logout,
  checkAuthStatus,
}

export default authService