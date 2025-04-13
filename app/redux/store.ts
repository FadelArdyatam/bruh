import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import profileReducer from "./slices/profileSlice"
import imtReducer from "./slices/imtSlice"
import trainingReducer from "./slices/workoutSlice"
import foodReducer from "./slices/foodSlice"
import workoutScheduleReducer from "./slices/workoutScheduleSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    imt: imtReducer,
    training: trainingReducer,
    food: foodReducer,
    workoutSchedule: workoutScheduleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

function notificationReducer(state: unknown, action: UnknownAction): unknown {
  throw new Error("Function not implemented.")
}

