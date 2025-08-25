import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { recommendOrderCountUser } from '../api/recommendApi'

export const recommendOrderCountUserThunk = createAsyncThunk('recommend/orderCounterUser', async (id, { rejectWithValue }) => {
   try {
      const response = await recommendOrderCountUser(id)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const slice = createSlice({
   name: 'recommend',
   initialState: {
      loading: true,
      error: null,
      items: [],
   },
   reducers: {
      clearRecommendError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(recommendOrderCountUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(recommendOrderCountUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload
         })
         .addCase(recommendOrderCountUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearRecommendError } = slice.actions
export default slice.reducer
