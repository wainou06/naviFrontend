import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as chatApi from '../api/chatApi'

// 1. 내 채팅방 목록
export const fetchMyChatsThunk = createAsyncThunk('chat/fetchMyChats', async (_, { rejectWithValue }) => {
   try {
      const res = await chatApi.fetchMyChats()
      return res.chats
   } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
   }
})

// 2. 채팅방 생성
export const createChatRoomThunk = createAsyncThunk('chat/createRoom', async ({ itemId, sellerId }, { rejectWithValue }) => {
   try {
      const res = await chatApi.createChatRoom({ itemId, sellerId })
      return res.chat
   } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
   }
})

// 3. 채팅방 메시지 불러오기
export const fetchChatMessagesThunk = createAsyncThunk('chat/fetchMessages', async (chatId, { rejectWithValue }) => {
   try {
      const res = await chatApi.fetchChatMessages(chatId)
      return { chatId, messages: res.messages || [] }
   } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
   }
})

// 4. 메시지 전송
export const sendMessageThunk = createAsyncThunk('chat/sendMessage', async ({ chatId, content }, { rejectWithValue }) => {
   try {
      const res = await chatApi.sendMessage(chatId, content)
      return { chatId, message: res.message }
   } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
   }
})

const chatSlice = createSlice({
   name: 'chat',
   initialState: {
      chats: [],
      messagesByChatId: {},
      loadingChats: false,
      loadingMessages: false,
      sendingMessage: false,
      loadingChatsError: null,
      loadingMessagesError: null,
      sendMessageError: null,
      createChatError: null,
      unreadCountByChatId: {},
   },
   reducers: {
      clearLoadingChatsError(state) {
         state.loadingChatsError = null
      },
      clearLoadingMessagesError(state) {
         state.loadingMessagesError = null
      },
      clearSendMessageError(state) {
         state.sendMessageError = null
      },
      clearCreateChatError(state) {
         state.createChatError = null
      },

      addLocalMessage(state, { payload: { chatId, message } }) {
         if (!state.messagesByChatId[chatId]) state.messagesByChatId[chatId] = []
         state.messagesByChatId[chatId].push(message)
         state.messagesByChatId[chatId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      },

      removeLocalMessage(state, { payload: { chatId, messageId } }) {
         if (state.messagesByChatId[chatId]) {
            state.messagesByChatId[chatId] = state.messagesByChatId[chatId].filter((m) => m.id !== messageId)
         }
      },

      incrementUnreadCount(state, { payload: chatId }) {
         state.unreadCountByChatId[chatId] = (state.unreadCountByChatId[chatId] || 0) + 1
      },

      resetUnreadCount(state, { payload: chatId }) {
         state.unreadCountByChatId[chatId] = 0
      },
   },

   extraReducers: (builder) => {
      builder
         // 채팅방 목록
         .addCase(fetchMyChatsThunk.pending, (state) => {
            state.loadingChats = true
            state.loadingChatsError = null
         })
         .addCase(fetchMyChatsThunk.fulfilled, (state, { payload }) => {
            state.loadingChats = false
            state.chats = payload
         })
         .addCase(fetchMyChatsThunk.rejected, (state, { payload }) => {
            state.loadingChats = false
            state.loadingChatsError = payload
         })

         // 채팅방 생성
         .addCase(createChatRoomThunk.pending, (state) => {
            state.createChatError = null
         })
         .addCase(createChatRoomThunk.fulfilled, (state, { payload }) => {
            if (!state.chats.find((c) => c.id === payload.id)) state.chats.push(payload)
            if (!state.messagesByChatId[payload.id]) state.messagesByChatId[payload.id] = payload.messages || []
         })
         .addCase(createChatRoomThunk.rejected, (state, { payload }) => {
            state.createChatError = payload
         })

         // 채팅방 메시지
         .addCase(fetchChatMessagesThunk.pending, (state) => {
            state.loadingMessages = true
            state.loadingMessagesError = null
         })
         .addCase(fetchChatMessagesThunk.fulfilled, (state, { payload }) => {
            state.loadingMessages = false
            state.messagesByChatId[payload.chatId] = payload.messages
            state.messagesByChatId[payload.chatId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            state.unreadCountByChatId[payload.chatId] = 0
         })
         .addCase(fetchChatMessagesThunk.rejected, (state, { payload }) => {
            state.loadingMessages = false
            state.loadingMessagesError = payload
         })

         // 메시지 전송
         .addCase(sendMessageThunk.pending, (state) => {
            state.sendingMessage = true
            state.sendMessageError = null
         })
         .addCase(sendMessageThunk.fulfilled, (state, { payload }) => {
            state.sendingMessage = false
            if (!state.messagesByChatId[payload.chatId]) state.messagesByChatId[payload.chatId] = []
            state.messagesByChatId[payload.chatId].push(payload.message)
            state.messagesByChatId[payload.chatId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
         })
         .addCase(sendMessageThunk.rejected, (state, { payload }) => {
            state.sendingMessage = false
            state.sendMessageError = payload
         })
   },
})

export const { clearLoadingChatsError, clearLoadingMessagesError, clearSendMessageError, clearCreateChatError, addLocalMessage, removeLocalMessage, incrementUnreadCount, resetUnreadCount } = chatSlice.actions

export default chatSlice.reducer
