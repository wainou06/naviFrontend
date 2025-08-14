import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Typography, Button, Pagination, Alert, CircularProgress } from '@mui/material'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import { fetchRentalItems, setCurrentPage, sortRentalItemsLocally } from '../../features/rentalSlice'
import { Link } from 'react-router-dom'

const RentalList = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const {
      rentalItems = [],
      pagination = { totalPages: 1, currentPage: 1 },
      loading,
      error,
      sortOptions,
   } = useSelector((state) => {
      return state.rental || {}
   })

   // 로컬 필터 상태 (아이템 리스트와 동일한 구조로 변경)
   const [localFilters, setLocalFilters] = useState({
      keyword: '',
      searchCategory: 'rentalItemNm',
      rentalStatus: '',
      page: 1,
      limit: 10,
   })

   const [setDeleteDialog] = useState({ open: false, item: null })
   const [activeFilter, setActiveFilter] = useState('전체')

   useEffect(() => {
      loadRentalItems()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const loadRentalItems = (newFilters = localFilters) => {
      const params = {
         ...newFilters,
         sortBy: sortOptions.sortBy,
         sortOrder: sortOptions.sortOrder,
      }
      dispatch(fetchRentalItems(params))
   }

   // 가격순 정렬
   const handlePriceSort = () => {
      const newSortOrder = sortOptions.sortBy === 'oneDayPrice' && sortOptions.sortOrder === 'asc' ? 'desc' : 'asc'
      dispatch(sortRentalItemsLocally({ sortBy: 'oneDayPrice', sortOrder: newSortOrder }))
   }

   // 날짜순 정렬
   const handleDateSort = () => {
      const newSortOrder = sortOptions.sortBy === 'createdAt' && sortOptions.sortOrder === 'asc' ? 'desc' : 'asc'
      dispatch(sortRentalItemsLocally({ sortBy: 'createdAt', sortOrder: newSortOrder }))
   }

   const handleFilterClick = (filterType) => {
      setActiveFilter(filterType)
      let rentalStatus = ''

      if (filterType === '렌탈가능') rentalStatus = 'Y'
      if (filterType === '렌탈불가') rentalStatus = 'N'

      const newFilters = { ...localFilters, rentalStatus, page: 1 }
      setLocalFilters(newFilters)
      loadRentalItems(newFilters)
   }

   const handlePageChange = (event, page) => {
      const newFilters = { ...localFilters, page }
      setLocalFilters(newFilters)
      dispatch(setCurrentPage(page))

      // 현재 정렬 옵션과 함께 불러오기
      const params = {
         ...newFilters,
         sortBy: sortOptions.sortBy,
         sortOrder: sortOptions.sortOrder,
      }
      dispatch(fetchRentalItems(params))
   }

   const formatPrice = (price) => {
      return new Intl.NumberFormat('ko-KR').format(price)
   }

   // 상태 텍스트 반환
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

   // 상태 클래스 반환
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

   //화살표 표시
   const getSortIndicator = (sortType) => {
      if (sortOptions.sortBy === sortType) {
         return sortOptions.sortOrder === 'asc' ? ' ↑' : ' ↓'
      }
      return ''
   }

   return (
      <div className="rental-list-container">
         <div className="main-container">
            <div className="register-button-section">
               <div className="togo" style={{ width: '350px', height: '80px', marginLeft: '0' }}>
                  <Link to="/items/list">
                     <div
                        style={{
                           backgroundColor: '#AEE9F5',
                           color: '#016CFF',
                           width: '100%',
                           height: '100%',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           borderRadius: '70px',
                        }}
                     >
                        <img src="/images/상품.png" alt="상품 리스트 페이지로" style={{ width: '320px', height: '90px' }} />
                     </div>
                  </Link>
               </div>
            </div>

            {/* 구분선 */}
            <hr style={{ border: 'none', height: '1px', background: 'rgba(240, 144, 127, 1)', margin: '10px' }} />
            <div style={{ textAlign: 'center', color: 'rgba(240, 144, 127, 1)', fontWeight: '600', margin: '10px 0', fontSize: '14px', fontFamily: 'Arial, Black, sans-serif' }}>Rental</div>
            <hr style={{ border: 'none', height: '1px', background: 'rgba(240, 144, 127, 1)', margin: '10px' }} />

            {/* 필터 버튼들 */}
            <div className="filter-section">
               <Button className={`filter-btn ${activeFilter === '필터' ? 'active' : ''}`} onClick={() => handleFilterClick('필터')}>
                  필터
               </Button>

               <Button className="filter-btn" onClick={handlePriceSort}>
                  가격순{getSortIndicator('oneDayPrice')}
               </Button>

               <Button className="filter-btn" onClick={handleDateSort}>
                  날짜순{getSortIndicator('createdAt')}
               </Button>

               <div className="search-actions">
                  <Button className="search-btn" startIcon={<Add />} onClick={() => navigate('/rental/create')}>
                     렌탈 상품등록
                  </Button>
               </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
               <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
               </Alert>
            )}

            {/* 로딩 및 빈 상태 */}
            {loading && rentalItems.length === 0 ? (
               <div className="loading-state">
                  <CircularProgress />
               </div>
            ) : rentalItems.length === 0 ? (
               <div className="empty-state">
                  <Typography className="empty-state-title">등록된 상품이 없습니다</Typography>
                  <Typography className="empty-state-subtitle">첫 번째 렌탈 상품을 등록해보세요!</Typography>
                  <Button className="register-btn" startIcon={<Add />} onClick={() => navigate('/rental/create')}>
                     렌탈 상품 등록하기
                  </Button>
               </div>
            ) : (
               <>
                  {/* 상품 그리드 */}
                  <div className="products-grid">
                     {rentalItems
                        .filter((item) => item && item.id) // item이 존재하고, id 속성이 있는 경우만 필터링
                        .map((item) => (
                           <div key={item.id} className="product-card">
                              {/* 상태 라벨 */}
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
                                 <div className="product-meta">{item?.createdAt ? new Date(item.createdAt).toLocaleString() : '정보 없음'}</div>
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
         </div>
      </div>
   )
}

export default RentalList
