import { createContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_SERVER_URL } from '../constants/socketUrl'

const SocketContext = createContext(null)

export const SocketProvider = ({ userId, children }) => {
   const socketRef = useRef(null)

   useEffect(() => {
      if (!userId) return

      if (!socketRef.current) {
         socketRef.current = io(SOCKET_SERVER_URL)
         socketRef.current.emit('user_connected', userId)
         socketRef.current.on('connect', () => console.log('Socket connected:', socketRef.current.id))
         socketRef.current.on('disconnect', () => console.log('Socket disconnected'))
      }

      return () => {
         socketRef.current?.disconnect()
         socketRef.current = null
      }
   }, [userId])

   return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>
}

export default SocketContext
