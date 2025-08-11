import { Container } from '@mui/material'
import ItemDetail from '../components/item/ItemDetail'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchItem, deleteItem } from '../features/itemsSlice'
import { createPriceProposalThunk, fetchPriceProposalsThunk } from '../features/priceProposalSlice'
import { useEffect } from 'react'

function ItemDetailPage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams()

   useEffect(() => {
      if (id) {
         dispatch(fetchItem(id))
         dispatch(fetchPriceProposalsThunk(id)) // 해당 아이템 가격 제안도 같이 불러오기
      }
   }, [id, dispatch])

   const onDeleteSubmit = () => {
      if (window.confirm('정말로 삭제하시겠습니까?')) {
         dispatch(deleteItem(id))
            .unwrap()
            .then(() => {
               navigate('/items/list')
            })
            .catch((error) => {
               console.error('상품 삭제 에러: ', error)
               alert('상품 삭제에 실패했습니다.' + error)
            })
      }
   }

   const onEditSubmit = () => {
      navigate(`/items/edit/${id}`)
   }

   const onPriceProposal = (proposalData) => {
      // deliveryMethod -> purchaseMethod 매핑
      const purchaseMethod = proposalData.deliveryMethod === '택배' ? 'shipping' : proposalData.deliveryMethod === '직거래' ? 'meetup' : 'other'

      const proposalPayload = {
         itemId: proposalData.itemId,
         proposedPrice: proposalData.proposedPrice,
         purchaseMethod,
         message: proposalData.message || '',
      }

      dispatch(createPriceProposalThunk(proposalPayload))
         .unwrap()
         .then(() => {
            alert('가격 제안이 성공적으로 등록되었습니다.')
            dispatch(fetchPriceProposalsThunk(proposalData.itemId)) // 제안 목록 갱신
         })
         .catch((error) => {
            console.error('가격 제안 등록 실패:', error)
            alert('가격 제안 등록에 실패했습니다.')
         })
   }

   return (
      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 10 }}>
         <ItemDetail onDeleteSubmit={onDeleteSubmit} onEditSubmit={onEditSubmit} onPriceProposal={onPriceProposal} />
      </Container>
   )
}

export default ItemDetailPage
