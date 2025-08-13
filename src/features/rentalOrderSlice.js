import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as rentalOrderAPI from '../api/rentalOrderApi'

// 렌탈 주문 생성
export const createRentalOrderThunk = createAsyncThunk('rentalOrder/createRentalOrder', async (rentalData, { rejectWithValue }) => {
   try {
      const response = await rentalOrderAPI.createRentalOrder(rentalData)
      return response
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '렌탈 주문 생성에 실패했습니다.')
   }
})

// 특정 렌탈 상품의 주문 목록 조회
export const fetchRentalOrdersByItemThunk = createAsyncThunk('rentalOrder/fetchRentalOrdersByItem', async (rentalItemId, { rejectWithValue }) => {
   try {
      const response = await rentalOrderAPI.fetchRentalOrdersByItem(rentalItemId)
      return response
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '렌탈 주문 목록 조회에 실패했습니다.')
   }
})

// 내 렌탈 주문 목록 조회
export const fetchMyRentalOrdersThunk = createAsyncThunk('rentalOrder/fetchMyRentalOrders', async (params = {}, { rejectWithValue }) => {
   try {
      const response = await rentalOrderAPI.fetchMyRentalOrders(params)
      return response
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '내 렌탈 주문 조회에 실패했습니다.')
   }
})

// 렌탈 주문 상세 조회
export const fetchRentalOrderDetailThunk = createAsyncThunk('rentalOrder/fetchRentalOrderDetail', async (orderId, { rejectWithValue }) => {
   try {
      const response = await rentalOrderAPI.fetchRentalOrderDetail(orderId)
      return response
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '렌탈 주문 상세 조회에 실패했습니다.')
   }
})

// 렌탈 주문 상태 수정
export const updateRentalOrderStatusThunk = createAsyncThunk('rentalOrder/updateRentalOrderStatus', async ({ orderId, orderStatus }, { rejectWithValue }) => {
   try {
      const response = await rentalOrderAPI.updateRentalOrderStatus(orderId, orderStatus)
      return { orderId, ...response }
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '렌탈 주문 상태 수정에 실패했습니다.')
   }
})

// 렌탈 주문 삭제
export const deleteRentalOrderThunk = createAsyncThunk('rentalOrder/deleteRentalOrder', async (orderId, { rejectWithValue }) => {
   try {
      const response = await rentalOrderAPI.deleteRentalOrder(orderId)
      return { orderId, ...response }
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '렌탈 주문 삭제에 실패했습니다.')
   }
})

const initialState = {
   // 렌탈 주문 목록 (특정 상품의 주문들)
   rentalOrders: [],

   // 내 렌탈 주문 목록
   myRentalOrders: [],

   // 선택된 렌탈 주문 상세
   selectedRentalOrder: null,

   // 로딩 상태들
   loading: false,
   createLoading: false,
   updateLoading: false,
   deleteLoading: false,

   // 에러 상태들
   error: null,
   createError: null,
   updateError: null,
   deleteError: null,

   // 페이지네이션
   pagination: {
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 10,
   },
}

const rentalOrderSlice = createSlice({
   name: 'rentalOrder',
   initialState,
   reducers: {
      // 에러 클리어
      clearErrors: (state) => {
         state.error = null
         state.createError = null
         state.updateError = null
         state.deleteError = null
      },

      // 선택된 주문 클리어
      clearSelectedRentalOrder: (state) => {
         state.selectedRentalOrder = null
      },

      // 렌탈 주문 목록 클리어
      clearRentalOrders: (state) => {
         state.rentalOrders = []
      },

      // 로딩 상태 클리어
      clearLoadings: (state) => {
         state.loading = false
         state.createLoading = false
         state.updateLoading = false
         state.deleteLoading = false
      },
   },
   extraReducers: (builder) => {
      // 렌탈 주문 생성
      builder
         .addCase(createRentalOrderThunk.pending, (state) => {
            state.createLoading = true
            state.createError = null
         })
         .addCase(createRentalOrderThunk.fulfilled, (state, action) => {
            state.createLoading = false
            // 필요시 myRentalOrders에 추가
            if (action.payload.data) {
               state.myRentalOrders.unshift(action.payload.data)
            }
         })
         .addCase(createRentalOrderThunk.rejected, (state, action) => {
            state.createLoading = false
            state.createError = action.payload
         })

      // 특정 상품의 렌탈 주문 목록 조회
      builder
         .addCase(fetchRentalOrdersByItemThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchRentalOrdersByItemThunk.fulfilled, (state, action) => {
            state.loading = false
            state.rentalOrders = action.payload.data || []
         })
         .addCase(fetchRentalOrdersByItemThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 내 렌탈 주문 목록 조회
      builder
         .addCase(fetchMyRentalOrdersThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchMyRentalOrdersThunk.fulfilled, (state, action) => {
            state.loading = false
            state.myRentalOrders = action.payload.data || []
            if (action.payload.pagination) {
               state.pagination = action.payload.pagination
            }
         })
         .addCase(fetchMyRentalOrdersThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 렌탈 주문 상세 조회
      builder
         .addCase(fetchRentalOrderDetailThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchRentalOrderDetailThunk.fulfilled, (state, action) => {
            state.loading = false
            state.selectedRentalOrder = action.payload.data
         })
         .addCase(fetchRentalOrderDetailThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 렌탈 주문 상태 수정
      builder
         .addCase(updateRentalOrderStatusThunk.pending, (state) => {
            state.updateLoading = true
            state.updateError = null
         })
         .addCase(updateRentalOrderStatusThunk.fulfilled, (state, action) => {
            state.updateLoading = false
            const { orderId } = action.payload

            // 목록에서 해당 주문 상태 업데이트
            const orderIndex = state.rentalOrders.findIndex((order) => order.id === orderId)
            if (orderIndex !== -1) {
               state.rentalOrders[orderIndex] = { ...state.rentalOrders[orderIndex], ...action.payload.data }
            }

            const myOrderIndex = state.myRentalOrders.findIndex((order) => order.id === orderId)
            if (myOrderIndex !== -1) {
               state.myRentalOrders[myOrderIndex] = { ...state.myRentalOrders[myOrderIndex], ...action.payload.data }
            }

            // 선택된 주문도 업데이트
            if (state.selectedRentalOrder && state.selectedRentalOrder.id === orderId) {
               state.selectedRentalOrder = { ...state.selectedRentalOrder, ...action.payload.data }
            }
         })
         .addCase(updateRentalOrderStatusThunk.rejected, (state, action) => {
            state.updateLoading = false
            state.updateError = action.payload
         })

      // 렌탈 주문 삭제
      builder
         .addCase(deleteRentalOrderThunk.pending, (state) => {
            state.deleteLoading = true
            state.deleteError = null
         })
         .addCase(deleteRentalOrderThunk.fulfilled, (state, action) => {
            state.deleteLoading = false
            // 목록에서 삭제된 주문 제거
            const deletedOrderId = action.payload.orderId
            state.rentalOrders = state.rentalOrders.filter((order) => order.id !== deletedOrderId)
            state.myRentalOrders = state.myRentalOrders.filter((order) => order.id !== deletedOrderId)

            // 선택된 주문이 삭제된 경우 클리어
            if (state.selectedRentalOrder && state.selectedRentalOrder.id === deletedOrderId) {
               state.selectedRentalOrder = null
            }
         })
         .addCase(deleteRentalOrderThunk.rejected, (state, action) => {
            state.deleteLoading = false
            state.deleteError = action.payload
         })
   },
})

export const { clearErrors, clearSelectedRentalOrder, clearRentalOrders, clearLoadings } = rentalOrderSlice.actions
export default rentalOrderSlice.reducer
