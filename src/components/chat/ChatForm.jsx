// ChatForm.jsx
import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { addLocalMessage } from '../../features/chatSlice'
import { fetchChatMessages, sendMessage } from '../../api/chatApi'

const SOCKET_SERVER_URL = import.meta.env.VITE_APP_SOCKET_SERVER_URL || import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'

const ChatForm = ({ chatId, currentUserId }) => {
   const [messages, setMessages] = useState([])
   const [newMessage, setNewMessage] = useState('')
   const messagesEndRef = useRef(null)
   const socketRef = useRef(null)
   const dispatch = useDispatch()

   // 초기 메시지 불러오기
   useEffect(() => {
      if (!chatId) return
      setMessages([])

      fetchChatMessages(chatId)
         .then((data) => setMessages(data.messages || []))
         .catch((err) => console.error('메시지 불러오기 실패:', err))
   }, [chatId])

   // Socket.io 연결
   useEffect(() => {
      if (!chatId || !currentUserId) return

      socketRef.current?.disconnect()
      const socket = io(SOCKET_SERVER_URL, { auth: { chatId, userId: currentUserId }, withCredentials: true })
      socketRef.current = socket

      socket.on('connect', () => console.log('Socket connected:', socket.id))
      socket.on('receiveMessage', (msg) => {
         setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]))
         dispatch(addLocalMessage({ chatId, message: msg }))
      })
      socket.on('disconnect', () => console.log('Socket disconnected'))

      return () => socket.disconnect()
   }, [chatId, currentUserId, dispatch])

   // 자동 스크롤
   useLayoutEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
   }, [messages])

   // 메시지 전송
   const handleSend = async () => {
      const trimmed = newMessage.trim()
      if (!trimmed || !chatId) return

      const tempId = `temp-${Date.now()}`
      const tempMessage = { id: tempId, content: trimmed, senderId: currentUserId }

      setMessages((prev) => [...prev, tempMessage])
      setNewMessage('')

      try {
         const res = await sendMessage(chatId, trimmed)
         const savedMessage = res.message
         setMessages((prev) => prev.map((m) => (m.id === tempId ? savedMessage : m)))
         dispatch(addLocalMessage({ chatId, message: savedMessage }))
      } catch (err) {
         console.error('메시지 전송 실패:', err)
      }
   }

   return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
         <div style={{ flexGrow: 1, overflowY: 'auto', padding: '12px' }}>
            {messages.map((msg) => (
               <div key={msg.id} style={{ display: 'flex', justifyContent: msg.senderId === currentUserId ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
                  <div style={{ backgroundColor: msg.senderId === currentUserId ? '#3b82f6' : '#e5e7eb', color: msg.senderId === currentUserId ? '#fff' : '#000', padding: '8px 12px', borderRadius: '12px', maxWidth: '70%', wordBreak: 'break-word' }}>{msg.content}</div>
               </div>
            ))}
            <div ref={messagesEndRef} />
         </div>

         <div style={{ display: 'flex', borderTop: '1px solid #ddd', padding: '8px' }}>
            <input
               type="text"
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
               placeholder="메시지를 입력하세요..."
               style={{ flexGrow: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
               aria-label="메시지 입력"
            />
            <button onClick={handleSend} style={{ marginLeft: '8px', padding: '8px 12px', borderRadius: '6px', backgroundColor: '#3b82f6', color: '#fff', border: 'none' }} aria-label="메시지 전송">
               전송
            </button>
         </div>
      </div>
   )
}

export default ChatForm
