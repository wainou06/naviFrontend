import React, { useState } from 'react'
import { Container } from '@mui/material'
import RentalItemCreate from '../components/rental/RentalItemCreate'
import Modal from '../components/shared/Modal'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createRentalItem } from '../features/rentalSlice'

function RentalItemCreatePage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const [showModal, setShowModal] = useState(false)
   const [modalMessage, setModalMessage] = useState('')

   // 렌탈 상품 등록
   const onCreateSubmit = (rentalItemData) => {
      dispatch(createRentalItem(rentalItemData))
         .unwrap()
         .then(() => {
            setModalMessage('렌탈 상품이 성공적으로 등록되었습니다.')
            setShowModal(true)
            // 모달이 닫힐 때 네비게이션 처리를 위해 여기서는 navigate 안 함
         })
         .catch((error) => {
            console.error('렌탈 상품 등록 에러: ', error)
            setModalMessage('렌탈 상품 등록에 실패했습니다. ' + error)
            setShowModal(true)
         })
   }

   const handleModalClose = () => {
      setShowModal(false)
      // 성공 메시지였다면 페이지 이동
      if (modalMessage.includes('성공적으로')) {
         navigate('/rental/list')
      }
   }

   return (
      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 8 }}>
         <RentalItemCreate onCreateSubmit={onCreateSubmit} />

         <Modal isOpen={showModal} onClose={handleModalClose}>
            <div className="popup-message">{modalMessage}</div>
            <button className="popup-btn" onClick={handleModalClose}>
               확인
            </button>
         </Modal>
      </Container>
   )
}

export default RentalItemCreatePage
