// ChatForm.jsx
import SendIcon from '@mui/icons-material/Send'

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

   // Socket.io 연결 및 방(join) 이벤트
   useEffect(() => {
      if (!chatId || !currentUserId) return

      socketRef.current?.disconnect()
      const socket = io(SOCKET_SERVER_URL, { auth: { chatId, userId: currentUserId }, withCredentials: true })
      socketRef.current = socket

      socket.on('connect', () => {
         socket.emit('joinChat', chatId) // 🔑 방 입장
      })

      socket.on('receiveMessage', (msg) => {
         setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]))
         dispatch(addLocalMessage({ chatId, message: msg }))
      })

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
      const tempMessage = { id: tempId, content: trimmed, senderId: currentUserId, chatId, createdAt: new Date().toISOString() }

      setMessages((prev) => [...prev, tempMessage])
      setNewMessage('')

      // 1️⃣ 소켓으로 실시간 전송
      socketRef.current.emit('sendMessage', tempMessage)

      try {
         // 2️⃣ API로 저장
         const res = await sendMessage(chatId, trimmed)
         const savedMessage = res.message
         setMessages((prev) => prev.map((m) => (m.id === tempId ? savedMessage : m)))
         dispatch(addLocalMessage({ chatId, message: savedMessage }))
      } catch (err) {
         console.error('메시지 전송 실패:', err)
      }
   }

   return (
      <div className="messageroom">
         <div className="messagelist">
            {messages.map((msg) => (
               <div
                  key={msg.id}
                  className="messagebox"
                  style={{
                     alignItems: msg.senderId === currentUserId ? 'flex-end' : 'flex-start',
                  }}
               >
                  <div
                     style={{
                        backgroundColor: msg.senderId === currentUserId ? '#FFD1BA' : '#FAF0E6',
                     }}
                     className="messagetext"
                  >
                     {msg.content}
                  </div>
                  <div className="messagetime">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
               </div>
            ))}
            <div ref={messagesEndRef} />
         </div>

         <div className="entermessage">
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} placeholder="메시지를 입력하세요..." aria-label="메시지 입력" />
            <button onClick={handleSend} aria-label="메시지 전송">
               <SendIcon />
            </button>
         </div>
      </div>
   )
}

export default ChatForm
