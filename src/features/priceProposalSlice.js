import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createPriceProposal, fetchPriceProposals, updatePriceProposalStatus, getMyProposals, getReceivedProposals, getCompletedDeals } from '../api/priceProposalApi'

// 가격 제안 생성 thunk
export const createPriceProposalThunk = createAsyncThunk('priceProposal/createPriceProposal', async (proposalData, thunkAPI) => {
   try {
      const data = await createPriceProposal(proposalData)
      return data
   } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
   }
})

// 가격 제안 리스트 불러오기 thunk
export const fetchPriceProposalsThunk = createAsyncThunk('priceProposal/fetchPriceProposals', async (itemId, thunkAPI) => {
   try {
      const data = await fetchPriceProposals(itemId)
      return data
   } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
   }
})

// 가격 제안 상태 변경 thunk (수락/거절)
export const updateProposalStatusThunk = createAsyncThunk('priceProposal/updateStatus', async ({ proposalId, status }, thunkAPI) => {
   try {
      const data = await updatePriceProposalStatus(proposalId, status)
      return { proposalId, status, updatedProposal: data.updatedProposal }
   } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
   }
})

//추가
export const getMyProposalsThunk = createAsyncThunk('priceProposal/getMyProposals', async (_, thunkAPI) => {
   try {
      const data = await getMyProposals()
      return data
   } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
   }
})

export const getReceivedProposalsThunk = createAsyncThunk('priceProposal/getReceivedProposals', async (_, thunkAPI) => {
   try {
      const data = await getReceivedProposals()
      return data
   } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
   }
})

export const getCompletedDealsThunk = createAsyncThunk('priceProposal/getCompletedDeals', async (_, thunkAPI) => {
   try {
      const data = await getCompletedDeals()
      return data
   } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
   }
})

const priceProposalSlice = createSlice({
   name: 'priceProposal',
   initialState: {
      proposals: [],
      myProposals: [], // 내가 보낸 제안들
      receivedProposals: [], // 내가 받은 제안들
      completedDeals: [], // 완료된 거래들
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 생성
         .addCase(createPriceProposalThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createPriceProposalThunk.fulfilled, (state, action) => {
            state.loading = false
            state.proposals.push(action.payload)
         })
         .addCase(createPriceProposalThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '알 수 없는 오류 발생'
         })

         // 리스트 불러오기
         .addCase(fetchPriceProposalsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPriceProposalsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.proposals = action.payload
         })
         .addCase(fetchPriceProposalsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '알 수 없는 오류 발생'
         })

         // 상태 변경
         .addCase(updateProposalStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateProposalStatusThunk.fulfilled, (state, action) => {
            state.loading = false

            const updatedProposal = action.payload.updatedProposal
            if (updatedProposal) {
               // proposals 배열 업데이트
               const idx = state.proposals.findIndex((p) => p.id === updatedProposal.id)
               if (idx !== -1) {
                  state.proposals[idx] = updatedProposal
               }

               // 현재 아이템 정보 업데이트
               state.currentItem = {
                  ...state.currentItem,
                  ...updatedProposal.item,
                  itemSellStatus: updatedProposal.item.itemSellStatus,
               }
            }
         })

         .addCase(updateProposalStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '상태 변경 실패'
         })

         //추가
         .addCase(getMyProposalsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getMyProposalsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.myProposals = action.payload
         })
         .addCase(getMyProposalsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '내 제안 조회 실패'
         })

         .addCase(getReceivedProposalsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getReceivedProposalsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.receivedProposals = action.payload
         })
         .addCase(getReceivedProposalsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '받은 제안 조회 실패'
         })

         .addCase(getCompletedDealsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getCompletedDealsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.completedDeals = action.payload
         })
         .addCase(getCompletedDealsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '완료된 거래 조회 실패'
         })
   },
})

export default priceProposalSlice.reducer
