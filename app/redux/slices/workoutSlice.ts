// app/redux/slices/workoutSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import workoutService from "../../services/workoutService";

export interface TrainingState {
  workoutList: any[];
  selectedWorkout: any | null;
  trainingHistory: any[];
  workoutSchedule: any[];
  todayWorkouts: any[];
  workoutRecommendations: any;
  workoutStats: any;
  workoutAnalysis: any;
  workoutCategories: any[];
  isLoading: boolean;
  error: string | null;
  WorkoutDetail: { workoutId: number };
}

export const initialState: TrainingState = {
  workoutList: [],
  selectedWorkout: null,
  trainingHistory: [],
  workoutSchedule: [],
  todayWorkouts: [],
  workoutRecommendations: null,
  workoutStats: null,
  workoutAnalysis: null,
  workoutCategories: [],
  isLoading: false,
  error: null,
  WorkoutDetail: { workoutId: 0 },
};

// Get all workouts
export const getAllWorkouts = createAsyncThunk("training/getAllWorkouts", async (_, { rejectWithValue }) => {
  try {
    const response = await workoutService.getAllWorkouts();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Get workout detail
export const getWorkoutDetail = createAsyncThunk(
  "training/getWorkoutDetail",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await workoutService.getWorkoutDetail(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Log a workout
export const logWorkout = createAsyncThunk(
  "training/logWorkout",
  async (workoutData: any, { rejectWithValue }) => {
    try {
      const response = await workoutService.logWorkout(workoutData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get workout history
export const getWorkoutHistory = createAsyncThunk(
  "training/getWorkoutHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workoutService.getWorkoutHistory();
      console.log("Workout history raw response:", response); // Log the raw response for debugging
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response structure");
      }
      const historyData = response.data.data.history || [];
      return historyData;
    } catch (error: any) {
      console.error("Error fetching workout history:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch workout history");
    }
  }
);

// Get workout schedule
export const getWorkoutSchedule = createAsyncThunk(
  "training/getWorkoutSchedule",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workoutService.getWorkoutSchedule();
      return response.data.data || {};
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create workout schedule
export const createWorkoutSchedule = createAsyncThunk(
  "training/createWorkoutSchedule",
  async (scheduleData: any, { rejectWithValue }) => {
    try {
      const response = await workoutService.createWorkoutSchedule(scheduleData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get today's workouts
export const getTodayWorkouts = createAsyncThunk(
  "training/getTodayWorkouts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workoutService.getTodayWorkouts();
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get workout recommendations
export const getWorkoutRecommendations = createAsyncThunk(
  "training/getWorkoutRecommendations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workoutService.getWorkoutRecommendations();
      return response.data.data || {};
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get workout statistics
export const getWorkoutStats = createAsyncThunk(
  "training/getWorkoutStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workoutService.getWorkoutStats();
      return response.data.data || {};
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get workout analysis
export const getWorkoutAnalysis = createAsyncThunk(
  "training/getWorkoutAnalysis",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workoutService.getWorkoutAnalysis();
      return response.data.data || {};
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    clearTrainingError: (state) => {
      state.error = null;
    },
    setSelectedWorkout: (state, action) => {
      state.selectedWorkout = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Workouts
      .addCase(getAllWorkouts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllWorkouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workoutList = action.payload;
      })
      .addCase(getAllWorkouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Workout Detail
      .addCase(getWorkoutDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWorkoutDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedWorkout = action.payload;
      })
      .addCase(getWorkoutDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Log Workout
      .addCase(logWorkout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logWorkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trainingHistory.unshift(action.payload);
      })
      .addCase(logWorkout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Workout History
      .addCase(getWorkoutHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWorkoutHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trainingHistory = action.payload;
        console.log("Updated training history:", state.trainingHistory); // Add logging for debugging
      })
      .addCase(getWorkoutHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Workout Schedule
      .addCase(getWorkoutSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWorkoutSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workoutSchedule = action.payload;
      })
      .addCase(getWorkoutSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Workout Schedule
      .addCase(createWorkoutSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWorkoutSchedule.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createWorkoutSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Today's Workouts
      .addCase(getTodayWorkouts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTodayWorkouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayWorkouts = action.payload;
      })
      .addCase(getTodayWorkouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Workout Recommendations
      .addCase(getWorkoutRecommendations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWorkoutRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workoutRecommendations = action.payload;
      })
      .addCase(getWorkoutRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Workout Stats
      .addCase(getWorkoutStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWorkoutStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workoutStats = action.payload;
      })
      .addCase(getWorkoutStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Workout Analysis
      .addCase(getWorkoutAnalysis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWorkoutAnalysis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workoutAnalysis = action.payload;
      })
      .addCase(getWorkoutAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTrainingError, setSelectedWorkout } = trainingSlice.actions;
export default trainingSlice.reducer;