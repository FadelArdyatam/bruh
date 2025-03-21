import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import profileReducer from "./slices/profileSlice"
import imtReducer from "./slices/imtSlice"
import trainingReducer from "./slices/trainingSlice"
import foodReducer from "./slices/foodSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    imt: imtReducer,
    training: trainingReducer,
    food: foodReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

