import { Container } from '@mui/material'
import ItemDetail from '../components/item/ItemDetail'
import Modal from '../components/shared/Modal'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchItem, deleteItem } from '../features/itemsSlice'
import { createPriceProposalThunk, fetchPriceProposalsThunk } from '../features/priceProposalSlice'
import { useEffect, useState } from 'react'

function ItemDetailPage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams()

   const [showModal, setShowModal] = useState(false)
   const [modalMessage, setModalMessage] = useState('')

   useEffect(() => {
      if (id) {
         dispatch(fetchItem(id))
         dispatch(fetchPriceProposalsThunk(id))
      }
   }, [id, dispatch])

   const onDeleteSubmit = () => {
      dispatch(deleteItem(id))
         .unwrap()
         .then(() => {
            navigate('/items/list')
         })
         .catch((error) => {
            console.error('상품 삭제 에러: ', error)
            setModalMessage('상품 삭제에 실패했습니다.' + error)
            setShowModal(true)
         })
   }

   const onEditSubmit = () => {
      navigate(`/items/edit/${id}`)
   }

   const onPriceProposal = (proposalData) => {
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
            setModalMessage('가격 제안이 성공적으로 등록되었습니다.')
            setShowModal(true)
            dispatch(fetchPriceProposalsThunk(proposalData.itemId))
         })
         .catch((error) => {
            console.error('가격 제안 등록 실패:', error)
            setModalMessage('가격 제안 등록에 실패했습니다.')
            setShowModal(true)
         })
   }

   return (
      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 10 }}>
         <ItemDetail onDeleteSubmit={onDeleteSubmit} onEditSubmit={onEditSubmit} onPriceProposal={onPriceProposal} />

         <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <div
               className="popup-message"
               style={{
                  height: 'auto',
                  minHeight: '88px',
                  padding: '20px',
               }}
            >
               {modalMessage}
            </div>
            <button
               className="popup-btn"
               onClick={() => setShowModal(false)}
               style={{
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  color: 'black',
                  width: '200px',
               }}
            >
               확인
            </button>
         </Modal>
      </Container>
   )
}

export default ItemDetailPage
