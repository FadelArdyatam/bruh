import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import foodService from "../../services/foodService"

interface FoodState {
  foodList: any[]
  selectedFood: any | null
  foodRecall: {
    wednesday: any[]
    sunday: any[]
  }
  isLoading: boolean
  error: string | null
}

const initialState: FoodState = {
  foodList: [],
  selectedFood: null,
  foodRecall: {
    wednesday: [],
    sunday: [],
  },
  isLoading: false,
  error: null,
}

export const getAllFood = createAsyncThunk("food/getAllFood", async (_, { rejectWithValue }) => {
  try {
    const response = await foodService.getAllFood()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const getFoodDetail = createAsyncThunk("food/getFoodDetail", async (id: number, { rejectWithValue }) => {
  try {
    const response = await foodService.getFoodDetail(id)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const submitFoodSuggestion = createAsyncThunk(
  "food/submitFoodSuggestion",
  async (data: { nama_makanan: string; kalori: string; volume: string; satuan: string }, { rejectWithValue }) => {
    try {
      const response = await foodService.submitFoodSuggestion(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

export const saveFoodRecall = createAsyncThunk(
  "food/saveFoodRecall",
  async (data: { day: "wednesday" | "sunday"; foods: any[] }, { rejectWithValue }) => {
    try {
      // This is a local action since there's no API endpoint for food recall
      return data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    clearFoodError: (state) => {
      state.error = null
    },
    setSelectedFood: (state, action) => {
      state.selectedFood = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Food
      .addCase(getAllFood.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllFood.fulfilled, (state, action) => {
        state.isLoading = false
        state.foodList = action.payload
      })
      .addCase(getAllFood.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Get Food Detail
      .addCase(getFoodDetail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getFoodDetail.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedFood = action.payload
      })
      .addCase(getFoodDetail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Submit Food Suggestion
      .addCase(submitFoodSuggestion.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(submitFoodSuggestion.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(submitFoodSuggestion.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Save Food Recall
      .addCase(saveFoodRecall.fulfilled, (state, action) => {
        if (action.payload.day === "wednesday") {
          state.foodRecall.wednesday = action.payload.foods
        } else {
          state.foodRecall.sunday = action.payload.foods
        }
      })
  },
})

export const { clearFoodError, setSelectedFood } = foodSlice.actions
export default foodSlice.reducer

