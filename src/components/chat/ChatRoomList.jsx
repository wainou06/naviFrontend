// ChatRoomList.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyChatsThunk } from '../../features/chatSlice'
import ChatForm from './ChatForm'

const ChatRoomList = ({ initialSelectedChatId = null }) => {
   const dispatch = useDispatch()
   const user = useSelector((state) => state.auth.user)
   const chats = useSelector((state) => state.chat.chats || [])
   const [selectedChatId, setSelectedChatId] = useState(initialSelectedChatId)

   // 로그인 시 채팅 목록 로드
   useEffect(() => {
      if (user) dispatch(fetchMyChatsThunk())
   }, [user, dispatch])

   // 초기 선택 채팅 반영
   useEffect(() => {
      if (initialSelectedChatId) setSelectedChatId(initialSelectedChatId)
   }, [initialSelectedChatId])

   // 채팅 목록 로딩 후 첫 번째 채팅 자동 선택
   useEffect(() => {
      if (!selectedChatId && chats.length > 0) setSelectedChatId(chats[0].id)
   }, [chats, selectedChatId])

   if (!user) return <div className="loginchat">로그인이 필요합니다.</div>
   if (chats.length === 0) return <div className="nonechat">채팅방이 없습니다.</div>

   return (
      <div className="mychat">
         {/* 채팅방 리스트 */}
         <div className="chatlist">
            <h3>내 채팅방</h3>
            <ul>
               {chats.map((chat) => {
                  const participants = chat.participants || []
                  const isSelected = chat.id === selectedChatId
                  return (
                     <li
                        key={chat.id}
                        onClick={() => setSelectedChatId(chat.id)}
                        style={{ backgroundColor: isSelected ? '#f0907f' : 'transparent', fontWeight: isSelected ? '700' : 'normal' }}
                        onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#fff9f6')}
                        onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'transparent')}
                     >
                        {participants
                           .filter((p) => p.id !== user.id)
                           .map((p) => p.nick + '님과의 채팅' || '익명')
                           .join(', ') || '알 수 없는 상대'}
                     </li>
                  )
               })}
            </ul>
         </div>

         {/* 채팅 메시지 영역 */}
         <div className='chatform'>{selectedChatId ? <ChatForm chatId={selectedChatId} currentUserId={user.id} /> : <div className='choosechat'>채팅방을 선택하세요.</div>}</div>
      </div>
   )
}

export default ChatRoomList
