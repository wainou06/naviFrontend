import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchMyRentalItems } from '../../features/rentalSlice'
import { Typography, CircularProgress, Box, Alert, Card, CardMedia } from '@mui/material'

const MyRental = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { user } = useSelector((state) => state.auth)

   const { myRentalItems = [], myRentalItemsLoading, myRentalItemsError } = useSelector((state) => state.rental || {})

   useEffect(() => {
      if (user?.id) {
         dispatch(fetchMyRentalItems(user.id))
      }
   }, [dispatch, user])

   const filteredRentalItems = useMemo(() => {
      if (!user?.id) return []

      return myRentalItems.filter((item) => {
         const itemUserId = item.userId || item.user_id || item.ownerId || item.owner_id || item.sellerId || item.seller_id || item.memberId || item.member_id || item.regId || item.reg_id

         return itemUserId == user.id
      })
   }, [myRentalItems, user?.id])

   const loading = myRentalItemsLoading
   const error = myRentalItemsError

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

   const hasItems = filteredRentalItems?.length > 0
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
         {/* 렌탈 상품 섹션 */}
         <section className="my-items-section" style={{ marginTop: '40px' }}>
            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: 2,
               }}
            >
               {filteredRentalItems.map((item) => (
                  <Card
                     key={item.id}
                     sx={{
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                           transform: 'translateY(-4px)',
                           boxShadow: 4,
                        },
                     }}
                     onClick={() => navigate(`/rental/detail/${item.id}`)}
                  >
                     {/* 렌탈 상태 라벨 */}
                     <Box
                        className="my-items-section product-status-label"
                        sx={{
                           position: 'absolute !important',
                           top: '8px !important',
                           left: '8px !important',
                           zIndex: 2,
                           fontSize: '13px !important',
                           fontWeight: 600,
                           padding: '7px 10px !important',
                           borderRadius: '10px !important',
                           backgroundColor: item.rentalStatus === 'Y' ? 'rgba(196, 240, 197, 1)' : 'rgba(240, 144, 127, 1)',
                           color: '#2d3436',
                        }}
                     >
                        {item.rentalStatus === 'Y' ? '렌탈가능' : '렌탈불가'}
                     </Box>
                     {/* 대표이미지 */}
                     <CardMedia
                        component="div"
                        height="200"
                        sx={{
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           backgroundColor: '#f5f5f5',
                        }}
                     >
                        {item?.rentalImgs && Array.isArray(item.rentalImgs) && item.rentalImgs.length > 0 && item.rentalImgs[0]?.imgUrl ? (
                           (() => {
                              const rawPath = item.rentalImgs[0].imgUrl.replace(/\\/g, '/')
                              const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath
                              const baseURL = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '')
                              const imageUrl = `${baseURL}/${cleanPath}`

                              return (
                                 <img
                                    src={imageUrl}
                                    alt={item?.rentalItemNm}
                                    style={{
                                       width: '100%',
                                       height: '200px',
                                       objectFit: 'cover',
                                    }}
                                 />
                              )
                           })()
                        ) : (
                           <Box
                              sx={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 color: 'text.secondary',
                                 fontSize: '16px',
                              }}
                           >
                              이미지
                           </Box>
                        )}
                     </CardMedia>
                     <Box sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                           {item.rentalItemNm}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                           일일 {item.oneDayPrice?.toLocaleString()}원
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                           상태: {item.rentalStatus === 'Y' ? '렌탈가능' : '렌탈불가'}
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

export default MyRental
