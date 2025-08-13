import { createSelector } from 'reselect'

// 기본 state 슬라이스 접근자
const selectChatState = (state) => state.chat

// 채팅방별 메시지 객체
const selectMessagesByChatId = createSelector([selectChatState], (chat) => chat.messagesByChatId)

// messages 배열을 chatId로 반환하는 셀렉터 생성 함수
export const makeSelectMessagesForChat = () => createSelector([selectMessagesByChatId, (_, chatId) => chatId], (messagesByChatId, chatId) => messagesByChatId[chatId] || [])

// 단순 값 추출용 셀렉터는 createSelector 쓰지 않고 함수로 작성
export const selectIsSending = (state) => state.chat.sendingMessage
