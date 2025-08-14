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

// 렌탈상품 삭제
export const deleteRentalItem = createAsyncThunk('rental/deleteRentalItem', async (id, { rejectWithValue }) => {
   try {
      await rentalItemsAPI.deleteRentalItem(id)
      return id // 삭제된 아이디 반환
   } catch (error) {
      return rejectWithValue(error.message || '상품 삭제 실패')
   }
})

// 나의 렌탈 상품 목록 조회 (특정 사용자 ID 기준)
export const fetchMyRentalItems = createAsyncThunk('rental/fetchMyRentalItems', async (userId, { rejectWithValue }) => {
   try {
      // API 호출 시 userId를 파라미터로 전달
      const response = await rentalItemsAPI.getRentalItems({ userId })
      return response.data.rentalItems // 응답에서 실제 상품 목록만 반환
   } catch (error) {
      return rejectWithValue(error.message || '나의 렌탈 상품 목록 조회 실패')
   }
})

// 리덕스 슬라이스
const rentalSlice = createSlice({
   name: 'rental',
   initialState: {
      rentalItems: [], // 렌탈상품 목록
      rentalItemDetail: null, // 특정 렌탈상품 상세정보
      myRentalItems: [], // 나의 렌탈 상품 목록 (새로 추가)
      loading: false, // 로딩 상태
      myRentalItemsLoading: false, // 나의 렌탈 상품 로딩 상태
      error: null, // 에러 메시지
      myRentalItemsError: null, // 나의 렌탈 상품 에러 상태
      currentItem: null,
      pagination: {
         // 페이징 정보
         totalItems: 0,
         totalPages: 0,
         currentPage: 1,
         limit: 5,
      },
      // 필터
      sortOptions: {
         sortBy: 'createdAt',
         sortOrder: 'desc',
      },
   },
   reducers: {
      // 현재 페이지 설정
      setCurrentPage: (state, action) => {
         state.pagination.currentPage = action.payload
      },
      // 에러 초기화
      clearError: (state) => {
         state.error = null
         state.myRentalItemsError = null
      },
      // 현재 아이템 초기화
      clearCurrentItem: (state) => {
         state.currentItem = null
         state.rentalItemDetail = null
      },
      // 정렬 옵션 업데이트
      updateSort: (state, action) => {
         const { sortBy, sortOrder } = action.payload
         state.sortOptions.sortBy = sortBy
         state.sortOptions.sortOrder = sortOrder
      },
      // 정렬 초기화
      resetSort: (state) => {
         state.sortOptions = {
            sortBy: 'createdAt',
            sortOrder: 'desc',
         }
      },
      // 로컬 정렬 (클라이언트 사이드)
      sortRentalItemsLocally: (state, action) => {
         const { sortBy, sortOrder } = action.payload

         // 정렬 옵션 업데이트
         state.sortOptions.sortBy = sortBy
         state.sortOptions.sortOrder = sortOrder

         // rentalItems 배열 정렬
         state.rentalItems.sort((a, b) => {
            if (sortBy === 'oneDayPrice') {
               return sortOrder === 'asc' ? a.oneDayPrice - b.oneDayPrice : b.oneDayPrice - a.oneDayPrice
            } else if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
               const dateA = new Date(a[sortBy])
               const dateB = new Date(b[sortBy])
               return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
            }
            return 0
         })
      },
   },
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

      //나의 렌탈 상품 목록
      builder.addCase(fetchMyRentalItems.pending, (state) => {
         state.myRentalItemsLoading = true
         state.myRentalItemsError = null
      })
      builder.addCase(fetchMyRentalItems.fulfilled, (state, action) => {
         state.myRentalItemsLoading = false
         state.myRentalItems = action.payload || []
         state.myRentalItemsError = null
      })
      builder.addCase(fetchMyRentalItems.rejected, (state, action) => {
         state.myRentalItemsLoading = false
         state.myRentalItemsError = action.payload || '나의 렌탈 상품 목록 조회 실패'
         state.myRentalItems = []
      })
   },
})

export const { setCurrentPage, clearError, clearCurrentItem, updateSort, resetSort, sortRentalItemsLocally } = rentalSlice.actions
export default rentalSlice.reducer
