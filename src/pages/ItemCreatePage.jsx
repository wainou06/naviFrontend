// import { Container } from '@mui/material'
// import ItemCreate from '../components/item/ItemCreate'

// import { useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { createItem } from '../features/itemsSlice'

// function ItemCreatePage() {
//    const dispatch = useDispatch()
//    const navigate = useNavigate()

//    // 상품등록
//    const onCreateSubmit = (itemData) => {
//       dispatch(createItem(itemData))
//          .unwrap()
//          .then(() => {
//             navigate('/items/list') // 등록 후 상품등록 리스트 페이지로 이동
//          })
//          .catch((error) => {
//             console.error('상품 등록 에러: ', error)
//             alert('상품 등록에 실패 했습니다.' + error)
//          })
//    }

//    return (
//       <Container maxWidth="md" sx={{ marginTop: 10, marginBottom: 13 }}>
//          <ItemCreate onCreateSubmit={onCreateSubmit} />
//       </Container>
//    )
// }

// export default ItemCreatePage

import React, { useState } from 'react'
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
            <div style={{ textAlign: 'center' }}>
               <p style={{ marginBottom: '20px' }}>{modalMessage}</p>
               <button
                  onClick={handleModalClose}
                  style={{
                     padding: '10px 20px',
                     backgroundColor: '#f5f5f5',
                     border: '1px solid #ddd',
                     borderRadius: '4px',
                     cursor: 'pointer',
                  }}
               >
                  확인
               </button>
            </div>
         </Modal>
      </Container>
   )
}

export default ItemCreatePage
