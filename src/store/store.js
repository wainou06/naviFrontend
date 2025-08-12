import { configureStore } from '@reduxjs/toolkit'
import itemsReducer from '../features/itemsSlice'
import authReducer from '../features/authSlice'
import keywordsReducer from '../features/keywordSlice'
import rentalReducer from '../features/rentalSlice'
import orderReducer from '../features/orderSlice'
import priceProposalReducer from '../features/priceProposalSlice'
import infoReducer from '../features/infoSlice'

const store = configureStore({
   reducer: {
      items: itemsReducer,
      auth: authReducer,
      keywords: keywordsReducer,
      rental: rentalReducer,
      order: orderReducer,
      priceProposal: priceProposalReducer,
      info: infoReducer,
   },
})

export default store
