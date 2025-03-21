import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "../../services/authService"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface AuthState {
  isAuthenticated: boolean
  user: any | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true, // Start with loading to check auth status
  error: null,
}

export const registerUser = createAsyncThunk("auth/register", async (userData: any, { rejectWithValue }) => {
  try {
    const response = await authService.register(userData)
    // Don't automatically set auth state here, let the VerifyEmail handle that
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Registration failed")
  }
})

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data: { email: string; otp_code: string }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(data)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Email verification failed")
    }
  },
)

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP(email, otp)
      return {
        message: response.message,
        email: email,
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "OTP verification failed")
    }
  },
)

export const regenerateOTP = createAsyncThunk("auth/regenerateOTP", async (email: string, { rejectWithValue }) => {
  try {
    const response = await authService.regenerateOTP(email)
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "OTP regeneration failed")
  }
})

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed")
    }
  },
)

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email: string, { rejectWithValue }) => {
  try {
    return await authService.forgotPassword(email)
  } catch (error: any) {
    return rejectWithValue(error.message || "Password reset request failed")
  }
})

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data: { current_password: string; new_password: string }, { rejectWithValue, getState }) => {
    try {
      const state: any = getState()
      const token = state.auth.token
      return await authService.changePassword(data, token)
    } catch (error: any) {
      return rejectWithValue(error.message || "Password change failed")
    }
  },
)

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout()
    return null
  } catch (error: any) {
    return rejectWithValue(error.message || "Logout failed")
  }
})

export const checkAuthStatus = createAsyncThunk("auth/checkStatus", async (_, { dispatch }) => {
  try {
    const userData = await AsyncStorage.getItem("user")
    const token = await AsyncStorage.getItem("token")

    if (userData && token) {
      return {
        user: JSON.parse(userData),
        token,
      }
    }
    return null
  } catch (error) {
    console.error("Error checking auth status:", error)
    return null
  } finally {
    // Always set loading to false after checking
    dispatch(setLoading(false))
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Regenerate OTP
      .addCase(regenerateOTP.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(regenerateOTP.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(regenerateOTP.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      // Check Auth Status
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true
          state.user = action.payload.user
          state.token = action.payload.token
        } else {
          state.isAuthenticated = false
          state.user = null
          state.token = null
        }
      })
  },
})

export const { setLoading, clearError } = authSlice.actions

// Add this exported selector to help with debugging auth state
export const selectAuthState = (state: { auth: AuthState }) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  error: state.auth.error,
  user: state.auth.user,
})

export default authSlice.reducer

