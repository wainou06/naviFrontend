import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { rentalItemsAPI } from '../api/rentalItemsApi'

// 렌탈상품 목록 조회 (페이징, 검색 기능 포함)
export const fetchRentalItems = createAsyncThunk('rental/fetchRentalItems', async (params, { rejectWithValue }) => {
   try {
      const response = await rentalItemsAPI.getRentalItems(params)
      return response.data
   } catch (error) {
      return rejectWithValue(error.message || '상품 목록 조회 실패')
   }
})

// 특정 렌탈상품 조회
export const fetchRentalItem = createAsyncThunk('rental/fetchRentalItem', async (id, { rejectWithValue }) => {
   try {
      const response = await rentalItemsAPI.getRentalItem(id)
      return response.data
   } catch (error) {
      return rejectWithValue(error.message || '상품 조회 실패')
   }
})

// 렌탈상품 등록
export const createRentalItem = createAsyncThunk('rental/createRentalItem', async (rentalItemData, { rejectWithValue }) => {
   try {
      const response = await rentalItemsAPI.createRentalItem(rentalItemData)
      return response.data
   } catch (error) {
      return rejectWithValue(error.message || '상품 등록 실패')
   }
})

// 렌탈상품 수정
export const updateRentalItem = createAsyncThunk('rental/updateRentalItem', async ({ id, rentalItemData }, { rejectWithValue }) => {
   try {
      console.log('Redux thunk - 수정 요청:', { id, rentalItemData })
      const response = await rentalItemsAPI.updateRentalItem(id, rentalItemData)
      console.log('Redux thunk - 서버 응답:', response.data)
      return response.data
   } catch (error) {
      console.error('Redux thunk - 에러:', error)
      return rejectWithValue(error.message || '상품 수정 실패')
   }
})
// export const updateRentalItem = createAsyncThunk('rental/updateRentalItem', async ({ id, rentalItemData }, { rejectWithValue }) => {
//    try {
//       const response = await rentalItemsAPI.updateRentalItem(id, rentalItemData)
//       return response.data
//    } catch (error) {
//       return rejectWithValue(error.message || '상품 수정 실패')
//    }
// })

// 렌탈상품 삭제
export const deleteRentalItem = createAsyncThunk('rental/deleteRentalItem', async (id, { rejectWithValue }) => {
   try {
      const response = await rentalItemsAPI.deleteRentalItem(id)
      return id // 삭제된 아이디 반환
   } catch (error) {
      return rejectWithValue(error.message || '상품 삭제 실패')
   }
})

// 리덕스 슬라이스
const rentalSlice = createSlice({
   name: 'rental',
   initialState: {
      rentalItems: [], // 렌탈상품 목록
      rentalItemDetail: null, // 특정 렌탈상품 상세정보
      loading: false, // 로딩 상태
      error: null, // 에러 메시지
      currentItem: null,
      pagination: {
         // 페이징 정보
         totalItems: 0,
         totalPages: 0,
         currentPage: 1,
         limit: 5,
      },
   },
   reducers: {},
   extraReducers: (builder) => {
      // 렌탈상품 목록 조회
      builder.addCase(fetchRentalItems.pending, (state) => {
         state.loading = true
         state.error = null
      })
      builder.addCase(fetchRentalItems.fulfilled, (state, action) => {
         state.loading = false
         state.rentalItems = action.payload?.rentalItems || []
         state.pagination = action.payload?.pagination || {}
      })
      builder.addCase(fetchRentalItems.rejected, (state, action) => {
         state.loading = false
         state.error = action.payload || '상품 목록 조회 실패'
      })

      // 특정 렌탈상품 조회
      builder.addCase(fetchRentalItem.pending, (state) => {
         state.loading = true
         state.error = null
      })
      builder.addCase(fetchRentalItem.fulfilled, (state, action) => {
         state.loading = false
         state.rentalItemDetail = action.payload
         state.currentItem = action.payload
      })
      builder.addCase(fetchRentalItem.rejected, (state, action) => {
         state.loading = false
         state.error = action.payload || '상품 조회 실패'
      })

      // 렌탈상품 등록
      builder.addCase(createRentalItem.pending, (state) => {
         state.loading = true
         state.error = null
      })
      builder.addCase(createRentalItem.fulfilled, (state, action) => {
         state.loading = false
         state.rentalItems.push(action.payload.data) // 새로 등록된 상품 추가
      })
      builder.addCase(createRentalItem.rejected, (state, action) => {
         state.loading = false
         state.error = action.payload || '상품 등록 실패'
      })

      // 렌탈상품 수정
      builder.addCase(updateRentalItem.pending, (state) => {
         state.loading = true
         state.error = null
      })
      builder.addCase(updateRentalItem.fulfilled, (state, action) => {
         state.loading = false
         state.error = null

         // 서버 응답에서 실제 데이터 추출
         const updatedItem = action.payload.data || action.payload

         console.log('Redux fulfilled - 받은 데이터:', updatedItem)

         if (updatedItem && updatedItem.id) {
            // 리스트에서 해당 아이템 찾아서 업데이트
            const index = state.rentalItems.findIndex((item) => item.id === updatedItem.id)

            if (index !== -1) {
               state.rentalItems[index] = updatedItem
            }

            // 상세 정보도 업데이트
            state.rentalItemDetail = updatedItem
            state.currentItem = updatedItem
         }
      })
      builder.addCase(updateRentalItem.rejected, (state, action) => {
         state.loading = false
         state.error = action.payload || '상품 수정 실패'
      })

      // 렌탈상품 삭제
      builder.addCase(deleteRentalItem.pending, (state) => {
         state.loading = true
         state.error = null
      })
      builder.addCase(deleteRentalItem.fulfilled, (state, action) => {
         state.loading = false
         state.rentalItems = state.rentalItems.filter((item) => item.id !== action.payload) // 삭제된 상품 제외
      })
      builder.addCase(deleteRentalItem.rejected, (state, action) => {
         state.loading = false
         state.error = action.payload || '상품 삭제 실패'
      })
   },
})

export default rentalSlice.reducer
