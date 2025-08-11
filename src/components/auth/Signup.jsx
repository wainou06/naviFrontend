import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUserThunk } from '../../features/authSlice'
import { Link, useNavigate } from 'react-router-dom'

import GoogleIcon from '@mui/icons-material/Google'

import '../../styles/login.css'

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

   const handleSignup = () => {
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

      dispatch(registerUserThunk({ email, name, address, password, phone, nick }))
         .unwrap()
         .then(() => {
            // 회원가입 성공시
            setIsSignupComplete(true) // 회원가입 완료 상태 true로 변경
         })
         .catch((error) => {
            // 회원가입 중 에러 발생시
            console.error('회원가입 에러: ', error)
         })
   }

   return (
      <Container
         style={{
            margin: '0 auto',
            width: '880.5px',
            height: '935.69px',
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
               이메일 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Email</p>
            </div>

            <TextField label="이메일" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@example.com" inputProps={{ maxLength: 250 }} />

            <div style={{ marginTop: '20px', marginBottom: '20px', fontSize: '36px', fontWeight: 700, fontStyle: 'bold' }}>
               이메일 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Email</p>
            </div>

            <TextField label="사용자 이름" variant="outlined" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} inputProps={{ maxLength: 80 }} />

            <div style={{ marginTop: '20px', marginBottom: '20px', fontSize: '36px', fontWeight: 700, fontStyle: 'bold' }}>
               이메일 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Email</p>
            </div>

            <TextField label="주소" variant="outlined" type="text" fullWidth margin="normal" value={address} onChange={(e) => setAddress(e.target.value)} inputProps={{ maxLength: 80 }} />

            <div style={{ marginTop: '20px', marginBottom: '20px', fontSize: '36px', fontWeight: 700, fontStyle: 'bold' }}>
               이메일 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Email</p>
            </div>

            <TextField label="닉네임" variant="outlined" type="text" fullWidth margin="normal" value={nick} onChange={(e) => setNick(e.target.value)} inputProps={{ maxLength: 80 }} />

            <div style={{ marginTop: '20px', marginBottom: '20px', fontSize: '36px', fontWeight: 700, fontStyle: 'bold' }}>
               이메일 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Email</p>
            </div>

            <TextField label="휴대폰 번호" variant="outlined" type="text" fullWidth margin="normal" value={phone} onChange={(e) => setPhone(e.target.value)} inputProps={{ maxLength: 80 }} />

            <div style={{ marginTop: '20px', marginBottom: '20px', fontSize: '36px', fontWeight: 700, fontStyle: 'bold' }}>
               이메일 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Email</p>
            </div>

            <TextField label="비밀번호" variant="outlined" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8자리 이상이고, 영문자와 특수문자를 포함" inputProps={{ maxLength: 250 }} />

            <div style={{ marginTop: '20px', marginBottom: '20px', fontSize: '36px', fontWeight: 700, fontStyle: 'bold' }}>
               이메일 <p style={{ fontSize: '26px', display: 'inline-block', fontWeight: 500, fontStyle: 'none' }}>Email</p>
            </div>

            <TextField label="비밀번호 확인" variant="outlined" type="password" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="8자리 이상이고, 영문자와 특수문자를 포함" inputProps={{ maxLength: 250 }} />

            <Button variant="contained" color="primary" onClick={handleSignup} fullWidth disabled={loading} style={{ marginTop: '20px' }}>
               {loading ? <CircularProgress size={24} /> : '회원가입'}
            </Button>
            {isSignupComplete && (
               //회원가입이 완료 되었을때 보일 컴포넌트
               <div className="overlay">
                  <div className="popup">
                     <p>환영합니다. 회원가입이 완료되었습니다!</p>
                     <p>
                        <Link to="/login">로그인 하러 가기</Link>
                     </p>
                  </div>
               </div>
            )}
         </form>
      </Container>
   )
}

export default Signup
