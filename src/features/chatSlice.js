import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as chatApi from '../api/chatApi'

// 1. 내 채팅방 목록 불러오기
export const fetchMyChatsThunk = createAsyncThunk('chat/fetchMyChats', async (_, { rejectWithValue }) => {
   try {
      return await chatApi.fetchMyChats()
   } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
   }
})

// 2. 특정 채팅방 메시지 불러오기
export const fetchChatMessagesThunk = createAsyncThunk('chat/fetchMessages', async (chatId, { rejectWithValue }) => {
   try {
      const { messages = [] } = await chatApi.fetchChatMessages(chatId)
      return { chatId, messages }
   } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
   }
})

// 3. 채팅방 생성
export const createChatRoomThunk = createAsyncThunk('chat/createRoom', async (chatData, { rejectWithValue }) => {
   try {
      return await chatApi.createChatRoom(chatData)
   } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
   }
})

// 4. 메시지 전송
export const sendMessageThunk = createAsyncThunk('chat/sendMessage', async ({ chatId, content }, { rejectWithValue }) => {
   try {
      const { message } = await chatApi.sendMessage(chatId, content)
      return { chatId, message }
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
      unreadCountByChatId: {}, // 채팅방별 읽지 않은 메시지 수
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
      addLocalMessage(state, action) {
         const { chatId, message } = action.payload
         if (!state.messagesByChatId[chatId]) {
            state.messagesByChatId[chatId] = []
         }
         state.messagesByChatId[chatId].push(message)
         // 메시지 정렬 (생성일자 기준 오름차순)
         state.messagesByChatId[chatId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      },
      removeLocalMessage(state, action) {
         const { chatId, messageId } = action.payload
         if (state.messagesByChatId[chatId]) {
            state.messagesByChatId[chatId] = state.messagesByChatId[chatId].filter((msg) => msg.id !== messageId)
         }
      },
      incrementUnreadCount(state, action) {
         const chatId = action.payload
         if (!state.unreadCountByChatId[chatId]) {
            state.unreadCountByChatId[chatId] = 0
         }
         state.unreadCountByChatId[chatId] += 1
      },
      resetUnreadCount(state, action) {
         const chatId = action.payload
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
         .addCase(fetchMyChatsThunk.fulfilled, (state, action) => {
            state.loadingChats = false
            state.chats = action.payload.chats
         })
         .addCase(fetchMyChatsThunk.rejected, (state, action) => {
            state.loadingChats = false
            state.loadingChatsError = action.payload
         })

         // 채팅방 메시지
         .addCase(fetchChatMessagesThunk.pending, (state) => {
            state.loadingMessages = true
            state.loadingMessagesError = null
         })
         .addCase(fetchChatMessagesThunk.fulfilled, (state, action) => {
            state.loadingMessages = false
            const { chatId, messages } = action.payload
            state.messagesByChatId[chatId] = messages
            // 메시지 정렬
            state.messagesByChatId[chatId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            // 메시지 로드했으니 읽음 처리
            state.unreadCountByChatId[chatId] = 0
         })
         .addCase(fetchChatMessagesThunk.rejected, (state, action) => {
            state.loadingMessages = false
            state.loadingMessagesError = action.payload
         })

         // 채팅방 생성
         .addCase(createChatRoomThunk.fulfilled, (state, action) => {
            const newChat = action.payload
            if (!state.chats.find((c) => c.id === newChat.id)) {
               state.chats.push(newChat)
            }
         })
         .addCase(createChatRoomThunk.rejected, (state, action) => {
            state.error = action.payload
         })

         // 메시지 전송
         .addCase(sendMessageThunk.pending, (state) => {
            state.sendingMessage = true
            state.sendMessageError = null
         })
         .addCase(sendMessageThunk.fulfilled, (state, action) => {
            state.sendingMessage = false
            const { chatId, message } = action.payload
            if (!state.messagesByChatId[chatId]) {
               state.messagesByChatId[chatId] = []
            }
            state.messagesByChatId[chatId].push(message)
            // 메시지 정렬
            state.messagesByChatId[chatId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
         })
         .addCase(sendMessageThunk.rejected, (state, action) => {
            state.sendingMessage = false
            state.sendMessageError = action.payload
         })
   },
})

export const { clearLoadingChatsError, clearLoadingMessagesError, clearSendMessageError, addLocalMessage, removeLocalMessage, incrementUnreadCount, resetUnreadCount } = chatSlice.actions
export default chatSlice.reducer
