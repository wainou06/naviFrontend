import { TextField, Button, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../../features/authSlice'

import '../../styles/myProfile.css'
import '../../styles/popup.css'

function MyProfile() {
   const dispatch = useDispatch()
   const { loading, error, user } = useSelector((state) => state.auth)

   const [nick, setNick] = useState(user?.nick || '')
   const [phone, setPhone] = useState(user?.phone || '')
   const [address, setAddress] = useState(user?.address || '')
   const [showUpdatePopup, setShowUpdatePopup] = useState(false)
   const [UpdateErrPopup, setUpdateErrPopup] = useState(false)

   useEffect(() => {
      setNick(user?.nick || '')
      setPhone(user?.phone || '')
      setAddress(user?.address || '')
   }, [user])

   const handleEdit = async (e) => {
      e.preventDefault()

      const updateData = {}
      if (nick.trim() && nick.trim() !== user?.nick) updateData.nick = nick.trim()
      if (phone.trim() && phone.trim() !== user?.phone) updateData.phone = phone.trim()
      if (address.trim() && address.trim() !== user?.address) updateData.address = address.trim()

      if (Object.keys(updateData).length === 0) {
         return setUpdateErrPopup(true)
      }

      try {
         await dispatch(updateUser(updateData)).unwrap()
         setShowUpdatePopup(true)
      } catch (err) {
         console.error(err)
      }
   }

   return (
      <form onSubmit={handleEdit} className="myprofile-form">
         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <div className="myprofile-field-title">
            닉네임 <p className="myprofile-field-subtitle">Nickname</p>
         </div>
         <TextField placeholder="바꿀 닉네임을 입력하세요." value={nick} onChange={(e) => setNick(e.target.value)} fullWidth margin="normal" className="myprofile-textfield" />

         <div className="myprofile-field-title">
            전화번호 <p className="myprofile-field-subtitle">Phone</p>
         </div>
         <TextField placeholder="바뀐 핸드폰 번호를 입력해주세요." value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth margin="normal" className="myprofile-textfield" />

         <div className="myprofile-field-title">
            주소 <p className="myprofile-field-subtitle">Address</p>
         </div>
         <TextField placeholder="바뀐 주소를 입력해주세요." value={address} onChange={(e) => setAddress(e.target.value)} fullWidth margin="normal" className="myprofile-textfield" />

         <Button variant="contained" type="submit" fullWidth disabled={loading} className="myprofile-submit-btn">
            {loading ? <CircularProgress size={24} className="myprofile-loading-spinner" /> : <p>저장하기</p>}
         </Button>

         {showUpdatePopup && (
            <div className="overlay">
               <div className="popup">
                  <div className="popup-content">
                     <p className="popup-message">회원 정보가 수정되었습니다!</p>
                     <button className="popup-link" onClick={() => setShowUpdatePopup(false)}>
                        확인
                     </button>
                  </div>
               </div>
            </div>
         )}

         {UpdateErrPopup && (
            <div className="overlay">
               <div className="popup">
                  <div className="popup-content">
                     <p className="popup-message">수정된 정보가 없습니다!</p>
                     <button className="popup-link" onClick={() => setUpdateErrPopup(false)}>
                        확인
                     </button>
                  </div>
               </div>
            </div>
         )}
      </form>
   )
}

export default MyProfile
