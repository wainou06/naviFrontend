import { TextField, Button, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { userPasswordEditThunk } from '../../features/infoSlice'
import { checkAuthStatusThunk } from '../../features/authSlice'
import { ModalAlert, ModalConfirm, ModalPrompt } from '../manager/ManagerModal'
import { showModalThunk } from '../../features/modalSlice'

function MySecret() {
   const dispatch = useDispatch()
   const { loading, error, user } = useSelector((state) => state.auth)
   const modal = useSelector((state) => state.modal)

   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])

   const [currentPassword, setCurrentPassword] = useState('')
   const [newPassword, setNewPassword] = useState('')
   const [checkNewPassword, setCheckNewPassword] = useState('')

   const validatePassword = (password) => {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      return passwordRegex.test(password)
   }

   const handleEdit = async () => {
      if (!currentPassword.trim() || !newPassword.trim() || !checkNewPassword.trim()) {
         dispatch(showModalThunk({ placeholder: '입력이 다 안 된 것 같아요.' }))
         return
      }

      if (currentPassword == newPassword) {
         dispatch(showModalThunk({ placeholder: '현재 비밀번호와 바꾸려는 번호가 같아요.' }))
         return
      }

      if (newPassword != checkNewPassword) {
         dispatch(showModalThunk({ placeholder: '새 비밀번호 확인이 일치하지 않습니다.' }))
         return
      }

      if (!validatePassword(newPassword)) {
         dispatch(showModalThunk({ placeholder: '비밀번호는 8자리 이상이고, 영문자와 특수문자를 포함해야 합니다.' }))
         return
      }

      const id = user.id

      dispatch(userPasswordEditThunk({ id, currentPassword, newPassword }))
         .then(() => {
            setCurrentPassword('')
            setCheckNewPassword('')
            setNewPassword('')
            dispatch(showModalThunk({ placeholder: '완료!' }))
         })
         .catch((error) => console.error('비밀번호 수정 실패: ', error))
   }

   const onKeyDownEdit = (e) => {
      if (e.key === 'Enter') handleEdit()
   }

   return (
      <div className="myprofile-form">
         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <div className="myprofile-field-title">
            현재 비밀번호 <p className="myprofile-field-subtitle">Current password</p>
         </div>
         <TextField label="현재 비밀번호를 입력해주세요." value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} fullWidth margin="normal" style={{ marginTop: '20px', marginBottom: '20px' }} type="password" className="myprofile-textfield MuiInputBase-root" />

         <div className="myprofile-field-title">
            새 비밀번호 <p className="myprofile-field-subtitle">A new password</p>
         </div>
         <TextField label="바꿀 비밀번호를 입력해주세요." value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth margin="normal" style={{ marginTop: '20px', marginBottom: '20px' }} type="password" className="myprofile-textfield MuiInputBase-root" />

         <div
            style={{
               marginTop: '20px',
               marginBottom: '20px',
            }}
            className="myprofile-field-title"
         >
            새 비밀번호 확인 <p className="myprofile-field-subtitle">Check your new password</p>
         </div>
         <TextField
            onKeyDown={(e) => onKeyDownEdit(e)}
            type="password"
            label="비밀번호 확인."
            value={checkNewPassword}
            onChange={(e) => setCheckNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            style={{ marginTop: '20px', marginBottom: '20px' }}
            className="myprofile-textfield MuiInputLabel-root"
         />

         {/* 버튼 */}
         <Button onClick={handleEdit} variant="contained" type="submit" fullWidth disabled={loading} sx={{ position: 'relative', marginTop: '20px' }} className="myprofile-submit-btn">
            {loading ? (
               <CircularProgress size={24} className="myprofile-loading-spinner" />
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
         {modal.type === 'confirm' ? <ModalConfirm /> : <></>}
         {modal.type === 'alert' ? <ModalAlert /> : <></>}
         {modal.type === 'prompt' ? <ModalPrompt /> : <></>}
      </div>
   )
}

export default MySecret
