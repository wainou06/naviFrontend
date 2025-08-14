import { TextField, Button, Typography, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUserThunk } from '../../features/authSlice'
import { Link } from 'react-router-dom'
import GoogleIcon from '@mui/icons-material/Google'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import '../../styles/popup.css'
import '../../styles/signup.css'

function Signup() {
   const [email, setEmail] = useState('')
   const [name, setName] = useState('')
   const [nick, setNick] = useState('')
   const [phone, setPhone] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [address, setAddress] = useState('')
   const [isOpen, setIsOpen] = useState(false)

   const dispatch = useDispatch()
   const { loading, error } = useSelector((state) => state.auth)

   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
   const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)

   const handleSignup = async () => {
      if (!email.trim() || !name.trim() || !address.trim() || !password.trim() || !confirmPassword.trim()) {
         alert('모든 필드를 입력해주세요!')
         return
      }
      if (!validateEmail(email)) {
         alert('유효한 이메일 주소를 입력해주세요!')
         return
      }
      if (!validatePassword(password) || !validatePassword(confirmPassword)) {
         alert('비밀번호는 8자리 이상이고, 영문자와 특수문자를 포함해야 합니다!')
         return
      }
      if (password !== confirmPassword) {
         alert('비밀번호가 일치하지 않습니다!')
         return
      }
      try {
         await dispatch(registerUserThunk({ email, name, address, password, phone, nick })).unwrap()
         setIsOpen(true)
      } catch (error) {
         console.error('회원가입 에러: ', error)
      }
   }

   return (
      <div className="signup-container">
         <p className="signup-title">회원가입</p>

         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <p className="signup-subtitle">다른 방법으로 회원가입</p>

         <Button
            variant="contained"
            fullWidth
            className="google-login-btn"
            onClick={() => {
               window.location.href = 'http://localhost:8000/auth/google'
            }}
         >
            <span className="google-login-content">
               <GoogleIcon /> Google
            </span>
         </Button>

         <form className="signup-form">
            <div className="login-title">
               이름 <p className="login-title-sub">Name</p>
            </div>
            <TextField placeholder="이름을 입력하세요." fullWidth value={name} onChange={(e) => setName(e.target.value)} className="login-textfield" />

            <div className="login-title">
               핸드폰 번호 <p className="login-title-sub">Phone</p>
            </div>
            <TextField placeholder="010-XXXX-XXXX" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} className="login-textfield" />

            <div className="login-title">
               이메일 <p className="login-title-sub">Email</p>
            </div>
            <TextField placeholder="navi@example.com" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} className="login-textfield" />

            <div className="login-title">
               비밀번호 <p className="login-title-sub">Password</p>
            </div>
            <TextField placeholder="비밀번호를 입력하세요." type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} className="login-textfield" />

            <div className="login-title">
               비밀번호 확인 <p className="login-title-sub">Confirm Password</p>
            </div>
            <TextField placeholder="비밀번호를 확인해주세요." type="password" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="login-textfield" />

            <div className="login-title">
               닉네임 <p className="login-title-sub">Nickname</p>
            </div>
            <TextField placeholder="사용할 닉네임을 입력하세요." fullWidth value={nick} onChange={(e) => setNick(e.target.value)} className="login-textfield" />

            <div className="login-title">
               주소 <p className="login-title-sub">Address</p>
            </div>
            <TextField placeholder="XX시 OO구 XX동" fullWidth value={address} onChange={(e) => setAddress(e.target.value)} className="login-textfield" />
         </form>

         <Button variant="contained" fullWidth disabled={loading} className="signup-submit-btn" onClick={handleSignup}>
            {loading ? <CircularProgress size={24} className="signup-loading" /> : '회원가입'}
         </Button>

         {isOpen && (
            <div className="overlay">
               <div className="popup">
                  <div className="popup-content">
                     <p className="popup-message">환영합니다. 회원가입이 완료되었습니다!</p>
                     <Link to="/login" className="popup-link">
                        로그인 하러 가기 <ArrowForwardIosIcon />
                     </Link>
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}

export default Signup
