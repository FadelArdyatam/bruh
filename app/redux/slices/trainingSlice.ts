import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import trainingService from "../../services/trainingService"

interface TrainingState {
  workoutList: any[]
  selectedWorkout: any | null
  trainingHistory: any[]
  isLoading: boolean
  error: string | null
}

const initialState: TrainingState = {
  workoutList: [],
  selectedWorkout: null,
  trainingHistory: [],
  isLoading: false,
  error: null,
}

export const getAllWorkouts = createAsyncThunk("training/getAllWorkouts", async (_, { rejectWithValue }) => {
  try {
    const response = await trainingService.getAllWorkouts()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const getWorkoutDetail = createAsyncThunk(
  "training/getWorkoutDetail",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await trainingService.getWorkoutDetail(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

export const saveTrainingSession = createAsyncThunk(
  "training/saveTrainingSession",
  async (trainingData: any, { rejectWithValue }) => {
    try {
      // This is a local action since there's no API endpoint for training sessions
      return {
        id: Date.now(),
        date: new Date().toISOString(),
        ...trainingData,
      }
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    clearTrainingError: (state) => {
      state.error = null
    },
    setSelectedWorkout: (state, action) => {
      state.selectedWorkout = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Workouts
      .addCase(getAllWorkouts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllWorkouts.fulfilled, (state, action) => {
        state.isLoading = false
        state.workoutList = action.payload
      })
      .addCase(getAllWorkouts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Get Workout Detail
      .addCase(getWorkoutDetail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getWorkoutDetail.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedWorkout = action.payload
      })
      .addCase(getWorkoutDetail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Save Training Session
      .addCase(saveTrainingSession.fulfilled, (state, action) => {
        state.trainingHistory.push(action.payload)
      })
  },
})

export const { clearTrainingError, setSelectedWorkout } = trainingSlice.actions
export default trainingSlice.reducer

