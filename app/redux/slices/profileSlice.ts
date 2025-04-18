import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import userService from "../../services/userService"

interface ProfileState {
  personalData: any | null
  pangkatList: any[]
  satuanKerjaList: any[]
  parentSatuanKerjaList: any[]
  childSatuanKerjaList: any[]
  isLoading: boolean
  error: string | null
  isUploadingPhoto: boolean
  photoUploadError: string | null
}

const initialState: ProfileState = {
  personalData: null,
  pangkatList: [],
  satuanKerjaList: [],
  parentSatuanKerjaList: [],
  childSatuanKerjaList: [],
  isLoading: false,
  error: null,
  isUploadingPhoto: false,
  photoUploadError: null,
}

export const getUserProfile = createAsyncThunk("profile/getUserProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getUserProfile()
    // Logging untuk debug
    console.log("getUserProfile response:", response)
    
    // Ekstrak data user dari respons API
    let userData = null;
    
    if (response.data) {
      userData = response.data;
    } else if (response.user) {
      userData = response.user;
    } else {
      userData = response;
    }
    
    return userData;
  } catch (error: any) {
    console.error("getUserProfile error:", error)
    return rejectWithValue(error.message)
  }
})

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await userService.updateUserProfile(userData)
      return response.user || response.data || response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateProfilePhoto = createAsyncThunk(
  "profile/updateProfilePhoto",
  async (
    { photo, removePhoto = false }: { photo: { uri: string, type?: string, fileName?: string } | null, removePhoto?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.updateProfilePhoto(photo, removePhoto)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const getAllPangkat = createAsyncThunk("profile/getAllPangkat", async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getAllPangkat()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const getAllSatuanKerja = createAsyncThunk("profile/getAllSatuanKerja", async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getAllSatuanKerja()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const getParentSatuanKerja = createAsyncThunk("profile/getParentSatuanKerja", async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getParentSatuanKerja()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const getChildSatuanKerja = createAsyncThunk(
  "profile/getChildSatuanKerja",
  async (parentId: number, { rejectWithValue }) => {
    try {
      const response = await userService.getChildSatuanKerja(parentId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null
    },
    clearPhotoUploadError: (state) => {
      state.photoUploadError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        
        // Simpan data ke state
        state.personalData = action.payload
        
        console.log("Profile data updated in Redux:", action.payload)
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        console.error("Profile data fetch rejected:", action.payload)
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.personalData = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Profile Photo
      .addCase(updateProfilePhoto.pending, (state) => {
        state.isUploadingPhoto = true
        state.photoUploadError = null
      })
      .addCase(updateProfilePhoto.fulfilled, (state, action) => {
        state.isUploadingPhoto = false
        
        // Update foto profil di state.personalData jika ada
        if (state.personalData) {
          // Jika response berisi profile_photo_url
          if (action.payload.profile_photo_url) {
            if (state.personalData.personel) {
              state.personalData.personel.profile_photo = action.payload.profile_photo
              state.personalData.personel.profile_photo_url = action.payload.profile_photo_url
            } else {
              state.personalData.profile_photo = action.payload.profile_photo
              state.personalData.profile_photo_url = action.payload.profile_photo_url
            }
          } 
          // Jika foto dihapus
          else if (action.payload.message?.includes('removed')) {
            if (state.personalData.personel) {
              state.personalData.personel.profile_photo = null
              state.personalData.personel.profile_photo_url = null
            } else {
              state.personalData.profile_photo = null
              state.personalData.profile_photo_url = null
            }
          }
        }
      })
      .addCase(updateProfilePhoto.rejected, (state, action) => {
        state.isUploadingPhoto = false
        state.photoUploadError = action.payload as string
      })
      // Get All Pangkat
      .addCase(getAllPangkat.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllPangkat.fulfilled, (state, action) => {
        state.isLoading = false
        state.pangkatList = action.payload
      })
      .addCase(getAllPangkat.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Get All Satuan Kerja
      .addCase(getAllSatuanKerja.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllSatuanKerja.fulfilled, (state, action) => {
        state.isLoading = false
        state.satuanKerjaList = action.payload
      })
      .addCase(getAllSatuanKerja.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Get Parent Satuan Kerja
      .addCase(getParentSatuanKerja.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getParentSatuanKerja.fulfilled, (state, action) => {
        state.isLoading = false
        state.parentSatuanKerjaList = action.payload
      })
      .addCase(getParentSatuanKerja.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Get Child Satuan Kerja
      .addCase(getChildSatuanKerja.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getChildSatuanKerja.fulfilled, (state, action) => {
        state.isLoading = false
        state.childSatuanKerjaList = action.payload
      })
      .addCase(getChildSatuanKerja.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearProfileError, clearPhotoUploadError } = profileSlice.actions
export default profileSlice.reducer