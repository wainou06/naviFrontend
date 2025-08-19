import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getBuyerRating, postRating } from '../api/ratingApi'

export const getBuyerRatingThunk = createAsyncThunk('rating/getBuyer', async (data, { rejectedWithValue }) => {
   try {
      console.log(data)
      const response = await getBuyerRating(data)
      return response.data
   } catch (error) {
      return rejectedWithValue(error.response?.data?.message)
   }
})

export const postRatingThunk = createAsyncThunk('rating/postRating', async (data, { rejectedWithValue }) => {
   try {
      const response = await postRating(data)
      return response.data
   } catch (error) {
      return rejectedWithValue(error.response?.data?.message)
   }
})

const slice = createSlice({
   name: 'rating',
   initialState: {
      loading: true,
      error: null,
      nadomolla: [],
      buyer: [],
   },
   reducers: {
      clearRatingError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(postRatingThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(postRatingThunk.fulfilled, (state, action) => {
            state.loading = false
            state.nadomolla = action.payload
         })
         .addCase(postRatingThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         .addCase(getBuyerRatingThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getBuyerRatingThunk.fulfilled, (state, action) => {
            state.loading = false
            state.buyer = action.payload
         })
         .addCase(getBuyerRatingThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearRatingError } = slice.actions
export default slice.reducer
