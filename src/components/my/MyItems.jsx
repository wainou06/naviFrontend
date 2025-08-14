import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchMyItems } from '../../features/itemsSlice'

import { Typography, CircularProgress, Box, Alert, Card, CardMedia } from '@mui/material'

const MyItems = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { user } = useSelector((state) => state.auth)

   const { myItems = [], myItemsLoading, myItemsError } = useSelector((state) => state.items || {})

   useEffect(() => {
      if (user?.id) {
         dispatch(fetchMyItems(user.id))
      }
   }, [dispatch, user])

   const filteredItems = useMemo(() => {
      if (!user?.id) return []

      return myItems.filter((item) => {
         const itemUserId = item.userId || item.user_id || item.ownerId || item.owner_id || item.sellerId || item.seller_id || item.memberId || item.member_id || item.regId || item.reg_id
         return itemUserId == user.id
      })
   }, [myItems, user?.id])

   const loading = myItemsLoading
   const error = myItemsError

   if (loading) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
         </Box>
      )
   }

   if (error) {
      return <Alert severity="error">{error}</Alert>
   }

   const hasItems = filteredItems?.length > 0
   if (!hasItems) {
      return (
         <Box sx={{ mt: 3, p: 3, textAlign: 'center' }}>
            <Typography variant="h6">등록된 상품이 없습니다.</Typography>
            <Typography sx={{ mt: 1, color: 'text.secondary' }}>상품을 등록하여 나의 목록을 채워보세요!</Typography>
         </Box>
      )
   }

   return (
      <Box sx={{ p: 2 }}>
         {/* 일반 상품 섹션 */}
         <section className="my-items-section">
            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: 2,
               }}
            >
               {filteredItems.map((item) => (
                  <Card
                     key={item.id}
                     sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                           transform: 'translateY(-4px)',
                           boxShadow: 4,
                        },
                        position: 'relative',
                     }}
                     onClick={() => navigate(`/items/detail/${item.id}`)}
                  >
                     {/* 상품 상태 라벨 */}
                     <Box
                        className=".my-items-section .product-status-label"
                        sx={{
                           position: 'absolute !important',
                           top: '8px !important',
                           left: '8px !important',
                           zIndex: 2,
                           fontSize: '13px !important',
                           fontWeight: 600,
                           padding: '7px 10px !important',
                           borderRadius: '10px !important',
                           backgroundColor: item.itemSellStatus === 'SELL' ? 'rgba(196, 240, 197, 1)' : 'rgba(240, 144, 127, 1)',
                           color: '#2d3436',
                        }}
                     >
                        {item.itemSellStatus === 'SELL' ? '판매중' : '판매완료'}
                     </Box>
                     {/* 대표이미지 */}
                     <CardMedia
                        component="img"
                        height="200"
                        image={(() => {
                           const baseUrl = import.meta.env.VITE_APP_API_URL || ''
                           const foundImg = item?.imgs?.find((img) => img.field === 'Y')?.imgUrl
                           return foundImg ? `${baseUrl}${foundImg}` : '/images/no-image.png'
                        })()}
                        alt={item?.itemNm || '상품 이미지'}
                        sx={{ objectFit: 'cover' }}
                     />
                     <Box sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                           {item.itemNm}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                           {item.price?.toLocaleString()}원
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                           상태: {item.itemSellStatus === 'SELL' ? '판매중' : '판매완료'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                           {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '정보 없음'}
                        </Typography>
                     </Box>
                  </Card>
               ))}
            </Box>
         </section>
      </Box>
   )
}

export default MyItems
