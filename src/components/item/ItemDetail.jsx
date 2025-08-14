import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateProposalStatusThunk } from '../../features/priceProposalSlice'
import { createChatRoomThunk } from '../../features/chatSlice'
import '../../styles/itemDetail.css'

import Modal from '../chat/Modal'
import ChatRoomList from '../chat/ChatRoomList'

const ItemDetail = ({ onDeleteSubmit, onPriceProposal, onEditSubmit }) => {
   const dispatch = useDispatch()

   const { currentItem, loading, error } = useSelector((state) => state.items)
   const { user } = useSelector((state) => state.auth)
   const proposals = useSelector((state) => state.priceProposal.proposals)

   const [localItem, setLocalItem] = useState(null)
   const [selectedImage, setSelectedImage] = useState(0)
   const [deliveryMethod, setDeliveryMethod] = useState('직거래')
   const [priceProposal, setPriceProposal] = useState('')
   const [showPriceModal, setShowPriceModal] = useState(false)
   const [isChatOpen, setIsChatOpen] = useState(false)
   const [newChatId, setNewChatId] = useState(null)

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

   const isOwner = user && localItem && user.id === localItem.userId

   // 매니저 권한 확인
   const isManager = user && user.access === 'MANAGER'

   const handleDelete = () => {
      let confirmMessage = '정말로 이 아이템을 삭제하시겠습니까?'

      // 매니저가 다른 사람의 글을 삭제하는 경우 추가 확인
      if (isManager && !isOwner) {
         confirmMessage = '[관리자 권한] 다른 사용자의 아이템을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.'
      }

      if (window.confirm(confirmMessage)) {
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

   const handleProposalStatusChange = async (proposalId, status, buyerId) => {
      try {
         const result = await dispatch(updateProposalStatusThunk({ proposalId, status })).unwrap()

         if (status === 'accepted') {
            // 채팅방 생성
            const chatRoom = await dispatch(
               createChatRoomThunk({
                  itemId: localItem.id,
                  buyerId,
               })
            ).unwrap()

            setNewChatId(chatRoom.id) // 새 채팅방 ID 저장
            setIsChatOpen(true) // 모달 열기
         }

         // 아이템 상태 업데이트
         if (result.updatedProposal) {
            const updatedItemSellStatus = result.updatedProposal.item?.itemSellStatus
            const prevItemSellStatus = localItem?.itemSellStatus || 'SELL'
            setLocalItem((prev) => ({
               ...prev,
               itemSellStatus: updatedItemSellStatus || prevItemSellStatus,
            }))
         }
      } catch (error) {
         alert('상태 변경 실패: ' + (error.message || error))
      }
   }

   const handleChatClose = () => setIsChatOpen(false)

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
                     {/* 매니저 표시 */}
                     {isManager && !isOwner && <span className="manager-badge">관리자 권한</span>}
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
                  ) : isManager ? (
                     // 매니저이지만 소유자가 아닌 경우
                     <div className="manager-buttons">
                        <button className="delete-btn manager-delete" onClick={handleDelete}>
                           [관리자] 삭제하기
                        </button>
                     </div>
                  ) : (
                     <div className="buyer-buttons">
                        <button className="price-proposal-btn" onClick={() => setShowPriceModal(true)} disabled={localItem.itemSellStatus === 'SOLD_OUT'}>
                           제시하기
                        </button>
                     </div>
                  )}
               </div>

               {/* 주의사항 섹션 */}
               <div className="rental-notice-section">
                  <h3>주의사항</h3>
                  <div className="notice-content">
                     <p>판매자가 등록한 제시가 보다 가격을 높게 부를 수는 없습니다. 판매자가 제안을 승낙할 시, 1:1 채팅이 이루어집니다.</p>
                  </div>
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
               {localItem.ItemKeywords && localItem.ItemKeywords.length > 0 ? (
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
               ) : (
                  <div className="keywords-section">
                     <h3>관련 키워드</h3>
                     <p>키워드가 존재하지 않습니다.</p>
                  </div>
               )}
            </div>
         </div>

         {/* 가격 제안 현황 (판매자나 매니저만 볼 수 있음) */}
         {(isOwner || isManager) && (
            <div className="price-proposals-section">
               <h2>가격 제안 Price Proposal</h2>
               {isManager && !isOwner && <p className="manager-notice">관리자 권한으로 조회 중입니다.</p>}

               <div className="proposals-list">
                  {proposals.filter((p) => p.status !== 'rejected').length === 0 ? (
                     <p>제안된 가격이 없습니다.</p>
                  ) : (
                     proposals
                        .filter((p) => p.status !== 'rejected')
                        .map((proposal) => (
                           <div key={proposal.id} className="proposal-card">
                              <div className="proposal-price">{proposal.price ? proposal.price.toLocaleString() : '-'}원</div>

                              <div className="proposal-user">
                                 <img src={proposal.userAvatar || '/default-avatar.png'} alt={proposal.userName || '사용자'} className="user-avatar" />
                                 <span>{proposal.userName || '익명'}</span>
                              </div>

                              <div className="proposal-actions">
                                 {/* 소유자만 제안 상태 변경 가능 */}
                                 {proposal.status === 'pending' && isOwner && (
                                    <>
                                       <button onClick={() => handleProposalStatusChange(proposal.id, 'accepted', proposal.userId)} className="btn-accept">
                                          수락
                                       </button>
                                       <button onClick={() => handleProposalStatusChange(proposal.id, 'rejected')} className="btn-reject">
                                          거절
                                       </button>
                                    </>
                                 )}

                                 {proposal.status === 'accepted' && <span className="status accepted">수락됨</span>}
                                 {proposal.status === 'rejected' && <span className="status rejected">거절됨</span>}
                                 {proposal.status === 'pending' && !isOwner && <span className="status pending">대기중</span>}
                              </div>
                           </div>
                        ))
                  )}
               </div>
            </div>
         )}

         {/* 상품 이미지 갤러리 */}
         {localItem.imgs && localItem.imgs.length > 0 && (
            <div className="item-gallery-section">
               <h2>상품 상세 Detail</h2>
               <div className="gallery-container">
                  {localItem.imgs.map((img, index) => {
                     const rawPath = img.imgUrl.replace(/\\/g, '/')
                     const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath
                     const fullImgUrl = `${baseURL}/${cleanPath}`

                     return (
                        <div key={index} className="gallery-image-container">
                           <img src={fullImgUrl} alt={`${localItem.itemNm} ${index + 1}`} className="gallery-image" />
                        </div>
                     )
                  })}
               </div>
            </div>
         )}

         {/* 상품 상세 설명 */}
         {localItem.itemDetail && (
            <div className="item-description-section">
               <h2>상세 설명</h2>
               <div className="description-content">
                  <div className="description-text">
                     {localItem.itemDetail.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* 채팅 모달 */}
         <Modal isOpen={isChatOpen} onClose={handleChatClose}>
            <ChatRoomList initialSelectedChatId={newChatId} />
         </Modal>
      </div>
   )
}

export default ItemDetail
