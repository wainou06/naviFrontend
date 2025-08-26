import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { recommendOrderCountUserThunk } from '../../features/recommendSlice'
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material'
import { formatWithComma } from '../../utils/priceSet'
import { Link } from 'react-router-dom'

const RecommendList = ({ user, columns = 5, cardWidth = '250px', cardHeight = cardWidth, imgHeight = 140 }) => {
   const dispatch = useDispatch()
   const recommend = useSelector((state) => state.recommend.items.recommendList)

   useEffect(() => {
      if (user) {
         dispatch(recommendOrderCountUserThunk(user.id))
      }
   }, [dispatch, user])

   return (
      <div>
         {recommend?.length > 0 ? (
            <Box
               sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gridAutoRows: 'auto',
                  gap: '16px',
                  justifyItems: 'center',
               }}
            >
               {recommend.map((recommend) => (
                  <Link to={`/items/detail/${recommend.id}`} key={recommend.id}>
                     <Card sx={{ width: cardWidth, height: cardHeight }}>
                        {/* 대표이미지만 가져오기 */}
                        <CardMedia
                           component="img"
                           height={imgHeight}
                           image={(() => {
                              const baseUrl = import.meta.env.VITE_APP_API_URL || ''
                              const foundImg = recommend?.imgs?.find((img) => img.field === 'Y')?.imgUrl
                              return foundImg ? `${baseUrl}${foundImg}` : '/images/no-image.png'
                           })()}
                           alt={recommend?.itemNm || '상품 이미지'}
                        />

                        <CardContent>
                           <Typography variant="h6" component="div">
                              {recommend.itemNm}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                              {formatWithComma(String(recommend.price))}
                           </Typography>
                           <span>{recommend.updatedAt ? new Date(recommend.updatedAt).toLocaleString() : '정보 없음'}</span>
                        </CardContent>
                     </Card>
                  </Link>
               ))}
            </Box>
         ) : (
            <Box sx={{ textAlign: 'center' }}>
               <Typography variant="h6" component="h6">
                  추천된 상품이 없습니다.
               </Typography>
            </Box>
         )}
      </div>
   )
}

export default RecommendList
