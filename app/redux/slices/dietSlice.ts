import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import dietService from "../../services/dietService"

interface DietState {
  activeDietPlan: any | null
  completedDietPlans: any[]
  weightHistory: any[]
  recommendedCalories: number | null
  currentWeight: number | null
  idealWeight: number | null
  personel: any | null
  isLoading: boolean
  error: string | null
}

const initialState: DietState = {
  activeDietPlan: null,
  completedDietPlans: [],
  weightHistory: [],
  recommendedCalories: null,
  currentWeight: null,
  idealWeight: null,
  personel: null,
  isLoading: false,
  error: null,
}

export const getDietPlans = createAsyncThunk("diet/getDietPlans", async (_, { rejectWithValue }) => {
  try {
    const response = await dietService.getDietPlans()
    return response
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const createDietPlan = createAsyncThunk(
  "diet/createDietPlan",
  async (
    dietData: {
      target_kalori: number
      target_berat: number
      tanggal_mulai: string
      tanggal_selesai: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await dietService.createDietPlan(dietData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const completeDietPlan = createAsyncThunk(
  "diet/completeDietPlan",
  async (dietPlanId: number, { rejectWithValue }) => {
    try {
      const response = await dietService.completeDietPlan(dietPlanId)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const cancelDietPlan = createAsyncThunk(
  "diet/cancelDietPlan",
  async (dietPlanId: number, { rejectWithValue }) => {
    try {
      const response = await dietService.cancelDietPlan(dietPlanId)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const dietSlice = createSlice({
  name: "diet",
  initialState,
  reducers: {
    clearDietError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Diet Plans
      .addCase(getDietPlans.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getDietPlans.fulfilled, (state, action) => {
        state.isLoading = false
        state.activeDietPlan = action.payload.activeDietPlan
        state.completedDietPlans = action.payload.completedDietPlans || []
        state.weightHistory = action.payload.weightHistory || []
        state.recommendedCalories = action.payload.recommendedCalories
        state.currentWeight = action.payload.currentWeight
        state.idealWeight = action.payload.idealWeight
        state.personel = action.payload.personel
      })
      .addCase(getDietPlans.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Diet Plan
      .addCase(createDietPlan.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createDietPlan.fulfilled, (state, action) => {
        state.isLoading = false
        state.activeDietPlan = action.payload.diet_plan
      })
      .addCase(createDietPlan.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Complete Diet Plan
      .addCase(completeDietPlan.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(completeDietPlan.fulfilled, (state, action) => {
        state.isLoading = false
        state.activeDietPlan = null
        if (state.completedDietPlans) {
          state.completedDietPlans.push(action.payload.diet_plan)
        } else {
          state.completedDietPlans = [action.payload.diet_plan]
        }
      })
      .addCase(completeDietPlan.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Cancel Diet Plan
      .addCase(cancelDietPlan.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(cancelDietPlan.fulfilled, (state) => {
        state.isLoading = false
        state.activeDietPlan = null
      })
      .addCase(cancelDietPlan.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearDietError } = dietSlice.actions
export default dietSlice.reducer