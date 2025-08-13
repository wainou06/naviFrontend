// src/hooks/useSocket.js
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { addLocalMessage } from '../features/chatSlice'

const SOCKET_SERVER_URL = import.meta.env.VITE_APP_SOCKET_SERVER_URL || 'http://localhost:4000'

export default function useSocket(currentUserId) {
   const dispatch = useDispatch()

   useEffect(() => {
      if (!currentUserId) return // 로그인 안 됐으면 연결 안 함

      const socket = io(SOCKET_SERVER_URL, {
         query: { userId: currentUserId },
      })

      socket.on('connect', () => {
         console.log('Socket connected:', socket.id)
      })

      socket.on('receiveProposalAccepted', (data) => {
         dispatch(addLocalMessage({ chatId: data.chatId, message: data.message }))
      })

      socket.on('disconnect', () => {
         console.log('Socket disconnected')
      })

      return () => {
         socket.disconnect()
      }
   }, [dispatch, currentUserId])
}
