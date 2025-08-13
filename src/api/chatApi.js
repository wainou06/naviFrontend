import naviApi from './axiosApi' // axios 인스턴스

// 1. 내 채팅방 목록 조회
export async function fetchMyChats() {
   try {
      const response = await naviApi.get('/chats', { withCredentials: true })
      return response.data
   } catch (error) {
      console.error('채팅방 목록 조회 실패:', error.response?.data || error.message)
      throw error
   }
}

// 2. 특정 채팅방 메시지 조회
export async function fetchChatMessages(chatId) {
   try {
      const response = await naviApi.get(`/chats/${chatId}/messages`, { withCredentials: true })
      return response.data // { messages: [...] }
   } catch (error) {
      console.error('메시지 조회 실패:', error.response?.data || error.message)
      throw error
   }
}

// 3. 채팅방 생성 (이미 있으면 기존 채팅방 반환)
export async function createChatRoom(chatData) {
   try {
      // 여기 경로를 /chats/create 로 수정
      const response = await naviApi.post('/chats/create', chatData, { withCredentials: true })
      return response.data
   } catch (error) {
      console.error('채팅방 생성 실패:', error.response?.data || error.message)
      throw error
   }
}

// 4. 메시지 전송
export async function sendMessage(chatId, content) {
   try {
      const response = await naviApi.post(`/chats/${chatId}/message`, { content }, { withCredentials: true })
      return response.data // { message: {...} }
   } catch (error) {
      console.error('메시지 전송 실패:', error.response?.data || error.message)
      throw error
   }
}
