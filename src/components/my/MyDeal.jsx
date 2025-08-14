import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMyProposalsThunk, getReceivedProposalsThunk, getCompletedDealsThunk } from '../../features/priceProposalSlice'
import { fetchMyItems } from '../../features/itemsSlice'

import { Typography, CircularProgress, Box, Alert, Card, CardMedia, Tabs, Tab, Chip } from '@mui/material'

const MyDeal = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { user } = useSelector((state) => state.auth)
   const [tabValue, setTabValue] = useState(0)

   const { myItems = [], myItemsLoading, myItemsError } = useSelector((state) => state.items || {})
   const { myProposals = [], loading, error } = useSelector((state) => state.priceProposal || {})

   useEffect(() => {
      if (user?.id) {
         dispatch(fetchMyItems(user.id))
         dispatch(getMyProposalsThunk())
         dispatch(getReceivedProposalsThunk())
         dispatch(getCompletedDealsThunk())
      }
   }, [dispatch, user])

   // 판매한 아이템 (품절 포함)
   const soldItems = useMemo(() => {
      if (!user?.id || !Array.isArray(myItems)) return []

      return myItems.filter((item) => {
         const itemUserId = item.userId || item.user_id || item.ownerId || item.owner_id || item.sellerId || item.seller_id || item.memberId || item.member_id || item.regId || item.reg_id
         return itemUserId == user.id && (item.itemSellStatus === 'SOLD_OUT' || item.itemSellStatus === 'SOLD')
      })
   }, [myItems, user?.id])

   // 구매한 아이템 (내가 보낸 제안이 수락된 것들)
   const purchasedItems = useMemo(() => {
      if (!Array.isArray(myProposals)) return []
      return myProposals.filter((proposal) => proposal.status === 'accepted')
   }, [myProposals])

   const handleTabChange = (event, newValue) => {
      setTabValue(newValue)
   }

   const getStatusColor = (status) => {
      switch (status) {
         case 'SELL':
            return 'rgba(196, 240, 197, 1)'
         case 'SOLD_OUT':
            return 'rgba(240, 144, 127, 1)'
         case 'SOLD':
            return 'rgba(255, 193, 7, 1)'
         case 'accepted':
            return 'rgba(76, 175, 80, 1)'
         case 'pending':
            return 'rgba(158, 158, 158, 1)'
         case 'rejected':
            return 'rgba(244, 67, 54, 1)'
         default:
            return 'rgba(158, 158, 158, 1)'
      }
   }

   const getStatusText = (status) => {
      switch (status) {
         case 'SELL':
            return '판매중'
         case 'SOLD_OUT':
            return '품절'
         case 'SOLD':
            return '판매완료'
         case 'accepted':
            return '구매완료'
         case 'pending':
            return '대기중'
         case 'rejected':
            return '거절됨'
         default:
            return '알 수 없음'
      }
   }

   const formatPrice = (price) => {
      return price?.toLocaleString() || '0'
   }

   const isLoading = myItemsLoading || loading
   const hasError = myItemsError || error

   if (isLoading) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
         </Box>
      )
   }

   if (hasError) {
      // 에러가 객체인 경우 처리
      const errorMessage = typeof hasError === 'string' ? hasError : hasError?.message || hasError?.error || '오류가 발생했습니다.'
      return <Alert severity="error">{errorMessage}</Alert>
   }

   const renderItemCard = (item, type = 'sold') => {
      const isProposal = type === 'purchased' || type === 'completed'
      const displayItem = isProposal ? item.item : item
      const proposalInfo = isProposal ? item : null

      return (
         <Card
            key={isProposal ? `${type}-${item.id}` : item.id}
            sx={{
               cursor: 'pointer',
               transition: 'transform 0.2s, box-shadow 0.2s',
               '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
               },
               position: 'relative',
            }}
            onClick={() => navigate(`/items/detail/${displayItem.id}`)}
         >
            {/* 상품 상태 라벨 */}
            <Box
               sx={{
                  position: 'absolute !important',
                  top: '8px !important',
                  left: '8px !important',
                  zIndex: 2,
                  fontSize: '13px !important',
                  fontWeight: 600,
                  padding: '7px 10px !important',
                  borderRadius: '10px !important',
                  backgroundColor: getStatusColor(isProposal ? proposalInfo.status : displayItem.itemSellStatus),
                  color: '#2d3436',
               }}
            >
               {getStatusText(isProposal ? proposalInfo.status : displayItem.itemSellStatus)}
            </Box>

            {/* 거래 타입 표시 */}
            {type === 'completed' && (
               <Chip
                  label={proposalInfo.userId === user.id ? '구매' : '판매'}
                  size="small"
                  sx={{
                     position: 'absolute',
                     top: '8px',
                     right: '8px',
                     zIndex: 2,
                     backgroundColor: proposalInfo.userId === user.id ? '#2196f3' : '#4caf50',
                     color: 'white',
                  }}
               />
            )}

            {/* 대표이미지 */}
            <CardMedia
               component="img"
               height="200"
               image={(() => {
                  const baseUrl = import.meta.env.VITE_APP_API_URL || ''
                  // 이미지 데이터는 항상 displayItem에서 가져오기
                  const imgs = displayItem?.imgs || []
                  const foundImg = imgs.find((img) => img.field === 'Y')?.imgUrl

                  return foundImg ? `${baseUrl}${foundImg}` : '/images/no-image.png'
               })()}
               alt={displayItem?.itemNm || '상품 이미지'}
               sx={{ objectFit: 'cover' }}
            />

            <Box sx={{ p: 2 }}>
               <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {displayItem.itemNm}
               </Typography>

               {/* 가격 정보 */}
               <Box sx={{ mb: 1 }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                     {isProposal ? formatPrice(proposalInfo.proposedPrice) : formatPrice(displayItem.price)}원
                  </Typography>
                  {isProposal && displayItem.price !== proposalInfo.proposedPrice && (
                     <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        원가: {formatPrice(displayItem.price)}원
                     </Typography>
                  )}
               </Box>

               <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  상태: {getStatusText(isProposal ? proposalInfo.status : displayItem.itemSellStatus)}
               </Typography>

               {/* 거래 상대방 정보 */}
               {isProposal && (
                  <Typography variant="body2" color="text.secondary">
                     {type === 'purchased' ? '판매자' : proposalInfo.userId === user.id ? '판매자' : '구매자'}: {type === 'purchased' ? displayItem.user?.nick : proposalInfo.userId === user.id ? displayItem.user?.nick : proposalInfo.user?.nick}
                  </Typography>
               )}

               <Typography variant="body2" color="text.secondary">
                  {isProposal ? new Date(proposalInfo.updatedAt).toLocaleString() : new Date(displayItem.updatedAt).toLocaleString()}
               </Typography>
            </Box>
         </Card>
      )
   }

   const renderTabContent = () => {
      switch (tabValue) {
         case 0: // 판매 내역
            return (
               <section className="sold-items-section">
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                     내가 판매한 상품 ({soldItems.length}개)
                  </Typography>
                  {soldItems.length === 0 ? (
                     <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">판매 완료된 상품이 없습니다.</Typography>
                     </Box>
                  ) : (
                     <Box
                        sx={{
                           display: 'grid',
                           gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                           gap: 2,
                        }}
                     >
                        {soldItems.map((item) => renderItemCard(item, 'sold'))}
                     </Box>
                  )}
               </section>
            )

         case 1: // 구매 내역
            return (
               <section className="purchased-items-section">
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                     내가 구매한 상품 ({purchasedItems.length}개)
                  </Typography>
                  {purchasedItems.length === 0 ? (
                     <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="text.secondary">구매한 상품이 없습니다.</Typography>
                     </Box>
                  ) : (
                     <Box
                        sx={{
                           display: 'grid',
                           gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                           gap: 2,
                        }}
                     >
                        {purchasedItems.map((proposal) => renderItemCard(proposal, 'purchased'))}
                     </Box>
                  )}
               </section>
            )

         default:
            return null
      }
   }

   return (
      <Box sx={{ p: 2 }}>
         {/* 탭 네비게이션 */}
         <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
               <Tab label={`판매 내역 (${soldItems.length})`} sx={{ fontSize: '16px !important' }} />
               <Tab label={`구매 내역 (${purchasedItems.length})`} sx={{ fontSize: '16px !important' }} />
            </Tabs>
         </Box>

         {/* 탭 컨텐츠 */}
         {renderTabContent()}
      </Box>
   )
}

export default MyDeal
