import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createOrder, getOrders, cancelOrder, deleteOrder } from '../api/orderApi'

// 초기 상태
const initialState = {
   orders: [],
   loading: false,
   error: null,
}

// 비동기 thunk들

// 주문 생성
export const createOrderThunk = createAsyncThunk('order/createOrder', async (orderData, thunkAPI) => {
   try {
      const response = await createOrder(orderData)
      return response.data
   } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
   }
})

// 주문 목록 조회
export const getOrdersThunk = createAsyncThunk('order/getOrders', async (params, thunkAPI) => {
   try {
      const response = await getOrders(params)
      return response.data
   } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
   }
})

// 주문 취소
export const cancelOrderThunk = createAsyncThunk('order/cancelOrder', async (orderId, thunkAPI) => {
   try {
      const response = await cancelOrder(orderId)
      return { orderId, data: response.data }
   } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
   }
})

// 주문 삭제
export const deleteOrderThunk = createAsyncThunk('order/deleteOrder', async (orderId, thunkAPI) => {
   try {
      await deleteOrder(orderId)
      return orderId
   } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
   }
})

const orderSlice = createSlice({
   name: 'order',
   initialState,
   reducers: {
      setCurrentPage: (state, action) => {
         state.pagination.currentPage = action.payload
      },
      clearError: (state) => {
         state.error = null
      },
      clearCurrentItem: (state) => {
         state.currentItem = null
      },
      setCurrentItem: (state, action) => {
         state.currentItem = action.payload
      },
   },
   extraReducers: (builder) => {
      builder
         // 주문 생성
         .addCase(createOrderThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createOrderThunk.fulfilled, (state, action) => {
            state.loading = false
            state.orders.push(action.payload)
         })
         .addCase(createOrderThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 주문 목록 조회
         .addCase(getOrdersThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getOrdersThunk.fulfilled, (state, action) => {
            state.loading = false
            state.orders = action.payload
         })
         .addCase(getOrdersThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 주문 취소
         .addCase(cancelOrderThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(cancelOrderThunk.fulfilled, (state, action) => {
            state.loading = false
            const idx = state.orders.findIndex((o) => o.id === action.payload.orderId)
            if (idx !== -1) {
               state.orders[idx] = { ...state.orders[idx], ...action.payload.data }
            }
         })
         .addCase(cancelOrderThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 주문 삭제
         .addCase(deleteOrderThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteOrderThunk.fulfilled, (state, action) => {
            state.loading = false
            state.orders = state.orders.filter((o) => o.id !== action.payload)
         })
         .addCase(deleteOrderThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default orderSlice.reducer
