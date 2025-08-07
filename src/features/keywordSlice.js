import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { deleteKeyword, getKeyword, postKeyword, putKeyword } from '../api/keywordApi'

export const postKeywordThunk = createAsyncThunk('keyword/postKeyword', async (name, { rejectWithValue }) => {
   try {
      const response = await postKeyword(name)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

export const getKeywordThunk = createAsyncThunk('keyword/getKeyword', async (_, { rejectWithValue }) => {
   try {
      const response = await getKeyword()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

export const putKeywordThunk = createAsyncThunk('keyword/putKeyword', async (data, { rejectWithValue }) => {
   try {
      const { id, name } = data
      const response = await putKeyword(id, name)

      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

export const deleteKeywordThunk = createAsyncThunk('keyword/deleteKeyword', async (data, { rejectWithValue }) => {
   try {
      const id = data
      const response = await deleteKeyword(id)

      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const slice = createSlice({
   name: 'keywords',
   initialState: {
      loading: true,
      error: null,
      keywords: [],
   },
   reducers: {
      clearAuthError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(postKeywordThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(postKeywordThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(postKeywordThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         .addCase(getKeywordThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getKeywordThunk.fulfilled, (state, action) => {
            state.loading = false
            state.keywords = action.payload
         })
         .addCase(getKeywordThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         .addCase(putKeywordThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(putKeywordThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(putKeywordThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         .addCase(deleteKeywordThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteKeywordThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(deleteKeywordThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})
export const { clearAuthError } = slice.actions
export default slice.reducer
