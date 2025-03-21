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
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const saveWeightData = createAsyncThunk(
  "imt/saveWeightData",
  async (data: { berat_badan: number; minggu_ke: number; tgl_berat_badan: string }, { rejectWithValue }) => {
    try {
      const response = await weightService.saveWeightData(data)
      return response.data
    } catch (error: any) {
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
      })
      .addCase(getWeightData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Save Weight Data
      .addCase(saveWeightData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(saveWeightData.fulfilled, (state, action) => {
        state.isLoading = false
        state.weightHistory.push(action.payload)
      })
      .addCase(saveWeightData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearIMTError } = imtSlice.actions
export default imtSlice.reducer

