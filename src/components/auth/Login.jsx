import { TextField, Button, Typography, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUserThunk } from '../../features/authSlice'
import axios from 'axios'

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import GoogleIcon from '@mui/icons-material/Google'

import Modal from '../shared/Modal'

import '../../styles/Login.css'
import '../../styles/popup.css'

function Login() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading } = useSelector((state) => state.auth)

   const [rememberMe, setRememberMe] = useState(false)
   const [modalState, setModalState] = useState('')
   const [emailInput, setEmailInput] = useState('')
   const [phoneInput, setPhoneInput] = useState('')
   const [tempPasswordMsg, setTempPasswordMsg] = useState('')
   const [errors, setErrors] = useState({})

   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

   useEffect(() => {
      const savedEmail = localStorage.getItem('savedEmail')
      if (savedEmail) {
         setEmail(savedEmail)
         setRememberMe(true)
      }
   }, [])

   const handleLogin = (e) => {
      let newErrors = {}

      e.preventDefault()

      if (!email.trim()) newErrors.email = '이메일을 입력해주세요.'
      else if (!validateEmail(email)) newErrors.email = '유효한 이메일 주소를 입력해주세요.'
      if (!password.trim()) newErrors.password = '비밀번호를 입력해주세요.'
      if (rememberMe) {
         localStorage.setItem('savedEmail', email)
      } else {
         localStorage.removeItem('savedEmail')
      }

      if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors)
         return
      }

      dispatch(loginUserThunk({ email, password }))
         .unwrap()
         .then(() => navigate('/'))
         .catch((error) => {
            setErrors((prev) => {
               if (error.includes('이메일')) {
                  return { ...prev, email: '이메일이 존재하지 않습니다.' }
               } else {
                  return { ...prev, password: '비밀번호가 틀렸습니다.' }
               }
            })
         })
   }

   const handleSendEmail = async () => {
      try {
         const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/forgot-password-email`, { email: emailInput })
         setTempPasswordMsg(`임시 비밀번호: ${res.data.tempPassword}`)
         setEmailInput('')
         setModalState('tempPassword')
      } catch (err) {
         setModalState('modalEmailErr')
      }
   }

   const handleSendPhone = async () => {
      try {
         const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/forgot-password-phone`, { phone: phoneInput })
         setTempPasswordMsg(`임시 비밀번호: ${res.data.tempPassword}`)
         setPhoneInput('')
         setModalState('tempPassword')
      } catch (err) {
         setModalState('modalPhoneErr')
      }
   }

   return (
      <div className="login-container">
         <form onSubmit={handleLogin}>
            <div className="login-title">
               이메일 <p className="login-title-sub">Email</p>
            </div>

            {errors.email && (
               <Typography variant="body1" color="error" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {errors.email}
               </Typography>
            )}

            <TextField placeholder="이메일을 입력하세요. navi@example.com" name="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} className="login-textfield" />

            <div className="login-title">
               비밀번호 <p className="login-title-sub">Password</p>
            </div>

            {errors.password && (
               <Typography variant="body1" color="error" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {errors.password}
               </Typography>
            )}

            <TextField placeholder="비밀번호를 입력하세요." type="password" name="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} className="login-textfield" />

            <div className="login-options">
               <label className="login-remember-label">
                  <input type="checkbox" className="login-checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <span className="login-checkbox-custom"></span>
                  이메일 저장하기
               </label>

               <button type="button" className="login-forgot-btn" onClick={() => setModalState('choice')}>
                  비밀번호 찾기
               </button>
            </div>

            {/* 통합 모달 */}
            <Modal isOpen={modalState !== ''} onClose={() => setModalState('')}>
               {modalState === 'choice' && (
                  <>
                     <button type="button" className="popup-btn" onClick={() => setModalState('email')}>
                        <AlternateEmailIcon className="icon-accent" /> 이메일로 찾기
                     </button>
                     <button type="button" className="popup-btn" onClick={() => setModalState('phone')}>
                        <PhoneIphoneIcon className="icon-accent" /> 핸드폰 번호로 찾기
                     </button>
                  </>
               )}

               {modalState === 'email' && (
                  <div className="popup-inner">
                     <TextField placeholder="회원가입 시 작성한 이메일을 입력해주세요. navi@example.com" variant="standard" InputProps={{ disableUnderline: true }} value={emailInput} onChange={(e) => setEmailInput(e.target.value)} fullWidth className="popup-textfield" />
                     <button type="button" className="popup-section" onClick={handleSendEmail}>
                        <AlternateEmailIcon className="icon-accent" /> 이메일로 찾기
                     </button>
                  </div>
               )}

               {modalState === 'phone' && (
                  <div className="popup-inner">
                     <TextField placeholder="회원가입 시 작성한 핸드폰 번호를 입력해주세요. 010-XXXX-XXXX" variant="standard" InputProps={{ disableUnderline: true }} value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} fullWidth className="popup-textfield" />
                     <button type="button" className="popup-section" onClick={handleSendPhone}>
                        <PhoneIphoneIcon className="icon-accent" /> 핸드폰 번호로 찾기
                     </button>
                  </div>
               )}

               {modalState === 'tempPassword' && (
                  <div className="popup-content">
                     <p className="popup-message">{tempPasswordMsg}</p>
                     <p className="popup-message">임시 비밀번호를 이용해 로그인 해주세요!</p>
                  </div>
               )}

               {modalState === 'modalEmailErr' && (
                  <div className="popup-content">
                     <p className="popup-message">등록된 이메일이 없습니다!</p>
                     <p className="popup-message">이메일을 확인 후 다시 시도해주세요!</p>
                  </div>
               )}

               {modalState === 'modalPhoneErr' && (
                  <div className="popup-content">
                     <p className="popup-message">등록된 번호가 없습니다!</p>
                     <p className="popup-message">휴대폰 번호를 확인 후 다시 시도해주세요!</p>
                  </div>
               )}
            </Modal>

            <Button variant="contained" type="submit" fullWidth disabled={loading} className="login-submit-btn">
               {loading ? <CircularProgress size={24} className="centered-spinner" /> : '로그인'}
            </Button>
         </form>

         <p className="signup-guide">
            처음이시군요! 계정이 없으신가요?
            <Link to="/signup" className="signup-link">
               회원가입 하기
            </Link>
         </p>

         <p className="other-login-text">다른 계정으로 로그인</p>

         <Button
            variant="contained"
            fullWidth
            className="google-login-btn"
            onClick={() => {
               window.location.href = `${import.meta.env.VITE_APP_API_URL}/auth/google`
            }}
         >
            <span className="google-login-content">
               <GoogleIcon /> Google
            </span>
         </Button>
      </div>
   )
}

export default Login
