import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../../styles/rentalDetail.css'

const RentalDetail = ({ onDeleteSubmit, onRentalSubmit }) => {
   const { rentalItemDetail, loading, error } = useSelector((state) => state.rental)
   const { user } = useSelector((state) => state.auth)

   const [selectedImage, setSelectedImage] = useState(0)
   const [startDate, setStartDate] = useState('')
   const [endDate, setEndDate] = useState('')
   const [showRentalModal, setShowRentalModal] = useState(false)

   const isOwner = user && rentalItemDetail && user.id === rentalItemDetail.userId

   // 매니저 권한 확인
   const isManager = user && user.access === 'MANAGER'

   console.log('Is Owner:', isOwner) // 확인
   console.log('Is Manager:', isManager) // 확인
   console.log('User:', user) // 확인
   console.log('Current Rental Item:', rentalItemDetail) // 확인

   const navigate = useNavigate()

   const handleDelete = () => {
      let confirmMessage = '정말로 이 렌탈 상품을 삭제하시겠습니까?'

      // 매니저가 다른 사람의 글을 삭제하는 경우 추가 확인
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

   const handleRental = () => {
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

      const rentalData = {
         rentalItemId: rentalItemDetail.id,
         startDate,
         endDate,
         totalDays: calculateDays(),
         totalPrice: calculateTotalPrice(),
      }

      onRentalSubmit(rentalData)
      setShowRentalModal(false)
      setStartDate('')
      setEndDate('')
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
      return days * (rentalItemDetail?.oneDayPrice || 0)
   }

   const formatPrice = (price) => {
      return price?.toLocaleString() + '원'
   }

   if (loading) return <div className="loading">로딩중...</div>
   if (error) return <div className="error">오류: {error}</div>
   if (!rentalItemDetail) return <div className="not-found">렌탈 상품을 찾을 수 없습니다.</div>

   const imgUrl = rentalItemDetail.rentalImgs && rentalItemDetail.rentalImgs[selectedImage] ? rentalItemDetail.rentalImgs[selectedImage].imgUrl.replace(/\\/g, '/') : null

   const baseURL = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '') // 끝 '/' 제거
   const imagePath = imgUrl && imgUrl.startsWith('/') ? imgUrl.slice(1) : imgUrl // 앞 '/' 제거

   const fullImgUrl = imgUrl ? `${baseURL}/${imagePath}` : null

   // 오늘 날짜를 YYYY-MM-DD 형식으로 변환
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
                     <span className={`status-badge ${rentalItemDetail.rentalStatus?.toLowerCase()}`}>
                        {rentalItemDetail.rentalStatus === 'Y' && '렌탈가능'}
                        {rentalItemDetail.rentalStatus === 'N' && '렌탈불가'}
                        {rentalItemDetail.rentalStatus === 'RENTED' && '렌탈중'}
                     </span>
                     {/* 매니저 표시 */}
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

               {/* 렌트 날짜 선택 */}
               <div className="rental-date-section">
                  <h3>렌트 기간 선택</h3>
                  <div className="date-inputs">
                     <div className="date-input-group">
                        <label>시작일</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={today} className="date-input" />
                     </div>
                     <div className="date-input-group">
                        <label>종료일</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || today} className="date-input" />
                     </div>
                  </div>
                  {startDate && endDate && (
                     <div className="rental-summary">
                        <p>렌트 기간: {calculateDays()}일</p>
                        <p>
                           총 금액: <strong>{formatPrice(calculateTotalPrice())}</strong>
                        </p>
                     </div>
                  )}
               </div>

               {/* 버튼 섹션 */}
               <div className="action-section">
                  {isOwner ? (
                     // 소유자용 버튼
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
                     // 사용자용 버튼
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
                        </div>
                        <div className="modal-footer">
                           <button className="cancel-btn" onClick={() => setShowRentalModal(false)}>
                              취소
                           </button>
                           <button className="confirm-rental-btn" onClick={handleRental}>
                              렌트하기
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
               {rentalItemDetail.ItemKeywords && rentalItemDetail.ItemKeywords.length > 0 && (
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
               )}
            </div>
         </div>

         {/* 렌탈 현황 (소유자나 매니저만 볼 수 있음) */}
         {(isOwner || isManager) && (
            <div className="rental-status-section">
               <h2>렌탈 현황</h2>
               {isManager && !isOwner && <p className="manager-notice">관리자 권한으로 조회 중입니다.</p>}
               <div className="rentals-list">
                  <div className="rental-card">
                     <div className="rental-period">2024.01.15 ~ 2024.01.20</div>
                     <div className="rental-user">
                        <img src="/default-avatar.png" alt="사용자" className="user-avatar" />
                        <span>사용자명</span>
                     </div>
                     <div className="rental-price">50,000원</div>
                  </div>
                  <div className="rental-card">
                     <div className="rental-period">2024.01.22 ~ 2024.01.25</div>
                     <div className="rental-user">
                        <img src="/default-avatar.png" alt="사용자" className="user-avatar" />
                        <span>방식</span>
                     </div>
                     <div className="rental-price">40,000원</div>
                  </div>
               </div>
            </div>
         )}

         {/* 상품 이미지 갤러리 */}
         <h2>상품 상세 Detail</h2>
         {rentalItemDetail.rentalImgs &&
            rentalItemDetail.rentalImgs.map((img, index) => {
               const rawPath = img.imgUrl.replace(/\\/g, '/')
               const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath
               const fullImgUrl = `${import.meta.env.VITE_APP_API_URL.replace(/\/$/, '')}/${cleanPath}`

               return (
                  <div key={index} className="gallery-image-container">
                     <img src={fullImgUrl} alt={`${rentalItemDetail.rentalItemNm} ${index + 1}`} className="gallery-image" />
                  </div>
               )
            })}

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
