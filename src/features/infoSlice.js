import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUserInfo } from '../api/infoApi'

export const getUserInfoThunk = createAsyncThunk('info/getUserInfo', async (page, { rejectWithValue }) => {
   try {
      const response = await getUserInfo(page)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const slice = createSlice({
   name: 'info',
   initialState: {
      loading: true,
      error: null,
      userInfo: [],
      pageCount: null,
   },
   reducers: {
      clearInfoError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getUserInfoThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getUserInfoThunk.fulfilled, (state, action) => {
            state.loading = false
            state.userInfo = action.payload
            // state.pageCount = action.payload.pagination
            // console.log(action.payload.users)
         })
         .addCase(getUserInfoThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearInfoError } = slice.actions
export default slice.reducer
