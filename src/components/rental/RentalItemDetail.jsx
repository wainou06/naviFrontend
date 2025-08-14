import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createRentalOrderThunk, fetchRentalOrdersByItemThunk } from '../../features/rentalOrderSlice'
import '../../styles/rentalDetail.css'

const RentalDetail = ({ onDeleteSubmit }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const { rentalOrders, createLoading, createError } = useSelector((state) => state.rentalOrder)
   const { rentalItemDetail, loading, error } = useSelector((state) => state.rental)
   const { user } = useSelector((state) => state.auth)

   const [startDate, setStartDate] = useState('')
   const [endDate, setEndDate] = useState('')
   const [quantity, setQuantity] = useState(1)
   const [showRentalModal, setShowRentalModal] = useState(false)

   const isOwner = user && rentalItemDetail && user.id === rentalItemDetail.userId
   const isManager = user && user.access === 'MANAGER'

   // 컴포넌트가 마운트되면 해당 상품의 렌탈 현황을 불러옴 (소유자나 매니저인 경우)
   useEffect(() => {
      if (rentalItemDetail && (isOwner || isManager)) {
         dispatch(fetchRentalOrdersByItemThunk(rentalItemDetail.id))
      }
   }, [dispatch, rentalItemDetail, isOwner, isManager])

   const handleDelete = () => {
      let confirmMessage = '정말로 이 렌탈 상품을 삭제하시겠습니까?'

      if (isManager && !isOwner) {
         confirmMessage = '[관리자 권한] 다른 사용자의 렌탈 상품을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.'
      }

      if (window.confirm(confirmMessage)) {
         onDeleteSubmit()
      }
   }

   const handleEdit = () => {
      navigate(`/rental/edit/${rentalItemDetail.id}`)
   }

   const handleRental = async () => {
      if (!startDate || !endDate) {
         alert('렌트 시작일과 종료일을 모두 입력해주세요.')
         return
      }

      if (new Date(startDate) >= new Date(endDate)) {
         alert('종료일은 시작일보다 늦어야 합니다.')
         return
      }

      if (new Date(startDate) < new Date()) {
         alert('시작일은 오늘 이후여야 합니다.')
         return
      }

      if (quantity <= 0 || quantity > rentalItemDetail.quantity) {
         alert(`수량은 1개 이상 ${rentalItemDetail.quantity}개 이하로 입력해주세요.`)
         return
      }

      // 렌탈 주문 데이터 구성 (백엔드 API 스펙에 맞춤)
      const rentalOrderData = {
         items: [
            {
               rentalItemId: rentalItemDetail.id,
               quantity: quantity,
            },
         ],
         useStart: startDate,
         useEnd: endDate,
         orderStatus: 'pending',
      }

      try {
         const result = await dispatch(createRentalOrderThunk(rentalOrderData))

         if (createRentalOrderThunk.fulfilled.match(result)) {
            alert('렌탈 주문이 성공적으로 생성되었습니다!')
            setShowRentalModal(false)
            setStartDate('')
            setEndDate('')
            setQuantity(1)

            // 주문 완료 후 상품 정보 새로고침 (재고 업데이트)
            window.location.reload()
         } else {
            alert(result.payload || '렌탈 주문 생성에 실패했습니다.')
         }
      } catch (error) {
         console.error('렌탈 주문 생성 오류:', error)
         alert('렌탈 주문 생성 중 오류가 발생했습니다.')
      }
   }

   const calculateDays = () => {
      if (!startDate || !endDate) return 0
      const start = new Date(startDate)
      const end = new Date(endDate)
      const timeDiff = end.getTime() - start.getTime()
      return Math.ceil(timeDiff / (1000 * 3600 * 24))
   }

   const calculateTotalPrice = () => {
      const days = calculateDays()
      return days * (rentalItemDetail?.oneDayPrice || 0) * quantity
   }

   const formatPrice = (price) => {
      return price?.toLocaleString() + '원'
   }

   if (loading) return <div className="loading">로딩중...</div>
   if (error) return <div className="error">오류: {error}</div>
   if (!rentalItemDetail) return <div className="not-found">렌탈 상품을 찾을 수 없습니다.</div>

   const imgUrl = rentalItemDetail.rentalImgs && rentalItemDetail.rentalImgs[0] ? rentalItemDetail.rentalImgs[0].imgUrl.replace(/\\/g, '/') : null

   const baseURL = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '')
   const imagePath = imgUrl && imgUrl.startsWith('/') ? imgUrl.slice(1) : imgUrl
   const fullImgUrl = imgUrl ? `${baseURL}/${imagePath}` : null

   const today = new Date().toISOString().split('T')[0]

   return (
      <div className="rental-detail-container">
         <div className="rental-detail-content">
            {/* 이미지 섹션 */}
            <div className="image-section">
               <div className="main-image">{fullImgUrl ? <img src={fullImgUrl} alt={rentalItemDetail.rentalItemNm} className="main-img" /> : <div className="no-image">이미지가 없습니다.</div>}</div>
            </div>

            {/* 상품 정보 섹션 */}
            <div className="info-section">
               <div className="item-header">
                  <h1 className="item-title">{rentalItemDetail.rentalItemNm}</h1>
                  <div className="item-status">
                     <span className={`status-badge ${rentalItemDetail.rentalStatus === 'N' || rentalItemDetail.quantity === 0 ? 'n' : rentalItemDetail.rentalStatus === 'Y' ? 'y' : rentalItemDetail.rentalStatus === 'RENTED' ? 'rented' : ''}`}>
                        {rentalItemDetail.quantity === 0 && '렌탈불가'}
                        {rentalItemDetail.quantity > 0 && rentalItemDetail.rentalStatus === 'Y' && '렌탈가능'}
                        {rentalItemDetail.quantity > 0 && rentalItemDetail.rentalStatus === 'N' && '렌탈불가'}
                        {rentalItemDetail.quantity > 0 && rentalItemDetail.rentalStatus === 'RENTED' && '렌탈중'}
                     </span>
                     {isManager && !isOwner && <span className="manager-badge">관리자 권한</span>}
                  </div>
               </div>

               <div className="price-section">
                  <div className="current-price">
                     <span className="price-label">일일 렌탈가</span>
                     <span className="price">{formatPrice(rentalItemDetail.oneDayPrice)}</span>
                  </div>
                  <div className="stock-info">
                     <span className="stock-label">재고</span>
                     <span className="stock">{rentalItemDetail.quantity}개</span>
                  </div>
               </div>

               {/* 렌트 날짜 및 수량 선택 */}
               {!isOwner && (
                  <div className="rental-date-section">
                     <h3>렌트 기간 및 수량 선택</h3>

                     <div className="date-inputs">
                        <div className="date-input-group">
                           <label>시작일</label>
                           <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={today} className="date-input" />
                        </div>
                        <div className="date-input-group">
                           <label>종료일</label>
                           <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || today} className="date-input" />
                        </div>
                        <div className="quantity-input-group">
                           <label>수량</label>
                           <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} min="1" max={rentalItemDetail.quantity} className="quantity-input" />
                        </div>
                     </div>

                     {startDate && endDate && (
                        <div className="rental-summary">
                           <p>렌트 기간: {calculateDays()}일</p>
                           <p>수량: {quantity}개</p>
                           <p>
                              총 금액: <strong>{formatPrice(calculateTotalPrice())}</strong>
                           </p>
                        </div>
                     )}
                  </div>
               )}

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
                     <div className="manager-buttons">
                        <button className="delete-btn manager-delete" onClick={handleDelete}>
                           [관리자] 삭제하기
                        </button>
                     </div>
                  ) : (
                     <div className="user-buttons">
                        <button className="rental-btn" onClick={() => setShowRentalModal(true)} disabled={rentalItemDetail.rentalStatus !== 'Y' || rentalItemDetail.quantity <= 0}>
                           렌트하기
                        </button>
                     </div>
                  )}
               </div>

               {/* 렌트 확인 모달 */}
               {showRentalModal && (
                  <div className="modal-overlay" onClick={() => setShowRentalModal(false)}>
                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                           <h3>렌트 확인</h3>
                           <button className="modal-close" onClick={() => setShowRentalModal(false)}>
                              ×
                           </button>
                        </div>
                        <div className="modal-body">
                           <div className="rental-info">
                              <h4>{rentalItemDetail.rentalItemNm}</h4>
                              <div className="rental-details">
                                 <p>
                                    <strong>렌트 시작일:</strong> {startDate}
                                 </p>
                                 <p>
                                    <strong>렌트 종료일:</strong> {endDate}
                                 </p>
                                 <p>
                                    <strong>렌트 기간:</strong> {calculateDays()}일
                                 </p>
                                 <p>
                                    <strong>수량:</strong> {quantity}개
                                 </p>
                                 <p>
                                    <strong>일일 렌탈가:</strong> {formatPrice(rentalItemDetail.oneDayPrice)}
                                 </p>
                                 <p className="total-price">
                                    <strong>총 금액:</strong> {formatPrice(calculateTotalPrice())}
                                 </p>
                              </div>
                           </div>
                           <div className="rental-note">
                              <p>렌트를 진행하시겠습니까? 확인 후 취소는 불가능합니다.</p>
                           </div>
                           {createError && (
                              <div className="error-message">
                                 <p>오류: {createError}</p>
                              </div>
                           )}
                        </div>
                        <div className="modal-footer">
                           <button className="cancel-btn" onClick={() => setShowRentalModal(false)}>
                              취소
                           </button>
                           <button className="confirm-rental-btn" onClick={handleRental} disabled={createLoading}>
                              {createLoading ? '처리중...' : '렌트하기'}
                           </button>
                        </div>
                     </div>
                  </div>
               )}

               {/* 주의사항 섹션 */}
               <div className="rental-notice-section">
                  <h3>주의사항</h3>
                  <div className="notice-content">
                     <p>렌트하는 동안 제품에 기스가 나거나 손상이 있을 시, 배상청구가 있을 수 있습니다. 제품을 조심히 다뤄주세요.</p>
                  </div>
               </div>

               {/* 키워드 섹션 */}

               {rentalItemDetail.ItemKeywords && rentalItemDetail.ItemKeywords.length > 0 ? (
                  <div className="keywords-section">
                     <h3>관련 키워드</h3>
                     <div className="keywords">
                        {rentalItemDetail.ItemKeywords.map((itemKeyword, index) => (
                           <span key={index} className="keyword-tag">
                              #{itemKeyword.Keyword?.name}
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

         {/* 렌탈 현황 (소유자나 매니저만 볼 수 있음) */}
         {(isOwner || isManager) && (
            <div className="rental-status-section">
               <h2>렌탈 현황</h2>
               {isManager && !isOwner && <p className="manager-notice">관리자 권한으로 조회 중입니다.</p>}
               <div className="rentals-list">
                  {rentalOrders && rentalOrders.length > 0 ? (
                     rentalOrders.map((order) => (
                        <div key={order.id} className="rental-card">
                           <div className="rental-period">
                              {new Date(order.useStart).toLocaleDateString()} ~ {new Date(order.useEnd).toLocaleDateString()}
                           </div>
                           <div className="rental-user">
                              <img src="/images/로그인상태.png" alt={order.user?.name || '사용자'} className="user-avatar" />
                              <span>{order.user?.name || '익명'}</span>
                           </div>
                           <div className="rental-info">
                              <div className="rental-quantity">수량: {order?.quantity || 1}개</div>
                              <div className="rental-status-badge"></div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <p>렌탈 주문이 없습니다.</p>
                  )}
               </div>
            </div>
         )}
         {/* 상품 이미지 갤러리 */}
         <div className="gallery-section">
            <h2>상품 상세 Detail</h2>
            {rentalItemDetail.rentalImgs && rentalItemDetail.rentalImgs.length > 0 ? (
               rentalItemDetail.rentalImgs.map((img, index) => {
                  const rawPath = img.imgUrl.replace(/\\/g, '/')
                  const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath
                  const fullImgUrl = `${baseURL}/${cleanPath}`

                  return (
                     <div key={index} className="gallery-image-container">
                        <img src={fullImgUrl} alt={`${rentalItemDetail.rentalItemNm} ${index + 1}`} className="gallery-image" />
                     </div>
                  )
               })
            ) : (
               <p>추가 이미지가 없습니다.</p>
            )}
         </div>

         {/* 상품 상세 설명 */}
         <div className="item-description-section">
            <h2>상세 설명</h2>
            <div className="description-content">
               {rentalItemDetail.rentalDetail ? (
                  <div className="description-text">
                     {rentalItemDetail.rentalDetail.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                     ))}
                  </div>
               ) : (
                  <div className="no-description">상세 설명이 없습니다.</div>
               )}
            </div>
         </div>
      </div>
   )
}

export default RentalDetail
