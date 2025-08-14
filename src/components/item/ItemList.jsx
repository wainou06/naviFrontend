import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Typography, Button, Pagination, Alert, CircularProgress } from '@mui/material'
import { Add, Edit, Visibility, ShoppingCart } from '@mui/icons-material'
import { fetchItems, setCurrentPage, sortItemsLocally } from '../../features/itemsSlice'
import { Link } from 'react-router-dom'
import '../../styles/itemList.css'

const ItemsList = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { items, pagination, loading, error, sortOptions } = useSelector((state) => state.items)

   const [localFilters, setLocalFilters] = useState({
      keyword: '',
      searchCategory: 'name',
      status: '',
      page: 1,
      limit: 10,
   })

   const [activeFilter, setActiveFilter] = useState('전체')

   useEffect(() => {
      loadItems()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const loadItems = (newFilters = localFilters) => {
      const params = {
         ...newFilters,
         sortBy: sortOptions.sortBy,
         sortOrder: sortOptions.sortOrder,
      }
      dispatch(fetchItems(params))
   }

   // 가격순 정렬
   const handlePriceSort = () => {
      const newSortOrder = sortOptions.sortBy === 'price' && sortOptions.sortOrder === 'asc' ? 'desc' : 'asc'
      dispatch(sortItemsLocally({ sortBy: 'price', sortOrder: newSortOrder }))
   }

   // 날짜순 정렬
   const handleDateSort = () => {
      const newSortOrder = sortOptions.sortBy === 'updatedAt' && sortOptions.sortOrder === 'asc' ? 'desc' : 'asc'
      dispatch(sortItemsLocally({ sortBy: 'updatedAt', sortOrder: newSortOrder }))
   }

   const handleFilterClick = (filterType) => {
      setActiveFilter(filterType)
      let status = ''
      if (filterType === '판매중') status = 'SELL'
      if (filterType === '품절') status = 'SOLD_OUT'
      if (filterType === '할인중') status = 'ON_SALE'

      const newFilters = { ...localFilters, status, page: 1 }
      setLocalFilters(newFilters)
      loadItems(newFilters)
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
      dispatch(fetchItems(params))
   }

   const formatPrice = (price) => {
      return new Intl.NumberFormat('ko-KR').format(price)
   }

   const getStatusText = (status) => {
      switch (status) {
         case 'SELL':
            return '판매중'
         case 'SOLD_OUT':
            return '품절'
         case 'RESERVATION':
            return '예약중'
         default:
            return '알 수 없음'
      }
   }

   const getStatusClass = (status) => {
      switch (status) {
         case 'SELL':
            return 'status-available'
         case 'SOLD_OUT':
            return 'status-sold'
         case 'RESERVATION':
            return 'status-on-sale'
         default:
            return 'status-unknown'
      }
   }

   const getSortIndicator = (sortType) => {
      if (sortOptions.sortBy === sortType) {
         return sortOptions.sortOrder === 'asc' ? ' ↑' : ' ↓'
      }
      return ''
   }

   return (
      <div className="items-list-container">
         <div className="main-container">
            <div className="register-button-section">
               <div className="togo" style={{ width: '350px', height: '80px', marginLeft: '0' }}>
                  <Link to="/rental/list">
                     <div style={{ backgroundColor: '#FFD1BA', color: '#AA3900', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '70px' }}>
                        <img src="/images/렌탈.png" alt="렌탈 리스트 페이지로" style={{ width: '320px', height: '90px' }} />
                     </div>
                  </Link>
               </div>
            </div>

            <hr className="section-divider" />
            <div className="section-title">Share & Release</div>
            <hr className="section-divider" />

            {/* 필터 버튼들 */}
            <div className="filter-section">
               <Button className={`filter-btn ${activeFilter === '필터' ? 'active' : ''}`} onClick={() => handleFilterClick('필터')}>
                  필터
               </Button>

               <Button className="filter-btn" onClick={handlePriceSort}>
                  가격순{getSortIndicator('price')}
               </Button>

               <Button className="filter-btn" onClick={handleDateSort}>
                  날짜순{getSortIndicator('updatedAt')}
               </Button>

               <div className="search-actions">
                  <Button className="search-btn" startIcon={<Add />} onClick={() => navigate('/items/create')}>
                     상품등록
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
            {loading && items.length === 0 ? (
               <div className="loading-state">
                  <CircularProgress />
               </div>
            ) : items.length === 0 ? (
               <div className="empty-state">
                  <ShoppingCart className="empty-state-icon" />
                  <Typography className="empty-state-title">등록된 상품이 없습니다</Typography>
                  <Typography className="empty-state-subtitle">첫 번째 상품을 등록해보세요!</Typography>
                  <Button className="register-btn" startIcon={<Add />} onClick={() => navigate('/items/create')}>
                     상품 등록하기
                  </Button>
               </div>
            ) : (
               <>
                  {/* 상품 그리드 */}
                  <div className="products-grid">
                     {items.map((item) => (
                        <div key={item.id} className="product-card">
                           <div className={`product-status-label ${getStatusClass(item.itemSellStatus)}`}>{getStatusText(item.itemSellStatus)}</div>

                           <div className="product-actions">
                              <button className="action-btn view" onClick={() => navigate(`/items/detail/${item.id}`)} title="상세보기">
                                 <Visibility style={{ fontSize: 14 }} />
                              </button>
                              <button className="action-btn edit" onClick={() => navigate(`/items/edit/${item.id}`)} title="수정">
                                 <Edit style={{ fontSize: 14 }} />
                              </button>
                           </div>

                           <div className="product-image" onClick={() => navigate(`/items/detail/${item.id}`)}>
                              {item.imgs && item.imgs.length > 0 ? (
                                 (() => {
                                    const rawPath = item.imgs[0].imgUrl.replace(/\\/g, '/')
                                    const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath
                                    const baseURL = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '')
                                    const imageUrl = `${baseURL}/${cleanPath}`
                                    return <img src={imageUrl} alt={item.itemNm} />
                                 })()
                              ) : (
                                 <div className="placeholder-image">이미지</div>
                              )}
                           </div>

                           <div className="product-info">
                              <div className="product-title">{item.itemNm}</div>
                              <div className="product-price">{formatPrice(item.price)}원</div>
                              <div className="product-meta">{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '정보 없음'}</div>
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

export default ItemsList
