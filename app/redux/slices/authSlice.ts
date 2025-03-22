import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "../../services/authService"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface AuthState {
  isAuthenticated: boolean
  user: any | null
  token: string | null
  isLoading: boolean
  error: string | null
  pendingVerification: boolean
  pendingEmail: string | null 
  needsProfileSetup: boolean; 
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true, // Start with loading to check auth status
  error: null,
  pendingVerification: false,
  pendingEmail: null,
  needsProfileSetup: false
}

export const completeProfileSetup = () => async (dispatch: (arg0: { type: string }) => void) => {
  try {
    // Simpan status di storage
    await AsyncStorage.setItem("profileCompleted", "true");
    
    // Dispatch action reducer sederhana
    dispatch({ type: 'auth/setupProfileComplete' });
  } catch (error) {
    console.error("Error setting profileCompleted:", error);
  }
}


export const registerUser = createAsyncThunk("auth/register", async (userData: any, { rejectWithValue, dispatch }) => {
  try {
    const response = await authService.register(userData)
    // Set pendingVerification dan pendingEmail saat registrasi berhasil
    dispatch(setPendingVerification({ pending: true, email: userData.email }))
    return response
  } catch (error: any) {
    return rejectWithValue(error.message || "Registration failed")
  }
})

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data: { email: string; otp_code: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.verifyEmail(data)
      // Reset pendingVerification ketika verifikasi berhasil
      dispatch(setPendingVerification({ pending: false, email: null }))
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Email verification failed")
    }
  },
)

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue, dispatch }) => {
    try {
      console.log(`Verifying OTP: email=${email}, otp=${otp}`)
      const response = await authService.verifyOTP(email, otp)
      console.log("OTP verification response:", response)
      
      // Reset pendingVerification ketika verifikasi berhasil
      dispatch(setPendingVerification({ pending: false, email: null }))
      
      return {
        message: response.message,
        email: email,
      }
    } catch (error: any) {
      console.error("OTP verification error:", error)
      return rejectWithValue(error.message || "OTP verification failed")
    }
  },
)

export const regenerateOTP = createAsyncThunk("auth/regenerateOTP", async (email: string, { rejectWithValue }) => {
  try {
    console.log(`Regenerating OTP for email: ${email}`)
    const response = await authService.regenerateOTP(email)
    console.log("OTP regeneration response:", response)
    return response
  } catch (error: any) {
    console.error("OTP regeneration error:", error)
    return rejectWithValue(error.message || "OTP regeneration failed")
  }
})

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      // Cek status profil saat login
      const profileCompleted = await AsyncStorage.getItem("profileCompleted");
      
      // Cek kelengkapan data profil
      const user = response.user;
      const isProfileComplete = !!(
        user && 
        user.tinggi_badan && 
        user.id_pangkat &&
        user.tanggal_lahir &&
        user.tempat_lahir &&
        user.id_satuankerja
      );
      
      // Jika profil sebelumnya sudah selesai atau data profil lengkap
      if (profileCompleted === "true" || isProfileComplete) {
        await AsyncStorage.setItem("profileCompleted", "true");
        
        return {
          ...response,
          needsProfileSetup: false
        };
      }
      
      // Jika profil belum lengkap
      await AsyncStorage.setItem("profileCompleted", "false");
      
      return {
        ...response,
        needsProfileSetup: true
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);



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

const isProfileComplete = (user: { tinggi_badan: any; id_pangkat: any; tanggal_lahir: any; tempat_lahir: any; id_satuankerja: any }) => {
  return !!(
    user && 
    user.tinggi_badan && 
    user.id_pangkat &&
    user.tanggal_lahir &&
    user.tempat_lahir &&
    user.id_satuankerja
  );
};

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout()
    return null
  } catch (error: any) {
    return rejectWithValue(error.message || "Logout failed")
  }
})

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus", 
  async (_, { dispatch }) => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      const profileCompleted = await AsyncStorage.getItem("profileCompleted");

      console.log("Storage values:", { 
        hasUser: !!userData, 
        hasToken: !!token, 
        profileCompleted 
      });

      if (userData && token) {
        const user = JSON.parse(userData);
        
        // Pemeriksaan profil
        let needsSetup = false;
        
        // Prioritaskan nilai profileCompleted dari storage
        if (profileCompleted === "true") {
          needsSetup = false;
        } 
        // Jika tidak ada flag, periksa data profil
        else if (profileCompleted === null || profileCompleted === undefined) {
          // Cek kelengkapan data
          const isProfileComplete = !!(
            user && 
            user.tinggi_badan && 
            user.id_pangkat &&
            user.tanggal_lahir &&
            user.tempat_lahir &&
            user.id_satuankerja
          );
          
          if (isProfileComplete) {
            // Jika profil lengkap, simpan flag
            await AsyncStorage.setItem("profileCompleted", "true");
            needsSetup = false;
          } else {
            needsSetup = true;
          }
        }
        // Jika profileCompleted = "false"
        else {
          needsSetup = true;
        }
        
        return {
          user,
          token,
          needsProfileSetup: needsSetup
        };
      }
      return null;
    } catch (error) {
      console.error("Error checking auth status:", error);
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

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
    setPendingVerification: (state, action) => {
      state.pendingVerification = action.payload.pending
      state.pendingEmail = action.payload.email
    },
    setupProfileComplete: (state) => {
      state.needsProfileSetup = false;
      // Tidak ada akses AsyncStorage di sini
    }
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
        state.pendingVerification = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.pendingVerification = false
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false
        state.pendingVerification = false
        state.pendingEmail = null
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
        state.pendingVerification = false
        state.pendingEmail = null
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
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.pendingVerification = false;
        state.pendingEmail = null;
        
        // Gunakan nilai needsProfileSetup dari payload (hasil perhitungan di thunk)
        state.needsProfileSetup = action.payload.needsProfileSetup;
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
        state.pendingVerification = false
        state.pendingEmail = null
      })
      // Check Auth Status
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true
          state.user = action.payload.user
          state.token = action.payload.token
          // ambbbiill nilai needsSetup

          state.needsProfileSetup = action.payload.needsProfileSetup;
        } else {
          state.isAuthenticated = false
          state.user = null
          state.token = null
        }
      })
  },
})

export const { setLoading, clearError, setPendingVerification, setupProfileComplete  } = authSlice.actions

// Add this exported selector to help with debugging auth state
export const selectAuthState = (state: { auth: AuthState }) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  error: state.auth.error,
  user: state.auth.user,
  pendingVerification: state.auth.pendingVerification,
  pendingEmail: state.auth.pendingEmail,
})

export default authSlice.reducer