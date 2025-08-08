import React from 'react'
import { Container } from '@mui/material'
import RentalItemCreate from '../components/rental/RentalItemCreate'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createRentalItem } from '../features/rentalSlice'

function RentalItemCreatePage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   // 렌탈 상품 등록
   const onCreateSubmit = (rentalItemData) => {
      dispatch(createRentalItem(rentalItemData))
         .unwrap()
         .then(() => {
            alert('렌탈 상품이 성공적으로 등록되었습니다.')
            navigate('/rental/list') // 등록 후 렌탈 상품 리스트 페이지로 이동
         })
         .catch((error) => {
            console.error('렌탈 상품 등록 에러: ', error)
            alert('렌탈 상품 등록에 실패했습니다. ' + error)
         })
   }

   return (
      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 8 }}>
         <RentalItemCreate onCreateSubmit={onCreateSubmit} />
      </Container>
   )
}

export default RentalItemCreatePage
