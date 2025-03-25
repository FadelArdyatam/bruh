import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import weightService from "../../services/weightService"

interface IMTState {
  weightHistory: Array<{
    id: number
    tgl_berat_badan: string
    berat_badan: number
    minggu_ke: number
  }>
  isLoading: boolean
  error: string | null
}

const initialState: IMTState = {
  weightHistory: [],
  isLoading: false,
  error: null,
}

export const getWeightData = createAsyncThunk("imt/getWeightData", async (_, { rejectWithValue }) => {
  try {
    const response = await weightService.getWeightData()
    console.log("Response dari getWeightData thunk:", response)
    
    // Ekstrak data dari respons API
    let weightData = [];
    
    if (response.data && Array.isArray(response.data)) {
      weightData = response.data;
    } else if (Array.isArray(response)) {
      weightData = response;
    } else if (response.data) {
      weightData = response.data;
    }
    
    console.log("Data berat badan setelah diekstrak:", weightData)
    return weightData;
  } catch (error: any) {
    console.error("Error getWeightData thunk:", error)
    return rejectWithValue(error.message)
  }
})

export const saveWeightData = createAsyncThunk(
  "imt/saveWeightData",
  async (data: { berat_badan: number; minggu_ke: number; tgl_berat_badan: string }, { rejectWithValue }) => {
    try {
      const response = await weightService.saveWeightData(data)
      console.log("Response dari saveWeightData thunk:", response)
      
      // Ekstrak data dari respons API
      let savedWeight = null;
      
      if (response.data) {
        savedWeight = response.data;
      } else {
        savedWeight = response;
      }
      
      return savedWeight;
    } catch (error: any) {
      console.error("Error saveWeightData thunk:", error)
      return rejectWithValue(error.message)
    }
  },
)

const imtSlice = createSlice({
  name: "imt",
  initialState,
  reducers: {
    clearIMTError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Weight Data
      .addCase(getWeightData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getWeightData.fulfilled, (state, action) => {
        state.isLoading = false
        state.weightHistory = action.payload
        console.log("Weight history updated in Redux:", action.payload)
      })
      .addCase(getWeightData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        console.error("Weight data fetch rejected:", action.payload)
      })
      // Save Weight Data
      .addCase(saveWeightData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(saveWeightData.fulfilled, (state, action) => {
        state.isLoading = false
        
        // Tambahkan data baru ke weightHistory
        if (action.payload) {
          state.weightHistory.push(action.payload)
          console.log("New weight data added to history:", action.payload)
        }
      })
      .addCase(saveWeightData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        console.error("Weight data save rejected:", action.payload)
      })
  },
})

export const { clearIMTError } = imtSlice.actions
export default imtSlice.reducer