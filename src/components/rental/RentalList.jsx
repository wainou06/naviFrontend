import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Typography, Button, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress } from '@mui/material'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import { fetchRentalItems, deleteRentalItem } from '../../features/rentalSlice'

const RentalList = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const {
      rentalItems = [],
      pagination = { totalPages: 1, currentPage: 1 },
      loading,
      error,
      deleteLoading,
   } = useSelector((state) => {
      return state.rental || {}
   })

   const [filters, setFilters] = useState({
      keyword: '',
      searchCategory: 'rentalItemNm',
      rentalStatus: '',
      page: 1,
      limit: 10,
   })

   const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null })
   const [activeFilter, setActiveFilter] = useState('전체')

   useEffect(() => {
      const promise = dispatch(fetchRentalItems(filters))

      promise
         .then((result) => {
            console.log('🔍결과:', result)
         })
         .catch((error) => {
            console.log('🔍에러:', error)
         })
   }, [dispatch, filters])

   const handleFilterClick = (filterType) => {
      setActiveFilter(filterType)
      const rentalStatus = filterType === '렌탈가능' ? 'Y' : filterType === '렌탈불가' ? 'N' : ''
      setFilters({ ...filters, rentalStatus, page: 1 })
   }

   const handlePageChange = (event, page) => {
      setFilters((prev) => ({ ...prev, page }))
   }

   const handleDelete = async (itemId) => {
      dispatch(deleteRentalItem(itemId))
      setDeleteDialog({ open: false, item: null })
   }

   const formatPrice = (price) => {
      return new Intl.NumberFormat('ko-KR').format(price)
   }

   const getStatusText = (status, quantity = 0) => {
      switch (status) {
         case 'Y':
            return quantity > 0 ? '렌탈가능' : '렌탈중'
         case 'N':
            return '렌탈중'
         default:
            return '알 수 없음'
      }
   }

   const getStatusClass = (status, quantity = 0) => {
      switch (status) {
         case 'Y':
            return quantity > 0 ? 'status-available' : 'status-sold'
         case 'N':
            return 'status-unavailable'
         default:
            return 'status-unknown'
      }
   }

   return (
      <div className="rental-list-container">
         <div className="main-container">
            <div className="register-button-section">
               <Button className="register-btn" startIcon={<Add />} onClick={() => navigate('/items/list')}>
                  나누go! 비우go! &gt;
               </Button>
            </div>

            <hr className="section-divider" />
            <div className="section-title">Share & Release</div>

            {/* 필터 버튼들 */}
            <div className="filter-section">
               {['필터', '가격순', '날짜순'].map((filter) => (
                  <Button key={filter} className={`filter-btn ${activeFilter === filter ? 'active' : ''}`} onClick={() => handleFilterClick(filter)}>
                     {filter}
                  </Button>
               ))}
               <div className="search-actions">
                  <Button className="search-btn" startIcon={<Add />} onClick={() => navigate('/rental/create')}>
                     렌탈 상품등록
                  </Button>
               </div>
            </div>

            {error && (
               <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
               </Alert>
            )}

            {loading && rentalItems.length === 0 ? (
               <div className="loading-state">
                  <CircularProgress />
               </div>
            ) : rentalItems.length === 0 ? (
               <div className="empty-state">
                  <Typography className="empty-state-title">등록된 상품이 없습니다</Typography>
                  <Button className="register-btn" startIcon={<Add />} onClick={() => navigate('/rental/create')}>
                     렌탈 상품 등록하기
                  </Button>
               </div>
            ) : (
               <>
                  {/* 상품 */}
                  <div className="products-grid">
                     {rentalItems
                        .filter((item) => item && item.id) // item이 존재하고, id 속성이 있는 경우만 필터링
                        .map((item) => (
                           <div key={item.id} className="product-card">
                              {/* 상태라벨  */}
                              <div className={`product-status-label ${getStatusClass(item?.rentalStatus, item?.quantity)}`}>{getStatusText(item?.rentalStatus, item?.quantity)}</div>

                              <div className="product-actions">
                                 <button className="action-btn view" onClick={() => navigate(`/rental/detail/${item.id}`)} title="상세보기">
                                    <Visibility style={{ fontSize: 14 }} />
                                 </button>
                                 <button className="action-btn edit" onClick={() => navigate(`/rental/edit/${item.id}`)} title="수정">
                                    <Edit style={{ fontSize: 14 }} />
                                 </button>
                                 <button className="action-btn delete" onClick={() => setDeleteDialog({ open: true, item })} title="삭제">
                                    <Delete style={{ fontSize: 14 }} />
                                 </button>
                              </div>

                              {/* 상품 이미지 */}
                              <div className="product-image" onClick={() => navigate(`/rental/detail/${item.id}`)}>
                                 {item?.rentalImgs && Array.isArray(item.rentalImgs) && item.rentalImgs.length > 0 && item.rentalImgs[0]?.imgUrl ? (
                                    (() => {
                                       const rawPath = item.rentalImgs[0].imgUrl.replace(/\\/g, '/')
                                       const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath
                                       const baseURL = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '')
                                       const imageUrl = `${baseURL}/${cleanPath}`

                                       return <img src={imageUrl} alt={item?.rentalItemNm} />
                                    })()
                                 ) : (
                                    <div className="placeholder-image">이미지</div>
                                 )}
                              </div>

                              <div className="product-info">
                                 <div className="product-title">{item?.rentalItemNm}</div>
                                 <div className="product-price">{formatPrice(item?.oneDayPrice)}원</div>
                                 <div className="product-meta">{new Date(item?.createdAt).toLocaleString()}</div>
                              </div>
                           </div>
                        ))}
                  </div>

                  {/* 페이지네이션 */}
                  {pagination.totalPages > 1 && (
                     <div className="pagination-section">
                        <Pagination count={pagination.totalPages} page={pagination.currentPage} onChange={handlePageChange} color="primary" size="large" />
                     </div>
                  )}
               </>
            )}

            {/* 삭제 다이얼로그 */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, item: null })}>
               <DialogTitle>삭제 확인</DialogTitle>
               <DialogContent>
                  <Typography>정말 이 상품을 삭제하시겠습니까?</Typography>
               </DialogContent>
               <DialogActions>
                  <Button onClick={() => setDeleteDialog({ open: false, item: null })} color="primary">
                     취소
                  </Button>
                  <Button onClick={() => handleDelete(deleteDialog.item?.id)} color="secondary" disabled={deleteLoading}>
                     {deleteLoading ? <CircularProgress size={24} /> : '삭제'}
                  </Button>
               </DialogActions>
            </Dialog>

            <hr className="section-divider" />
         </div>
      </div>
   )
}

export default RentalList
