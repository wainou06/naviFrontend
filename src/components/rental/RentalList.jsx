import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Typography, Button, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress } from '@mui/material'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import { fetchRentalItems, deleteRentalItem } from '../../features/rentalSlice'

const RentalList = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { rentalItems, pagination, loading, error, deleteLoading } = useSelector((state) => state.rental)

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
      loadRentalItems()
   }, [filters]) // 필터가 변경될 때마다 데이터를 새로 로드

   const loadRentalItems = (newFilters = filters) => {
      dispatch(fetchRentalItems(newFilters))
   }

   const handleSearch = () => {
      const newFilters = { ...filters, page: 1 } // 검색 시 첫 페이지로 리셋
      setFilters(newFilters)
      loadRentalItems(newFilters)
   }

   const handleReset = () => {
      const resetFilters = {
         keyword: '',
         searchCategory: 'rentalItemNm',
         rentalStatus: '',
         page: 1,
         limit: 10,
      }
      setFilters(resetFilters)
      setActiveFilter('전체')
      loadRentalItems(resetFilters)
   }

   const handleFilterClick = (filterType) => {
      setActiveFilter(filterType)
      let rentalStatus = ''
      if (filterType === '대여중') rentalStatus = 'Y'
      if (filterType === '대여불가') rentalStatus = 'N'

      const newFilters = { ...filters, rentalStatus, page: 1 }
      setFilters(newFilters)
      loadRentalItems(newFilters)
   }

   const handlePageChange = (event, page) => {
      const newFilters = { ...filters, page }
      setFilters(newFilters)
      loadRentalItems(newFilters)
   }

   const handleDelete = async (itemId) => {
      dispatch(deleteRentalItem(itemId)) // 삭제 요청
      setDeleteDialog({ open: false, item: null }) // 삭제 다이얼로그 닫기
   }

   const formatPrice = (price) => {
      return new Intl.NumberFormat('ko-KR').format(price)
   }

   const getStatusText = (status) => {
      switch (status) {
         case 'Y':
            return '대여중'
         case 'N':
            return '대여불가'
         default:
            return '알 수 없음'
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
            <div className="section-title">중고 상품</div>

            {/* 필터 버튼들 */}
            <div className="filter-section">
               {['전체', '대여중', '대여불가'].map((filter) => (
                  <Button key={filter} className={`filter-btn ${activeFilter === filter ? 'active' : ''}`} onClick={() => handleFilterClick(filter)}>
                     {filter}
                  </Button>
               ))}
               <div className="search-actions">
                  <Button className="search-btn" onClick={handleSearch}>
                     검색
                  </Button>
                  <Button className="reset-btn" onClick={handleReset}>
                     초기화
                  </Button>
               </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
               <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
               </Alert>
            )}

            {/* 로딩 */}
            {loading && rentalItems.length === 0 ? (
               <div className="loading-state">
                  <CircularProgress />
               </div>
            ) : rentalItems.length === 0 ? (
               <div className="empty-state">
                  <Typography className="empty-state-title">등록된 상품이 없습니다</Typography>
                  <Button className="register-btn" startIcon={<Add />} onClick={() => navigate('/rental/create')}>
                     상품 등록하기
                  </Button>
               </div>
            ) : (
               <>
                  {/* 상품 그리드 */}
                  <div className="products-grid">
                     {rentalItems.map((item) => (
                        <div key={item.id} className="product-card">
                           <div className={`product-status-label ${item.rentalStatus === 'Y' ? 'status-available' : 'status-unavailable'}`}>{getStatusText(item.rentalStatus)}</div>

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

                           <div className="product-image" onClick={() => navigate(`/rental/detail/${item.id}`)}>
                              {item.rentalImgs && item.rentalImgs.length > 0 ? <img src={item.rentalImgs[0].url} alt={item.rentalItemNm} /> : <div className="placeholder-image">이미지</div>}
                           </div>

                           <div className="product-info">
                              <div className="product-title">{item.rentalItemNm}</div>
                              <div className="product-price">{formatPrice(item.oneDayPrice)}원</div>
                              <div className="product-meta">{new Date(item.createdAt).toLocaleString()}</div>
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
                  <Button onClick={() => handleDelete(deleteDialog.item.id)} color="secondary" disabled={deleteLoading}>
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
