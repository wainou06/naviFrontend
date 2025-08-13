import { TextField, Button, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser, checkAuthStatusThunk } from '../../features/authSlice'

function MySecret() {
   const dispatch = useDispatch()
   const { loading, error, user } = useSelector((state) => state.auth)

   const [currentPassword, setCurrentPassword] = useState('')
   const [newPassword, setNewPassword] = useState('')
   const [checkNewPassword, setCheckNewPassword] = useState('')

   const handleEdit = async () => {
      if (!currentPassword.trim() || !newPassword.trim() || !checkNewPassword.trim()) {
         alert('입력이 다 안 된 것 같아요.')
         return
      }

      // const updateData = {}
      // if (nick.trim()) updateData.nick = nick.trim()
      // if (phone.trim()) updateData.phone = phone.trim()
      // if (address.trim()) updateData.address = address.trim()

      const updateData = {}

      //   if (Object.keys(updateData).length === 0) {
      //      return alert('수정한 정보가 없습니다!')
      //   }

      //   try {
      //      await dispatch(updateUser(updateData)).unwrap()
      //      alert('회원 정보가 수정되었습니다!')
      //   } catch (err) {
      //      console.error(err)
      //      alert('수정 중 오류가 발생했습니다. 다시 시도해주세요.')
      //   }
   }

   return (
      <div
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
            현재 비밀번호 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Current password</p>
         </div>
         <TextField
            label="현재 비밀번호를 입력해주세요."
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginTop: '20px', marginBottom: '20px' }}
            type="password"
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
            새 비밀번호 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>A new password</p>
         </div>
         <TextField
            label="바꿀 비밀번호를 입력해주세요."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginTop: '20px', marginBottom: '20px' }}
            type="password"
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
            새 비밀번호 확인 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Check your new password</p>
         </div>
         <TextField
            label="비밀번호 확인."
            value={checkNewPassword}
            onChange={(e) => setCheckNewPassword(e.target.value)}
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
            onClick={handleEdit}
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
      </div>
   )
}

export default MySecret
