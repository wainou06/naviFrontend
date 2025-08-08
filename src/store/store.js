import { configureStore } from '@reduxjs/toolkit'
import itemsReducer from '../features/itemsSlice'
import authReducer from '../features/authSlice'
import keywordsReducer from '../features/keywordSlice'
import rentalReducer from '../features/rentalSlice'

const store = configureStore({
   reducer: {
      items: itemsReducer,
      auth: authReducer,
      keywords: keywordsReducer,
      rental: rentalReducer,
   },
})

export default store
