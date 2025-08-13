import { TextField, Button, Typography, CircularProgress } from '@mui/material'

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUserThunk } from '../../features/authSlice'

import axios from 'axios' // ★ axios import 추가

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import GoogleIcon from '@mui/icons-material/Google'

import '../../styles/popup.css'

function Login() {
   const [email, setEmail] = useState('') // 이메일 상태
   const [password, setPassword] = useState('') // 비밀번호 상태
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error } = useSelector((state) => state.auth)

   const [isOpen, setIsOpen] = useState(false)
   const [isEmail, setOpenEmail] = useState(false)
   const [isPhone, setOpenPhone] = useState(false)

   // 아이디 저장
   const [rememberMe, setRememberMe] = useState(false)

   const [emailInput, setEmailInput] = useState('')
   const [phoneInput, setPhoneInput] = useState('')

   const handleSendEmail = async () => {
      try {
         const res = await axios.post('http://localhost:8000/auth/forgot-password-email', {
            email: emailInput,
         })
         alert(`${res.data.message}\n임시 비밀번호: ${res.data.tempPassword}`) // 성공 메시지
         setEmailInput('') // 입력 초기화
         setOpenEmail(false) // 팝업 닫기
         setIsOpen(false)
      } catch (err) {
         alert(err.response?.data?.message || '오류 발생')
      }
   }

   const handleSendPhone = async () => {
      try {
         const res = await axios.post('http://localhost:8000/auth/forgot-password-phone', {
            phone: phoneInput,
         })
         alert(`${res.data.message}\n임시 비밀번호: ${res.data.tempPassword}`) // 성공 메시지
         setPhoneInput('') // 입력 초기화
         setOpenPhone(false) // 팝업 닫기
         setIsOpen(false)
      } catch (err) {
         alert(err.response?.data?.message || '오류 발생')
      }
   }

   useEffect(() => {
      const savedEmail = localStorage.getItem('savedEmail')
      if (savedEmail) {
         setEmail(savedEmail)
         setRememberMe(true)
      }
   }, [])

   const openPopup = () => setIsOpen(true)
   const closePopup = () => setIsOpen(false)
   const openEmail = () => setOpenEmail(true)
   const closeEmail = () => setOpenEmail(false)
   const openPhone = () => setOpenPhone(true)
   const closePhone = () => setOpenPhone(false)

   const handleLogin = (e) => {
      e.preventDefault()

      // 이메일과 패스워드가 둘다 공백이 아니라면 실행
      if (email.trim() && password.trim()) {
         // 아이디 저장
         if (rememberMe) {
            localStorage.setItem('savedEmail', email)
         } else {
            localStorage.removeItem('savedEmail')
         }

         dispatch(loginUserThunk({ email, password }))
            .unwrap()
            .then(() => {
               navigate('/')
            })
            .catch((error) => console.error('로그인 실패: ', error))
      } else {
         alert('이메일과 패스워드를 입력해주세요!')
         return
      }
   }

   return (
      <div
         style={{
            margin: '0 auto',
            width: '880.5px',
            height: '935.69px',
            marginTop: '187px',
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

         <div style={{ marginTop: '20px', marginBottom: '20px', fontSize: '36px', fontWeight: 700, fontStyle: 'bold' }}>
            이메일 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Email</p>
         </div>

         <form onSubmit={handleLogin}>
            <TextField
               label="이메일을 입력하세요. navi@example.com"
               name="email"
               fullWidth
               margin="normal"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
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

            <div style={{ marginTop: '20px', marginBottom: '20px', fontSize: '36px', fontWeight: 700, fontStyle: 'bold' }}>
               비밀번호 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Password</p>
            </div>

            <TextField
               label="비밀번호를 입력하세요."
               type="password"
               name="password"
               fullWidth
               margin="normal"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
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
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
               <label style={{ fontSize: '31px', fontWeight: 400, cursor: 'pointer' }}>
                  <input
                     type="checkbox"
                     checked={rememberMe}
                     onChange={(e) => setRememberMe(e.target.checked)}
                     style={{
                        position: 'absolute',
                        opacity: 0 /* 완전히 투명 */,
                        width: '31px' /* 클릭 영역 */,
                        height: '31px',
                        cursor: 'pointer',
                     }}
                  />
                  <span
                     style={{
                        display: 'inline-block',
                        width: '31px',
                        height: '31px',
                        border: '2px solid #ccc',
                        marginRight: '10px',
                        verticalAlign: 'middle',
                        backgroundColor: rememberMe ? '#F0907F' : '#fff', // 체크 상태 표시
                        transition: '0.2s',
                     }}
                  ></span>
                  이메일 저장하기
               </label>
               <button
                  type="button"
                  onClick={openPopup}
                  style={{
                     border: 'none',
                     backgroundColor: 'transparent',
                     float: 'right',
                     color: '#F0907F',
                     fontSize: '31px',
                     fontWeight: 700,
                     fontStyle: 'bold',
                  }}
               >
                  비밀번호 찾기
               </button>
            </div>

            {/* 비밀번호 찾기 */}
            <div className="App" style={{ position: 'relative' }}>
               {isOpen && (
                  <div className="overlay">
                     <div
                        className="popup"
                        style={{
                           position: 'relative',
                           width: '880px',
                           height: '405px',
                           borderRadius: '100px',
                           backgroundColor: '#F0907F',
                           display: 'flex',
                           justifyContent: 'center', // 가로 중앙
                           alignItems: 'center', // 세로 중앙
                        }}
                     >
                        <button
                           className="close-btn"
                           onClick={closePopup}
                           style={{
                              borderRadius: '50px',
                              backgroundColor: 'white',
                              color: '#F0907F',
                              position: 'absolute',
                              top: '20px',
                              right: '50px',
                           }}
                        >
                           <p style={{ fontSize: '30px' }}>
                              <CloseIcon />
                           </p>
                        </button>
                        <div
                           style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '20px',
                              width: '690px',
                              height: '203px',
                           }}
                        >
                           <button
                              type="button"
                              onClick={openEmail}
                              style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '8px',
                                 border: 'none',
                                 backgroundColor: 'white',
                                 padding: '10px 20px',
                                 borderRadius: '8px',
                                 width: '100%',
                                 height: '88px',
                              }}
                           >
                              <p style={{ fontSize: '23.55px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', margin: 0, gap: '59px' }}>
                                 <AlternateEmailIcon style={{ color: '#F0907F', fontSize: '44px' }} /> 이메일로 찾기
                              </p>
                           </button>

                           <button
                              type="button"
                              onClick={openPhone}
                              style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '8px',
                                 border: 'none',
                                 backgroundColor: 'white',
                                 padding: '10px 20px',
                                 borderRadius: '8px',
                                 width: '100%',
                                 height: '88px',
                              }}
                           >
                              <p style={{ fontSize: '23.55px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', margin: 0, gap: '14px' }}>
                                 <PhoneIphoneIcon style={{ color: '#F0907F', fontSize: '44px' }} /> 핸드폰 번호로 찾기
                              </p>
                           </button>
                        </div>
                     </div>
                  </div>
               )}
               {isEmail && (
                  <div className="overlay">
                     <div
                        className="popup"
                        style={{
                           position: 'relative',
                           width: '880px',
                           height: '405px',
                           borderRadius: '100px',
                           backgroundColor: '#F0907F',
                           display: 'flex',
                           justifyContent: 'center', // 가로 중앙
                           alignItems: 'center', // 세로 중앙
                        }}
                     >
                        <button
                           className="close-btn"
                           onClick={closeEmail}
                           style={{
                              borderRadius: '50px',
                              backgroundColor: 'white',
                              color: '#F0907F',
                              position: 'absolute',
                              top: '20px',
                              left: '50px',
                           }}
                        >
                           <p style={{ fontSize: '30px' }}>
                              <ArrowBackIcon />
                           </p>
                        </button>
                        <button
                           className="close-btn"
                           onClick={() => {
                              setOpenEmail(false)
                              setIsOpen(false)
                           }}
                           style={{
                              borderRadius: '50px',
                              backgroundColor: 'white',
                              color: '#F0907F',
                              position: 'absolute',
                              top: '20px',
                              right: '50px',
                           }}
                        >
                           <p style={{ fontSize: '30px' }}>
                              <CloseIcon />
                           </p>
                        </button>
                        <div
                           style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '20px',
                              width: '690px',
                              height: '203px',
                           }}
                        >
                           <TextField
                              label="회원가입 시 작성한 이메일을 입력해주세요. navi@example.com"
                              variant="standard"
                              InputProps={{ disableUnderline: true }}
                              sx={{
                                 backgroundColor: 'white',
                                 borderRadius: '8px',
                                 height: '88px',
                                 width: '100%', // 너비 100% 유지
                                 minWidth: '400px', // 최소 너비 설정 (필요하면)
                                 boxSizing: 'border-box',
                                 '& .MuiInputBase-input': {
                                    height: '100%',
                                    boxSizing: 'border-box',
                                 },
                                 '& .MuiInputBase-root': {
                                    fontSize: '21px',
                                    fontWeight: 400,
                                    paddingLeft: '40px',
                                    top: '15px',
                                 },
                                 '& .MuiInputLabel-root': {
                                    fontSize: '21px',
                                    fontWeight: 400,
                                    paddingLeft: '40px',
                                    lineHeight: '55px',
                                 },
                              }}
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                           />
                           <button
                              type="button"
                              onClick={handleSendEmail}
                              style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '8px',
                                 border: 'none',
                                 backgroundColor: 'white',
                                 padding: '10px 20px',
                                 borderRadius: '8px',
                                 width: '100%',
                                 height: '88px',
                              }}
                           >
                              <p style={{ fontSize: '23.55px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', margin: 0, gap: '59px' }}>
                                 <AlternateEmailIcon style={{ color: '#F0907F', fontSize: '44px' }} /> 이메일로 찾기
                              </p>
                           </button>
                        </div>
                     </div>
                  </div>
               )}
               {isPhone && (
                  <div className="overlay">
                     <div
                        className="popup"
                        style={{
                           position: 'relative',
                           width: '880px',
                           height: '405px',
                           borderRadius: '100px',
                           backgroundColor: '#F0907F',
                           display: 'flex',
                           justifyContent: 'center', // 가로 중앙
                           alignItems: 'center', // 세로 중앙
                        }}
                     >
                        <button
                           className="close-btn"
                           onClick={closePhone}
                           style={{
                              borderRadius: '50px',
                              backgroundColor: 'white',
                              color: '#F0907F',
                              position: 'absolute',
                              top: '20px',
                              left: '50px',
                           }}
                        >
                           <p style={{ fontSize: '30px' }}>
                              <ArrowBackIcon />
                           </p>
                        </button>
                        <button
                           className="close-btn"
                           onClick={() => {
                              setOpenPhone(false)
                              setIsOpen(false)
                           }}
                           style={{
                              borderRadius: '50px',
                              backgroundColor: 'white',
                              color: '#F0907F',
                              position: 'absolute',
                              top: '20px',
                              right: '50px',
                           }}
                        >
                           <p style={{ fontSize: '30px' }}>
                              <CloseIcon />
                           </p>
                        </button>
                        <div
                           style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '20px',
                              width: '690px',
                              height: '203px',
                           }}
                        >
                           <TextField
                              label="회원가입 시 작성한 핸드폰 번호를 입력해주세요. 010-XXXX-XXXX"
                              variant="standard"
                              InputProps={{ disableUnderline: true }}
                              sx={{
                                 backgroundColor: 'white',
                                 borderRadius: '8px',
                                 height: '88px',
                                 width: '100%', // 너비 100% 유지
                                 minWidth: '400px', // 최소 너비 설정 (필요하면)
                                 boxSizing: 'border-box',
                                 '& .MuiInputBase-input': {
                                    height: '100%',
                                    boxSizing: 'border-box',
                                 },
                                 '& .MuiInputBase-root': {
                                    fontSize: '21px',
                                    fontWeight: 400,
                                    paddingLeft: '28px',
                                    top: '15px',
                                 },
                                 '& .MuiInputLabel-root': {
                                    fontSize: '21px',
                                    fontWeight: 400,
                                    paddingLeft: '28px',
                                    lineHeight: '55px',
                                 },
                              }}
                              value={phoneInput}
                              onChange={(e) => setPhoneInput(e.target.value)}
                           />
                           <button
                              type="button"
                              onClick={handleSendPhone}
                              style={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '8px',
                                 border: 'none',
                                 backgroundColor: 'white',
                                 padding: '10px 20px',
                                 borderRadius: '8px',
                                 width: '100%',
                                 height: '88px',
                              }}
                           >
                              <p style={{ fontSize: '23.55px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', margin: 0, gap: '59px' }}>
                                 <PhoneIphoneIcon style={{ color: '#F0907F', fontSize: '44px' }} /> 핸드폰 번호로 찾기
                              </p>
                           </button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
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
                     로그인
                  </p>
               )}
            </Button>
         </form>

         <p style={{ fontSize: '31px', fontWeight: 400, fontStyle: 'rehular', marginTop: '20px', marginBottom: '20px' }}>
            처음이시군요! 계정이 없으신가요?
            <Link to="/signup" style={{ float: 'right', color: '#F0907F', fontWeight: 700, fontStyle: 'bold' }}>
               회원가입 하기
            </Link>
         </p>
         <p style={{ textAlign: 'center', fontSize: '31px', fontWeight: 400, fontStyle: 'regular', marginTop: '20px', marginBottom: '20px' }}>다른 계정으로 로그인</p>

         <Button
            style={{
               backgroundColor: 'white',
               borderRadius: '22.5px',
            }}
            variant="contained"
            fullWidth
            sx={{
               position: 'relative',
               marginTop: '20px',
               marginBottom: '20px',
               padding: '10px 0', // 버튼 높이 여유
            }}
            onClick={() => {
               window.location.href = 'http://localhost:8000/auth/google'
            }}
         >
            <span
               style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px', // 아이콘과 텍스트 간격
                  color: 'black',
                  fontSize: '30px',
                  fontWeight: 600,
               }}
            >
               <GoogleIcon style={{ width: '45px', height: '45px' }} />
               Google
            </span>
         </Button>
      </div>
   )
}

export default Login
