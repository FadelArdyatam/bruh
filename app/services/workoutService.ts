// app/services/workoutService.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all workouts
const getAllWorkouts = async () => {
  try {
    const response = await api.get("/latihan");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout data");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Get workout detail
const getWorkoutDetail = async (id: number) => {
  try {
    const response = await api.get(`/latihan/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout detail");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Log a workout
const logWorkout = async (workoutData: any) => {
  try {
    const response = await api.post("/workouts", workoutData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to log workout");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Get workout history
const getWorkoutHistory = async () => {
  try {
    const response = await api.get("/workouts");
    console.log("Workout history response:", response.data); // Add logging for debugging
    return response;
  } catch (error: any) {
    console.error("Error fetching workout history:", error);
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout history");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Get workout schedule
const getWorkoutSchedule = async () => {
  try {
    const response = await api.get("/workouts/schedule");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout schedule");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Create workout schedule
const createWorkoutSchedule = async (scheduleData: any) => {
  try {
    const response = await api.post("/workouts/schedule", scheduleData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to create workout schedule");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Get today's workouts
const getTodayWorkouts = async () => {
  try {
    const response = await api.get("/workouts/today");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch today's workouts");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Get workout recommendations
const getWorkoutRecommendations = async () => {
  try {
    const response = await api.get("/workouts/recommendations");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout recommendations");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Get workout statistics
const getWorkoutStats = async () => {
  try {
    const response = await api.get("/workouts/stats");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout statistics");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Get workout analysis
const getWorkoutAnalysis = async () => {
  try {
    const response = await api.get("/workouts/analysis");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to fetch workout analysis");
    }
    throw new Error("Network error. Please check your connection.");
  }
};

const workoutService = {
  getAllWorkouts,
  getWorkoutDetail,
  logWorkout,
  getWorkoutHistory,
  getWorkoutSchedule,
  createWorkoutSchedule,
  getTodayWorkouts,
  getWorkoutRecommendations,
  getWorkoutStats,
  getWorkoutAnalysis,
};

export default workoutService;