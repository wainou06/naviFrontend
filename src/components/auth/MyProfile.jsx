import { TextField, Button, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios' // ★ axios import 추가

function MyProfile() {
   const [nick, setNick] = useState('')
   const [phone, setPhone] = useState('')
   const [address, setAddress] = useState('')
   const { loading, error } = useSelector((state) => state.auth) // error 제거

   const handleEdit = async (e) => {
      e.preventDefault()

      if (!nick.trim()) return alert('닉네임을 입력하세요!')
      if (!phone.trim()) return alert('전화번호를 입력하세요!')
      if (!address.trim()) return alert('주소를 입력하세요!')

      try {
         const res = await axios.put('http://localhost:8000/api/auth/my', { nick, phone, address }, { withCredentials: true })
         console.log('수정 완료:', res.data)
      } catch (err) {
         console.error(err)
      }
   }

   return (
      <form
         onSubmit={handleEdit}
         style={{
            margin: '0 auto',
            width: '880.5px',
            height: '935.69px',
            marginTop: '40px',
            marginBottom: '320px',
            display: 'flex',
            flexDirection: 'column',
         }}
      >
         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <div
            style={{
               marginTop: '20px',
               marginBottom: '20px',
               fontSize: '36px',
               fontWeight: 700,
               fontStyle: 'bold',
            }}
         >
            닉네임 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Nickname</p>
         </div>
         <TextField
            label="바꿀 닉네임을 입력하세요."
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginTop: '20px', marginBottom: '20px' }}
            sx={{
               '& .MuiInputBase-root': {
                  height: '113px',
                  borderRadius: '30px',
                  fontSize: '30px',
                  paddingLeft: '50px',
               },
               '& .MuiInputLabel-root': {
                  fontSize: '30px',
                  fontWeight: 400,
                  paddingLeft: '40px',
                  lineHeight: '84px',
               },
            }}
         />

         <div
            style={{
               marginTop: '20px',
               marginBottom: '20px',
               fontSize: '36px',
               fontWeight: 700,
               fontStyle: 'bold',
            }}
         >
            전화번호 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Phone</p>
         </div>
         <TextField
            label="바뀐 핸드폰 번호를 입력해주세요."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginTop: '20px', marginBottom: '20px' }}
            sx={{
               '& .MuiInputBase-root': {
                  height: '113px',
                  borderRadius: '30px',
                  fontSize: '30px',
                  paddingLeft: '50px',
               },
               '& .MuiInputLabel-root': {
                  fontSize: '30px',
                  fontWeight: 400,
                  paddingLeft: '40px',
                  lineHeight: '84px',
               },
            }}
         />

         <div
            style={{
               marginTop: '20px',
               marginBottom: '20px',
               fontSize: '36px',
               fontWeight: 700,
               fontStyle: 'bold',
            }}
         >
            주소 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Phone</p>
         </div>
         <TextField
            label="바뀐 주소를 입력해주세요."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginTop: '20px', marginBottom: '20px' }}
            sx={{
               '& .MuiInputBase-root': {
                  height: '113px',
                  borderRadius: '30px',
                  fontSize: '30px',
                  paddingLeft: '50px',
               },
               '& .MuiInputLabel-root': {
                  fontSize: '30px',
                  fontWeight: 400,
                  paddingLeft: '40px',
                  lineHeight: '84px',
               },
            }}
         />

         {/* 버튼 */}
         <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{ position: 'relative', marginTop: '20px' }}
            style={{
               backgroundColor: '#F0907F',
               borderRadius: '30px',
               height: '112px',
               marginTop: '20px',
               marginBottom: '20px',
            }}
         >
            {loading ? (
               <CircularProgress
                  size={24}
                  sx={{
                     position: 'absolute',
                     top: '50%',
                     left: '50%',
                     transform: 'translate(-50%, -50%)',
                  }}
               />
            ) : (
               <p
                  style={{
                     fontSize: '36px',
                     fontStyle: 'medium',
                     fontWeight: 500,
                  }}
               >
                  저장하기
               </p>
            )}
         </Button>
      </form>
   )
}

export default MyProfile
