import { useState } from 'react'
import { Container } from '@mui/material'
import ItemCreate from '../components/item/ItemCreate'
import Modal from '../components/shared/Modal'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createItem } from '../features/itemsSlice'

function ItemCreatePage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const [showModal, setShowModal] = useState(false)
   const [modalMessage, setModalMessage] = useState('')

   const onCreateSubmit = (itemData) => {
      return dispatch(createItem(itemData))
         .unwrap()
         .then(() => {
            setModalMessage('상품이 성공적으로 등록되었습니다.')
            setShowModal(true)
         })
         .catch((error) => {
            console.error('상품 등록 에러: ', error)
            setModalMessage('상품 등록에 실패했습니다. ' + error)
            setShowModal(true)
            throw error
         })
   }

   const handleModalClose = () => {
      setShowModal(false)
      // 성공 메시지였다면 페이지 이동
      if (modalMessage.includes('성공적으로')) {
         navigate('/items/list')
      }
   }

   return (
      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 8 }}>
         <ItemCreate onCreateSubmit={onCreateSubmit} />

         <Modal isOpen={showModal} onClose={handleModalClose}>
            <div className="popup-message">{modalMessage}</div>
            <button className="popup-btn" onClick={handleModalClose}>
               확인
            </button>
         </Modal>
      </Container>
   )
}

export default ItemCreatePage
