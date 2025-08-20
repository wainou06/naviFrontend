import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

let modalPromiseResolve = null

export const showModalThunk = createAsyncThunk('modal/showModal', async ({ type, placeholder }, { dispatch, rejectWithValue }) => {
   try {
      const input = await new Promise((resolve) => {
         modalPromiseResolve = resolve
         if (!type) type = 'alert'
         dispatch(openModal({ type, placeholder }))
      })

      dispatch(closeModal())
      return input
   } catch (error) {
      dispatch(closeModal())
      return rejectWithValue(error.message)
   }
})

const slice = createSlice({
   name: 'modal',
   initialState: {
      input: '',
      placeholder: '',
      type: '',
   },
   reducers: {
      closeModal: (state) => {
         state.type = ''
         state.placeholder = ''
         state.input = ''

         if (modalPromiseResolve) {
            // modalPromiseResolve(new Error('Modal was cancled'))
            modalPromiseResolve = null
         }
      },
      openModal: (state, action) => {
         const { type, placeholder } = action.payload
         state.placeholder = placeholder
         state.type = type
         state.input = ''
      },
      getInput: (state, action) => {
         state.input = action.payload

         if (modalPromiseResolve) {
            modalPromiseResolve(action.payload)
            modalPromiseResolve = null
         }
      },
   },
})

export const { closeModal, openModal, getInput } = slice.actions
export default slice.reducer
