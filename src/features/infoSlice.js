import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { deleteUserInfo, getUserInfo, suspendUserInfo } from '../api/infoApi'

export const getUserInfoThunk = createAsyncThunk('info/getUserInfo', async (page, { rejectWithValue }) => {
   try {
      const response = await getUserInfo(page)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

export const deleteUserInfoThunk = createAsyncThunk('info/deleteUserInfo', async (id, { rejectWithValue }) => {
   try {
      const response = await deleteUserInfo(id)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

export const suspendUserInfoThunk = createAsyncThunk('info/suspendUserInfo', async (data, { rejectWithValue }) => {
   try {
      const { id, date } = data
      console.log(`부검 ${id}, ${date}`)
      const response = await suspendUserInfo(id, date)

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
         })
         .addCase(getUserInfoThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         .addCase(deleteUserInfoThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteUserInfoThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(deleteUserInfoThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         .addCase(suspendUserInfoThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(suspendUserInfoThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(suspendUserInfoThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { clearInfoError } = slice.actions
export default slice.reducer
