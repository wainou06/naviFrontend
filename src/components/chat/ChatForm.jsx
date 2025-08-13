import { useEffect, useRef, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { sendMessageThunk, addLocalMessage, removeLocalMessage } from '../../features/chatSlice'
import { v4 as uuidv4 } from 'uuid'
import { makeSelectMessagesForChat, selectIsSending } from './ChatSelectors'

const ChatForm = ({ chatId, currentUserId }) => {
   const [content, setContent] = useState('')
   const dispatch = useDispatch()

   // 팩토리 셀렉터 생성 (메시지 배열)
   const selectMessagesForChat = useMemo(makeSelectMessagesForChat, [])
   const messages = useSelector((state) => selectMessagesForChat(state, chatId))

   // 단순 값 추출 셀렉터
   const isSending = useSelector(selectIsSending)

   // 메시지 리스트 컨테이너 ref
   const messagesEndRef = useRef(null)

   const scrollToBottom = () => {
      if (messagesEndRef.current) {
         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
   }

   // 메시지가 변경될 때마다 스크롤을 최하단으로
   useEffect(() => {
      scrollToBottom()
   }, [messages])

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!content.trim()) return

      const tempMessage = {
         id: uuidv4(),
         chatId,
         senderId: currentUserId,
         content,
         createdAt: new Date().toISOString(),
         mine: true,
         pending: true,
      }

      dispatch(addLocalMessage({ chatId, message: tempMessage }))
      setContent('')

      try {
         await dispatch(sendMessageThunk({ chatId, content })).unwrap()
      } catch (error) {
         console.error('메시지 전송 실패:', error)
         dispatch(removeLocalMessage({ chatId, messageId: tempMessage.id }))
         alert('메시지 전송에 실패했습니다. 다시 시도해주세요.')
      }
   }

   return (
      <div className="flex flex-col h-full">
         {/* 메시지 리스트 */}
         <div className="flex-1 overflow-y-auto p-4 border-b">
            {messages.length === 0 ? (
               <p className="text-center text-gray-500">아직 메시지가 없습니다.</p>
            ) : (
               messages.map((msg) => (
                  <div key={msg.id} className={`mb-2 max-w-xs px-3 py-2 rounded ${msg.mine ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-800 self-start'}`} style={{ opacity: msg.pending ? 0.6 : 1 }}>
                     <p>{msg.content}</p>
                     <small className="block text-xs mt-1 text-gray-300">{new Date(msg.createdAt).toLocaleTimeString()}</small>
                  </div>
               ))
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* 입력 폼 */}
         <form onSubmit={handleSubmit} className="flex gap-2 p-2 border-t">
            <input type="text" className="flex-1 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400" placeholder="메시지를 입력하세요..." value={content} onChange={(e) => setContent(e.target.value)} disabled={isSending} />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-600 transition-colors duration-200" disabled={!content.trim() || isSending}>
               전송
            </button>
         </form>
      </div>
   )
}

export default ChatForm
