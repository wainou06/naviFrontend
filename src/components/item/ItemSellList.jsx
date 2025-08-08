import { Card, CardMedia, CardContent, Typography, Pagination, Box } from '@mui/material'
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { fetchItems } from '../../features/itemsSlice'
import { formatWithComma } from '../../utils/priceSet'
import { Link } from 'react-router-dom'

function ItemSellList({ searchTerm, columns = 5, cardWidth = '250px', cardHeight = cardWidth, imgHeight = 140 }) {
   const dispatch = useDispatch()
   const { items, pagination, loading, error } = useSelector((state) => state.items)
   const [page, setPage] = useState(1)
   console.log(items)

   useEffect(() => {
      dispatch(fetchItems({ page, limit: 10, searchTerm }))
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
         {items.length > 0 ? (
            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gridAutoRows: 'auto',
                  gap: '16px',
                  justifyItems: 'center',
               }}
            >
               {items.map((item) => (
                  <Link to={`/items/detail/${item.id}`} key={item.id}>
                     <Card sx={{ width: cardWidth, height: cardHeight }}>
                        {/* 대표이미지만 가져오기 */}
                        <CardMedia
                           component="img"
                           height={imgHeight}
                           image={(() => {
                              const baseUrl = import.meta.env.VITE_APP_API_URL || ''
                              const foundImg = item?.imgs?.find((img) => img.field === 'Y')?.imgUrl
                              return foundImg ? `${baseUrl}${foundImg}` : '/images/no-image.png'
                           })()}
                           alt={item?.itemNm || '상품 이미지'}
                        />

                        <CardContent>
                           <Typography variant="h6" component="div">
                              {item.itemNm}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                              {formatWithComma(String(item.price))}
                           </Typography>
                           <span>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '정보 없음'}</span>
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

export default ItemSellList
