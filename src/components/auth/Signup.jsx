import { TextField, Button, Typography, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUserThunk } from '../../features/authSlice'
import { Link } from 'react-router-dom'
import axios from 'axios'
import GoogleIcon from '@mui/icons-material/Google'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import '../../styles/signup.css'
import '../../styles/popup.css'

function Signup() {
   const [email, setEmail] = useState('')
   const [name, setName] = useState('')
   const [nick, setNick] = useState('')
   const [phone, setPhone] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [address, setAddress] = useState('')
   const [isOpen, setIsOpen] = useState(false)
   const [errors, setErrors] = useState(() => {
      const saved = localStorage.getItem('errors')
      return saved ? JSON.parse(saved) : {}
   })

   const dispatch = useDispatch()
   const { loading } = useSelector((state) => state.auth)
   const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)

   const checkEmail = async (email) => {
      try {
         const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/check-email`, { email })
         return { ok: true, message: res.data.message }
      } catch (err) {
         return { ok: false, ...err.response.data }
      }
   }

   const checkNick = async (nick) => {
      try {
         const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/check-nick`, { nick })
         return { ok: true, message: res.data.message }
      } catch (err) {
         return { ok: false, ...err.response.data }
      }
   }

   const handleEmailChange = async (e) => {
      const value = e.target.value
      setEmail(value)

      if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
         const result = await checkEmail(value)
         if (!result.ok) setErrors((prev) => ({ ...prev, email: result.message }))
         else setErrors((prev) => ({ ...prev, email: '' }))
      } else {
         setErrors((prev) => ({ ...prev, email: '유효한 이메일을 입력해주세요.' }))
      }
   }

   const handleNickChange = async (e) => {
      const value = e.target.value
      setNick(value)

      if (value) {
         const result = await checkNick(value)
         if (!result.ok) setErrors((prev) => ({ ...prev, nick: result.message }))
         else setErrors((prev) => ({ ...prev, nick: '' }))
      } else {
         setErrors((prev) => ({ ...prev, nick: '닉네임을 입력해주세요.' }))
      }
   }

   const handleSignup = async () => {
      let newErrors = {}

      if (!name.trim()) newErrors.name = '이름을 입력해주세요.'

      if (!phone.trim()) newErrors.phone = '휴대폰 번호를 입력해주세요.'

      if (!email.trim()) newErrors.email = '이메일을 입력해주세요.'

      if (!address.trim()) newErrors.address = '주소를 입력해주세요.'

      if (!password.trim()) newErrors.password = '비밀번호를 입력해주세요.'
      else if (!validatePassword(password)) newErrors.password = '비밀번호는 8자리 이상이고, 영문자와 특수문자를 포함해야 합니다.'

      if (!confirmPassword.trim()) newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
      else if (password !== confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'

      if (!nick.trim()) newErrors.nick = '닉네임을 입력해주세요.'

      setErrors((prev) => ({ ...prev, ...newErrors }))

      if (Object.keys(newErrors).length > 0) return

      try {
         await dispatch(registerUserThunk({ email, name, address, password, phone, nick })).unwrap()
         setIsOpen(true)
      } catch (err) {
         const serverErrors = err.response?.data

         if (serverErrors) {
            setErrors((prev) => ({ ...prev, ...serverErrors }))
         } else {
            console.error(err)
            setErrors((prev) => ({ ...prev, message: '서버 에러가 발생했습니다.' }))
         }
      }
   }

   useEffect(() => {
      const saved = localStorage.getItem('errors')
      if (saved) setErrors(JSON.parse(saved))

      return () => {
         localStorage.removeItem('errors')
      }
   }, [])

   useEffect(() => {
      localStorage.setItem('errors', JSON.stringify(errors))
   }, [errors])

   return (
      <div className="signup-container">
         <p className="signup-title">회원가입</p>

         <p className="signup-subtitle">다른 방법으로 회원가입</p>

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

         <form className="signup-form">
            <div className="login-title">
               이름 <p className="login-title-sub">Name</p>
            </div>

            {errors.name && (
               <Typography variant="body1" color="error" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {errors.name}
               </Typography>
            )}

            <TextField placeholder="이름을 입력하세요." fullWidth value={name} onChange={(e) => setName(e.target.value)} error={Boolean(errors.name)} className="login-textfield" />

            <div className="login-title">
               핸드폰 번호 <p className="login-title-sub">Phone</p>
            </div>

            {errors.phone && (
               <Typography variant="body1" color="error" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {errors.phone}
               </Typography>
            )}

            <TextField placeholder="010-XXXX-XXXX" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} error={Boolean(errors.phone)} className="login-textfield" />

            <div className="login-title">
               이메일 <p className="login-title-sub">Email</p>
            </div>

            {errors.email && (
               <Typography variant="body1" color="error" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {errors.email}
               </Typography>
            )}

            <TextField placeholder="navi@example.com" fullWidth value={email} onChange={handleEmailChange} error={Boolean(errors.email)} className="login-textfield" />

            <div className="login-title">
               비밀번호 <p className="login-title-sub">Password</p>
            </div>

            {errors.password && (
               <Typography variant="body1" color="error" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {errors.password}
               </Typography>
            )}

            <TextField placeholder="비밀번호를 입력하세요." type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} error={Boolean(errors.password)} className="login-textfield" />

            <div className="login-title">
               비밀번호 확인 <p className="login-title-sub">Confirm Password</p>
            </div>

            {errors.confirmPassword && (
               <Typography variant="body1" color="error" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {errors.confirmPassword}
               </Typography>
            )}

            <TextField placeholder="비밀번호를 확인해주세요." type="password" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={Boolean(errors.confirmPassword)} className="login-textfield" />

            <div className="login-title">
               닉네임 <p className="login-title-sub">Nickname</p>
            </div>

            {errors.nick && (
               <Typography variant="body1" color="error" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {errors.nick}
               </Typography>
            )}

            <TextField placeholder="사용할 닉네임을 입력하세요." fullWidth value={nick} onChange={handleNickChange} error={Boolean(errors.nick)} className="login-textfield" />

            <div className="login-title">
               주소 <p className="login-title-sub">Address</p>
            </div>

            {errors.address && (
               <Typography variant="body1" color="error" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {errors.address}
               </Typography>
            )}

            <TextField placeholder="XX시 OO구 XX동" fullWidth value={address} onChange={(e) => setAddress(e.target.value)} error={Boolean(errors.address)} className="login-textfield" />
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
