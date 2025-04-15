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

export const getAllWorkoutCategories = createAsyncThunk(
  "workout/getAllWorkoutCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workoutService.getAllWorkoutCategories()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

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


// Tambahkan fungsi helper untuk menghitung stats dari data history
const calculateWorkoutStats = (trainingHistory: any[]) => {
  // Default values kalau history kosong
  if (!trainingHistory || trainingHistory.length === 0) {
    return {
      total_workouts: 0,
      total_calories_burned: 0,
      total_duration: 0,
      avg_heart_rate: 0,
      current_streak: 0,
      avg_intensity: 0,
    };
  }

  // Hitung total workouts
  const total_workouts = trainingHistory.length;

  // Hitung total kalori yang dibakar (periksa berbagai nama properti yang mungkin)
  const total_calories_burned = trainingHistory.reduce((sum, workout) => {
    const calories = workout.calories_burned || workout.kalori_dibakar || 0;
    return sum + Number(calories);
  }, 0);

  // Hitung total durasi latihan
  const total_duration = trainingHistory.reduce((sum, workout) => {
    const duration = workout.duration || workout.waktu_latihan || 0;
    return sum + Number(duration);
  }, 0);

  // Hitung rata-rata detak jantung
  const heart_rates = trainingHistory
    .map(workout => workout.heart_rate || workout.denyut_jantung || 0)
    .filter(rate => rate > 0);
  const avg_heart_rate = heart_rates.length > 0
    ? heart_rates.reduce((sum, rate) => sum + Number(rate), 0) / heart_rates.length
    : 0;

  // Menghitung current streak (latihan berturut-turut)
  let current_streak = 0;
  if (trainingHistory.length > 0) {
    // Urutkan riwayat berdasarkan tanggal
    const sortedHistory = [...trainingHistory].sort((a, b) => {
      const dateA = new Date(a.date || a.tgl_latihan || a.tanggal || 0);
      const dateB = new Date(b.date || b.tgl_latihan || b.tanggal || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Implementasi sederhana untuk mendeteksi streak
    current_streak = 1; // Minimal 1 jika ada riwayat latihan
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // Milidetik dalam sehari

    for (let i = 1; i < sortedHistory.length; i++) {
      const prevDate = new Date(sortedHistory[i - 1].date || sortedHistory[i - 1].tgl_latihan || sortedHistory[i - 1].tanggal);
      const currDate = new Date(sortedHistory[i].date || sortedHistory[i].tgl_latihan || sortedHistory[i].tanggal);
      const diffDays = Math.round(Math.abs((prevDate.getTime() - currDate.getTime()) / oneDay));

      if (diffDays === 1) {
        current_streak++;
      } else {
        break;
      }
    }
  }

  // Untuk avg_intensity, kita bisa mengestimasi berdasarkan heart_rate
  // Asumsi intensitas maksimal adalah 100% dan terjadi pada heart_rate 180 bpm
  const avg_intensity = avg_heart_rate > 0 ? Math.round((avg_heart_rate / 180) * 100) : 0;

  return {
    total_workouts,
    total_calories_burned: Math.round(total_calories_burned),
    total_duration: Math.round(total_duration),
    avg_heart_rate: Math.round(avg_heart_rate),
    current_streak,
    avg_intensity,
  };
};

//// Ubah thunk untuk getWorkoutStats
export const getWorkoutStats = createAsyncThunk(
  "workout/getWorkoutStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Ambil data history dari state
      const state = getState() as { training: TrainingState };
      const trainingHistory = state.training.trainingHistory;

      // Hitung stats berdasarkan data history
      const calculatedStats = calculateWorkoutStats(trainingHistory);

      return calculatedStats;
    } catch (error: any) {
      console.error("Error calculating workout stats:", error);
      return rejectWithValue("Gagal menghitung statistik workout");
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
      // Get All Categories
      .addCase(getAllWorkoutCategories.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllWorkoutCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.workoutCategories = action.payload
      })
      .addCase(getAllWorkoutCategories.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
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