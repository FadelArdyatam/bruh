// app/redux/slices/workoutScheduleSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import workoutScheduleService from "../../services/workoutScheduleService"

interface WorkoutScheduleState {
  schedules: Record<string, any[]>; // Data dikelompokkan berdasarkan hari
  selectedSchedule: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WorkoutScheduleState = {
  schedules: {},
  selectedSchedule: null,
  isLoading: false,
  error: null,
}

export const getAllWorkoutSchedules = createAsyncThunk("workoutSchedule/getAllWorkoutSchedules", async (_, { rejectWithValue }) => {
  try {
    const response = await workoutScheduleService.getAllWorkoutSchedules()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const getWorkoutScheduleDetail = createAsyncThunk(
  "workoutSchedule/getWorkoutScheduleDetail",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await workoutScheduleService.getWorkoutScheduleDetail(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const createWorkoutSchedule = createAsyncThunk(
  "workoutSchedule/createWorkoutSchedule",
  async (data: { id_master_latihan: number; hari: string; waktu_mulai: string; durasi_menit: number; pengingat: boolean }, 
    { rejectWithValue, dispatch }) => {
    try {
      const response = await workoutScheduleService.createWorkoutSchedule(data)
      // Refresh jadwal setelah menambahkan jadwal baru
      dispatch(getAllWorkoutSchedules())
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateWorkoutSchedule = createAsyncThunk(
  "workoutSchedule/updateWorkoutSchedule",
  async ({ id, data }: { id: number; data: any }, { rejectWithValue, dispatch }) => {
    try {
      const response = await workoutScheduleService.updateWorkoutSchedule(id, data)
      // Refresh jadwal setelah memperbarui jadwal
      dispatch(getAllWorkoutSchedules())
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteWorkoutSchedule = createAsyncThunk(
  "workoutSchedule/deleteWorkoutSchedule",
  async (id: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await workoutScheduleService.deleteWorkoutSchedule(id)
      // Refresh jadwal setelah menghapus jadwal
      dispatch(getAllWorkoutSchedules())
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const workoutScheduleSlice = createSlice({
  name: "workoutSchedule",
  initialState,
  reducers: {
    clearWorkoutScheduleError: (state) => {
      state.error = null
    },
    setSelectedSchedule: (state, action) => {
      state.selectedSchedule = action.payload
    },
    clearSelectedSchedule: (state) => {
      state.selectedSchedule = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Workout Schedules
      .addCase(getAllWorkoutSchedules.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllWorkoutSchedules.fulfilled, (state, action) => {
        state.isLoading = false
        state.schedules = action.payload
      })
      .addCase(getAllWorkoutSchedules.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Get Workout Schedule Detail
      .addCase(getWorkoutScheduleDetail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getWorkoutScheduleDetail.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedSchedule = action.payload
      })
      .addCase(getWorkoutScheduleDetail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Workout Schedule
      .addCase(createWorkoutSchedule.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createWorkoutSchedule.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(createWorkoutSchedule.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Workout Schedule
      .addCase(updateWorkoutSchedule.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateWorkoutSchedule.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(updateWorkoutSchedule.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Workout Schedule
      .addCase(deleteWorkoutSchedule.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteWorkoutSchedule.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(deleteWorkoutSchedule.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearWorkoutScheduleError, setSelectedSchedule, clearSelectedSchedule } = workoutScheduleSlice.actions
export default workoutScheduleSlice.reducer