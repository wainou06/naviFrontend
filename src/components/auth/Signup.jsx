import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUserThunk } from '../../features/authSlice'
import { Link, useNavigate } from 'react-router-dom'

import GoogleIcon from '@mui/icons-material/Google'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

import '../../styles/popup.css'

function Signup() {
   const [email, setEmail] = useState('')
   const [name, setName] = useState('')
   const [nick, setNick] = useState('')
   const [phone, setPhone] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [address, setAddress] = useState('')
   const [isSignupComplete, setIsSignupComplete] = useState(false) // 회원가입 완료 상태

   // 오타
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error } = useSelector((state) => state.auth)

   // 회원가입 팝업
   const [isOpen, setIsOpen] = useState(false)
   const openPopup = () => setIsOpen(true)

   const validateEmail = (email) => {
      // 이메일 형식인지 체크
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email) // 유효성 체크의 결과를 true, false로 리턴
   }

   const validatePassword = (password) => {
      // 비밀번호가 8자리 이상이고, 영문자와 특수문자를 포함
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      return passwordRegex.test(password)
   }

   const handleSignup = async () => {
      if (!email.trim() || !name.trim() || !address.trim() || !password.trim() || !confirmPassword.trim()) {
         alert('모든 필드를 입력해주세요!')
         return false
      }

      if (!validateEmail(email)) {
         alert('유효한 이메일 주소를 입력해주세요!')
         return false
      }

      if (!validatePassword(password) || !validatePassword(confirmPassword)) {
         alert('비밀번호는 8자리 이상이고, 영문자와 특수문자를 포함해야 합니다!')
         return false
      }

      if (password !== confirmPassword) {
         alert('비밀번호가 일치하지 않습니다!')
         return false
      }

      try {
         await dispatch(registerUserThunk({ email, name, address, password, phone, nick })).unwrap()
         openPopup()
         return true
      } catch (error) {
         console.error('회원가입 에러: ', error)
         return false
      }
   }

   return (
      <Container
         style={{
            margin: '0 auto',
            width: '880.5px',
            height: 'auto',
            marginTop: '100px',
            marginBottom: '320px',
            display: 'flex',
            flexDirection: 'column',
         }}
      >
         <Typography variant="h4" gutterBottom style={{ fontSize: '64px', fontWeight: 400 }}>
            회원가입
         </Typography>

         <form style={{ marginTop: '55px' }}>
            <p style={{ fontSize: '31.5px', fontWeight: 400, textAlign: 'center' }}>다른 방법으로 회원가입</p>
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

            {error && (
               <Typography color="error" align="center">
                  {error}
               </Typography>
            )}

            <div style={{ marginTop: '20px', marginBottom: '20px', fontSize: '36px', fontWeight: 700, fontStyle: 'bold' }}>
               이름 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Name</p>
            </div>

            <TextField
               label="이름을 입력하세요."
               name="name"
               fullWidth
               margin="normal"
               value={name}
               onChange={(e) => setName(e.target.value)}
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
               전화번호 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Phone</p>
            </div>

            <TextField
               label="핸드폰 번호를 입력해주세요. 010-XXXX-XXXX"
               name="phone"
               fullWidth
               margin="normal"
               value={phone}
               onChange={(e) => setPhone(e.target.value)}
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
               이메일 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Email</p>
            </div>

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
               name="password"
               type="password"
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

            <div style={{ marginTop: '20px', marginBottom: '20px', fontSize: '36px', fontWeight: 700, fontStyle: 'bold' }}>
               비밀번호 확인 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>CheckPassword</p>
            </div>

            <TextField
               label="비밀번호를 확인해주세요."
               name="confirmPassword"
               type="password"
               fullWidth
               margin="normal"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
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
               닉네임 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Nickname</p>
            </div>

            <TextField
               label="사용할 닉네임을 입력하세요."
               name="nick"
               fullWidth
               margin="normal"
               value={nick}
               onChange={(e) => setNick(e.target.value)}
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
               주소 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Address</p>
            </div>

            <TextField
               label="주소를 입력하세요. XX시 OO구 XX동"
               name="address"
               fullWidth
               margin="normal"
               value={address}
               onChange={(e) => setAddress(e.target.value)}
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

            {/* <Button variant="contained" color="primary" onClick={handleSignup} fullWidth disabled={loading} style={{ marginTop: '20px' }}>
               {loading ? <CircularProgress size={24} /> : '회원가입'}
            </Button> */}
            <Button
               onClick={handleSignup}
               variant="contained"
               type="button"
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
                     회원가입
                  </p>
               )}
            </Button>

            {isOpen && (
               //회원가입이 완료 되었을때 보일 컴포넌트
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
                        <p
                           style={{
                              display: 'flex',
                              alignItems: 'center',
                              border: 'none',
                              backgroundColor: 'white',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              height: '88px',
                              fontSize: '23.55px',
                              fontWeight: 500,
                              justifyContent: 'center',
                              width: '100%',
                              margin: 0,
                           }}
                        >
                           환영합니다. 회원가입이 완료되었습니다!
                        </p>

                        <button
                           type="button"
                           style={{
                              display: 'flex',
                              alignItems: 'center',
                              border: 'none',
                              backgroundColor: 'white',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              width: '100%',
                              height: '88px',
                           }}
                        >
                           <p style={{ fontSize: '23.55px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', margin: 0, gap: '59px' }}>
                              <Link to="/login">
                                 로그인 하러 가기 <NavigateNextIcon />
                              </Link>
                           </p>
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </form>
      </Container>
   )
}

export default Signup
