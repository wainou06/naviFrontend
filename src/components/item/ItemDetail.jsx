import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { updateProposalStatusThunk } from '../../features/priceProposalSlice'
import { fetchMyChatsThunk, createChatRoomThunk } from '../../features/chatSlice'
import '../../styles/itemDetail.css'
import ChatForm from '../chat/ChatForm'

const ItemDetail = ({ onDeleteSubmit, onPriceProposal, onEditSubmit }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const location = useLocation()

   const { currentItem, loading, error } = useSelector((state) => state.items)
   const { user } = useSelector((state) => state.auth)
   const proposals = useSelector((state) => state.priceProposal.proposals)
   const chats = useSelector((state) => state.chat.chats)

   const [localItem, setLocalItem] = useState(null)
   const [selectedImage, setSelectedImage] = useState(0)
   const [deliveryMethod, setDeliveryMethod] = useState('직거래')
   const [priceProposal, setPriceProposal] = useState('')
   const [showPriceModal, setShowPriceModal] = useState(false)

   // 채팅방 ID 상태
   const [chatId, setChatId] = useState(null)

   const [searchParams] = useSearchParams()
   const chatUserId = searchParams.get('chatUser')

   useEffect(() => {
      if (currentItem) {
         setLocalItem(currentItem)
         setSelectedImage(0)
      } else {
         setLocalItem(null)
      }
   }, [currentItem])

   useEffect(() => {
      if (!localItem || !Array.isArray(localItem.imgs) || localItem.imgs.length === 0) {
         setSelectedImage(0)
      } else if (selectedImage >= localItem.imgs.length) {
         setSelectedImage(0)
      }
   }, [localItem, selectedImage])

   useEffect(() => {
      if (user) {
         dispatch(fetchMyChatsThunk())
      }
   }, [dispatch, user])

   // chatUserId 변경 및 관련 상태 변경 시 채팅방 설정 로직
   useEffect(() => {
      console.log('=== chatUserId, user, localItem, chats 상태 확인 ===')
      console.log('chatUserId:', chatUserId)
      console.log('user:', user)
      console.log('localItem:', localItem)
      console.log('chats:', chats)

      // 필수 조건 없으면 초기화
      if (!chatUserId || !user) {
         setChatId(null)
         return
      }

      // 자기 자신에게 채팅 못 하도록 처리
      if (chatUserId === user.id.toString()) {
         setChatId(null)
         return
      }

      if (!localItem?.id) {
         setChatId(null)
         return
      }

      // 기존 채팅방 검색
      const existingChat = Array.isArray(chats) ? chats.find((chat) => Array.isArray(chat.participants) && chat.participants.some((p) => p?.id?.toString() === chatUserId)) : null

      console.log('existingChat:', existingChat)

      if (existingChat) {
         setChatId(existingChat.id)
      } else {
         // 새 채팅방 생성 시 sellerId가 맞는지 API 확인 필요
        dispatch(
           createChatRoomThunk({
              itemId: localItem.id,
              sellerId: chatUserId,
           })
        )
           .unwrap()
           .then((newChat) => {
              if (!newChat?.chat?.id) {
                 console.error('채팅방 id가 없습니다!')
                 setChatId(null)
                 return
              }
              setChatId(newChat.chat.id)
           })
           .catch((err) => {
              console.error('채팅방 생성 실패:', err)
              setChatId(null)
           })

      }
   }, [chatUserId, chats, user, dispatch, localItem])

   const isOwner = user && localItem && user.id === localItem.userId

   const handleDelete = () => {
      if (window.confirm('정말로 이 아이템을 삭제하시겠습니까?')) {
         onDeleteSubmit()
      }
   }

   const handleEdit = () => {
      onEditSubmit()
   }

   const handlePriceProposal = () => {
      if (!priceProposal || Number(priceProposal) <= 0) {
         alert('올바른 가격을 입력해주세요.')
         return
      }

      if (!localItem) {
         alert('상품 정보가 없습니다.')
         return
      }

      const proposalData = {
         itemId: localItem.id,
         proposedPrice: Number(priceProposal),
         deliveryMethod,
      }

      onPriceProposal(proposalData)
      setShowPriceModal(false)
      setPriceProposal('')
   }

   const formatPrice = (price) => {
      return price ? price.toLocaleString() + '원' : '-'
   }

   const handleProposalStatusChange = async (proposalId, status) => {
      try {
         const result = await dispatch(updateProposalStatusThunk({ proposalId, status })).unwrap()

         if (result.updatedProposal) {
            const updatedItemSellStatus = result.updatedProposal.item?.itemSellStatus
            const prevItemSellStatus = localItem?.itemSellStatus || 'SELL'

            setLocalItem((prev) => ({
               ...prev,
               itemSellStatus: updatedItemSellStatus || prevItemSellStatus,
            }))

            if (status === 'accepted') {
               if (result.updatedProposal.user?.id) {
                  const searchParams = new URLSearchParams(location.search)
                  searchParams.set('chatUser', result.updatedProposal.user.id)
                  navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true })
               }
            }
         }
      } catch (error) {
         alert('상태 변경 실패: ' + (error.message || error))
      }
   }

   if (loading) return <div className="loading">로딩중...</div>
   if (error) return <div className="error">오류: {error}</div>
   if (!localItem) return <div className="not-found">상품을 찾을 수 없습니다.</div>

   const baseURL = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '')
   const currentImg = Array.isArray(localItem.imgs) && localItem.imgs[selectedImage]
   const rawImgUrl = currentImg?.imgUrl || ''
   const cleanImgUrl = rawImgUrl.replace(/\\/g, '/').replace(/^\/+/, '')
   const fullImgUrl = cleanImgUrl ? `${baseURL}/${cleanImgUrl}` : null

   return (
      <div className="item-detail-container">
         <div className="item-detail-content">
            {/* 이미지 섹션 */}
            <div className="image-section">
               <div className="main-image">{fullImgUrl ? <img src={fullImgUrl} alt={localItem.itemNm} className="main-img" /> : <div className="no-image">이미지가 없습니다.</div>}</div>
               {/* 썸네일 이미지 목록 */}
               {Array.isArray(localItem.imgs) && localItem.imgs.length > 1 && (
                  <div className="thumbnail-list">
                     {localItem.imgs.map((img, idx) => {
                        const thumbUrl = img.imgUrl.replace(/\\/g, '/').replace(/^\/+/, '')
                        return <img key={idx} src={`${baseURL}/${thumbUrl}`} alt={`상품 이미지 ${idx + 1}`} className={`thumbnail ${selectedImage === idx ? 'selected' : ''}`} onClick={() => setSelectedImage(idx)} />
                     })}
                  </div>
               )}
            </div>

            {/* 상품 정보 섹션 */}
            <div className="info-section">
               <div className="item-header">
                  <h1 className="item-title">{localItem.itemNm}</h1>
                  <div className="item-status">
                     <span className={`status-badge ${localItem.itemSellStatus?.toLowerCase()}`}>
                        {localItem.itemSellStatus === 'SELL' && '판매중'}
                        {localItem.itemSellStatus === 'SOLD_OUT' && '판매완료'}
                        {localItem.itemSellStatus === 'ON_SALE' && '예약중'}
                     </span>
                  </div>
               </div>

               <div className="price-section">
                  <div className="current-price">
                     <span className="price-label">판매가</span>
                     <span className="price">{formatPrice(localItem.price)}</span>
                  </div>
               </div>

               {/* 구매방법 선택 */}
               <div className="delivery-section">
                  <h3>구매 방법</h3>
                  <div className="delivery-options">
                     {['택배', '직거래', '기타'].map((method) => (
                        <label key={method} className="delivery-option">
                           <input type="radio" name="delivery" value={method} checked={deliveryMethod === method} onChange={(e) => setDeliveryMethod(e.target.value)} />
                           <span>{method}</span>
                        </label>
                     ))}
                  </div>
               </div>

               {/* 버튼 섹션 */}
               <div className="action-section">
                  {isOwner ? (
                     <div className="owner-buttons">
                        <button className="edit-btn" onClick={handleEdit}>
                           수정하기
                        </button>
                        <button className="delete-btn" onClick={handleDelete}>
                           삭제하기
                        </button>
                     </div>
                  ) : (
                     <div className="buyer-buttons">
                        <button className="price-proposal-btn" onClick={() => setShowPriceModal(true)} disabled={localItem.itemSellStatus === 'SOLD_OUT'}>
                           가격 제안하기
                        </button>
                     </div>
                  )}
               </div>

               {/* 가격 제안 모달 */}
               {showPriceModal && (
                  <div className="modal-overlay" onClick={() => setShowPriceModal(false)}>
                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                           <h3>가격 제안</h3>
                           <button className="modal-close" onClick={() => setShowPriceModal(false)}>
                              ×
                           </button>
                        </div>
                        <div className="modal-body">
                           <div className="price-input-section">
                              <label>제안 가격</label>
                              <input type="number" value={priceProposal} onChange={(e) => setPriceProposal(e.target.value)} placeholder="가격을 입력하세요" className="price-input" min="1" />
                              <span className="currency">원</span>
                           </div>
                           <div className="delivery-info">
                              <span>
                                 선택된 구매방법: <strong>{deliveryMethod}</strong>
                              </span>
                           </div>
                           <div className="proposal-note">
                              <p>판매자가 등록한 게시자 보다 가격을 높게 할 수 있습니다. 판매자가 제안을 수락하면 시스템에서 이메일로 알려줍니다.</p>
                           </div>
                        </div>
                        <div className="modal-footer">
                           <button className="submit-proposal-btn" onClick={handlePriceProposal}>
                              제안하기
                           </button>
                        </div>
                     </div>
                  </div>
               )}

               {/* 키워드 섹션 */}
               {localItem.ItemKeywords && localItem.ItemKeywords.length > 0 && (
                  <div className="keywords-section">
                     <h3>관련 키워드</h3>
                     <div className="keywords">
                        {localItem.ItemKeywords.map((itemKeyword, index) => (
                           <span key={index} className="keyword-tag">
                              #{itemKeyword.Keyword?.name || ''}
                           </span>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* 가격 제안 현황 (판매자만 볼 수 있음) */}
         {isOwner && (
            <div className="price-proposals-section">
               <h2>가격 제안 Price Proposal</h2>
               <div className="proposals-list">
                  {proposals.filter((proposal) => proposal.status !== 'rejected').length === 0 ? (
                     <p>제안된 가격이 없습니다.</p>
                  ) : (
                     proposals
                        .filter((proposal) => proposal.status !== 'rejected')
                        .map((proposal) => (
                           <div key={proposal.id} className="proposal-card">
                              <div className="proposal-price">{proposal.price ? proposal.price.toLocaleString() : '-'}원</div>
                              <div className="proposal-user">
                                 <img src={proposal.userAvatar || '/default-avatar.png'} alt={proposal.userName || '사용자'} className="user-avatar" />
                                 <span>{proposal.userName || '익명'}</span>
                              </div>
                              <div className="proposal-actions">
                                 {proposal.status === 'pending' && (
                                    <>
                                       <button onClick={() => handleProposalStatusChange(proposal.id, 'accepted')} className="btn-accept">
                                          수락
                                       </button>
                                       <button onClick={() => handleProposalStatusChange(proposal.id, 'rejected')} className="btn-reject">
                                          거절
                                       </button>
                                    </>
                                 )}
                                 {proposal.status === 'accepted' && <span className="status accepted">수락됨</span>}
                              </div>
                           </div>
                        ))
                  )}
               </div>
            </div>
         )}

         {/* 채팅폼은 chatId가 있을 때만 렌더링 */}
         {chatId && chatUserId && user && <ChatForm chatId={chatId} currentUserId={user.id} />}
      </div>
   )
}

export default ItemDetail
