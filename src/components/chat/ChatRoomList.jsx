import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyChatsThunk } from '../../features/chatSlice'
import ChatForm from './ChatForm'

const ChatRoomList = () => {
   const dispatch = useDispatch()
   const user = useSelector((state) => state.auth.user)
   const chats = useSelector((state) => state.chat.chats || [])
   const [selectedChatId, setSelectedChatId] = useState(null)

   useEffect(() => {
      if (user) dispatch(fetchMyChatsThunk())
   }, [dispatch, user])

   useEffect(() => {
      if (chats.length > 0 && !selectedChatId) {
         setSelectedChatId(chats[0].id)
      }
   }, [chats, selectedChatId])

   if (!user) return <div style={{ padding: 20, textAlign: 'center', color: '#555' }}>로그인이 필요합니다.</div>

   if (chats.length === 0)
      return (
         <div
            style={{
               flex: 1,
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               fontSize: '1.2rem',
               color: '#999',
               fontStyle: 'italic',
               height: '100%',
            }}
         >
            채팅방이 없습니다.
         </div>
      )

   return (
      <div
         style={{
            display: 'flex',
            height: '600px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
         }}
      >
         {/* 채팅방 리스트 */}
         <div
            style={{
               width: '250px',
               borderRight: '1px solid #ddd',
               overflowY: 'auto',
               backgroundColor: '#fafafa',
            }}
         >
            <h3
               style={{
                  padding: '12px',
                  borderBottom: '1px solid #ddd',
                  fontWeight: '600',
                  backgroundColor: '#f5f5f5',
                  margin: 0,
               }}
            >
               내 채팅방
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
               {chats.map((chat) => {
                  const participants = chat.participants || []
                  const isSelected = chat.id === selectedChatId
                  return (
                     <li
                        key={chat.id}
                        onClick={() => setSelectedChatId(chat.id)}
                        style={{
                           padding: '12px',
                           cursor: 'pointer',
                           backgroundColor: isSelected ? '#e5e7eb' : 'transparent',
                           fontWeight: isSelected ? '700' : 'normal',
                           transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                           if (!isSelected) e.currentTarget.style.backgroundColor = '#f3f4f6'
                        }}
                        onMouseLeave={(e) => {
                           if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                     >
                        {participants
                           .filter((p) => p.id !== user.id)
                           .map((p) => p.name || p.nick || '익명')
                           .join(', ') || '알 수 없는 상대'}
                     </li>
                  )
               })}
            </ul>
         </div>

         {/* 채팅방 내용 */}
         <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>{selectedChatId ? <ChatForm chatId={selectedChatId} currentUserId={user.id} /> : <div style={{ margin: 'auto', color: '#6b7280' /* gray-500 */ }}>채팅방을 선택하세요.</div>}</div>
      </div>
   )
}

export default ChatRoomList
