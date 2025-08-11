import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createPriceProposal, fetchPriceProposals, updatePriceProposalStatus } from '../api/priceProposalApi'

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
      return { proposalId, status, updatedProposal: data.proposal }
   } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message)
   }
})

const priceProposalSlice = createSlice({
   name: 'priceProposal',
   initialState: {
      proposals: [],
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
            const updatedProposal = action.payload.updatedProposal
            if (updatedProposal) {
               // item 필드가 없으면 그냥 updatedProposal에서 직접 사용
               state.currentItem = {
                  ...state.currentItem,
                  ...updatedProposal,
                  itemSellStatus: updatedProposal.itemSellStatus || updatedProposal.status,
               }
            }
            const { proposalId, status } = action.payload
            const proposal = state.proposals.find((p) => p.id === proposalId)
            if (proposal) {
               proposal.status = status
            }
         })
         .addCase(updateProposalStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || '상태 변경 실패'
         })
   },
})

export default priceProposalSlice.reducer
