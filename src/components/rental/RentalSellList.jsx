import { Card, CardMedia, CardContent, Typography, Pagination, Box } from '@mui/material'
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { formatWithComma } from '../../utils/priceSet'
import { Link } from 'react-router-dom'
import { fetchRentalItems } from '../../features/rentalSlice'

function RentalSellList({ searchTerm, columns = 5, cardWidth = '250px', cardHeight = cardWidth, imgHeight = 140 }) {
   const dispatch = useDispatch()
   const { rentalItems, pagination, loading, error } = useSelector((state) => state.rental)
   const [page, setPage] = useState(1)

   useEffect(() => {
      dispatch(fetchRentalItems({ page, limit: 10, searchTerm }))
   }, [dispatch, page, searchTerm])

   if (loading) {
      return null
   }

   if (error) {
      return (
         <Typography variant="body1" align="center" color="error">
            에러 발생: {error}
         </Typography>
      )
   }

   return (
      <div>
         {rentalItems.length > 0 ? (
            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gridAutoRows: 'auto',
                  gap: '16px',
                  justifyItems: 'center',
               }}
            >
               {rentalItems.map((rentalItem) => (
                  <Link to={`/rental/detail/${rentalItem.id}`} key={rentalItem.id}>
                     <Card sx={{ width: cardWidth, height: cardHeight }}>
                        {/* 대표이미지만 가져오기 */}
                        <CardMedia
                           component="img"
                           height={imgHeight}
                           image={(() => {
                              const baseUrl = import.meta.env.VITE_APP_API_URL || ''
                              const foundImg = rentalItem?.rentalImgs[0]?.imgUrl
                              return foundImg ? `${baseUrl}${foundImg}` : '/images/no-image.png'
                           })()}
                           alt={rentalItem?.rentalitemNm || '상품 이미지'}
                        />

                        <CardContent>
                           <Typography variant="h6" component="div">
                              {rentalItem.rentalItemNm}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                              {formatWithComma(String(rentalItem.oneDayPrice))}
                           </Typography>
                           <span>{rentalItem.updatedAt ? new Date(rentalItem.updatedAt).toLocaleString() : '정보 없음'}</span>
                        </CardContent>
                     </Card>
                  </Link>
               ))}
            </Box>
         ) : (
            <Box sx={{ textAlign: 'center' }}>
               <Typography variant="h6" component="h6">
                  검색된 상품이 없습니다.
               </Typography>
            </Box>
         )}

         {pagination && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
               <Pagination count={pagination.totalPages} page={page} onChange={(event, value) => setPage(value)} color="primary" />
            </Box>
         )}
      </div>
   )
}

export default RentalSellList
