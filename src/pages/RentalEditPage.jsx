import { Container } from '@mui/material'
import RentalItemEdit from '../components/rental/RentalItemEdit'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { updateRentalItem } from '../features/rentalSlice'

function RentalEditPage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams()

   // 렌탈상품 수정
   const onUpdateSubmit = (rentalItemData) => {
      console.log('페이지에서 받은 수정 데이터:', rentalItemData)
      const updateData = {
         id: id,
         rentalItemData: rentalItemData,
      }

      dispatch(updateRentalItem(updateData))
         .unwrap()
         .then(() => {
            navigate('/rental/list') // 수정 후 렌탈상품 리스트 페이지로 이동
         })
         .catch((error) => {
            console.error('렌탈상품 수정 에러: ', error)
            alert('렌탈상품 수정에 실패했습니다. ' + error)
         })
   }

   return (
      <Container maxWidth="md" sx={{ marginTop: 10, marginBottom: 13 }}>
         <RentalItemEdit onUpdateSubmit={onUpdateSubmit} />
      </Container>
   )
}

export default RentalEditPage
