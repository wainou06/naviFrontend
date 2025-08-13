import { Container } from '@mui/material'
import RentalDetail from '../components/rental/RentalItemDetail'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchRentalItem, deleteRentalItem } from '../features/rentalSlice'
import { useEffect } from 'react'

function RentalDetailPage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams()

   useEffect(() => {
      if (id) {
         dispatch(fetchRentalItem(id))
            .unwrap()
            .then((result) => {
               console.log('성공:', result)
            })
            .catch((error) => {
               console.log('에러:', error)
            })
      }
   }, [id, dispatch])

   // 렌탈상품 삭제
   const onDeleteSubmit = () => {
      if (window.confirm('정말로 삭제하시겠습니까?')) {
         dispatch(deleteRentalItem(id))
            .unwrap()
            .then(() => {
               alert('렌탈 상품이 삭제되었습니다.')
               navigate('/rental/list') // 삭제 후 렌탈상품 리스트 페이지로 이동
            })
            .catch((error) => {
               console.error('렌탈상품 삭제 에러: ', error)
               alert('렌탈상품 삭제에 실패했습니다. ' + error)
            })
      }
   }

   return (
      <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 10 }}>
         <RentalDetail onDeleteSubmit={onDeleteSubmit} />
      </Container>
   )
}

export default RentalDetailPage
