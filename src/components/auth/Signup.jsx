import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUserThunk } from '../../features/authSlice'
import { Link } from 'react-router-dom'
import GoogleIcon from '@mui/icons-material/Google'
import '../../styles/popup.css'

function Signup() {
   const [email, setEmail] = useState('')
   const [name, setName] = useState('')
   const [nick, setNick] = useState('')
   const [phone, setPhone] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [address, setAddress] = useState('')
   const [isOpen, setIsOpen] = useState(false) // 회원가입 완료 팝업 상태

   const dispatch = useDispatch()
   const { loading, error } = useSelector((state) => state.auth)

   const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
   }

   const validatePassword = (password) => {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      return passwordRegex.test(password)
   }

   const openPopup = () => setIsOpen(true)

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
               style={{ backgroundColor: 'white', borderRadius: '22.5px' }}
               variant="contained"
               fullWidth
               sx={{ position: 'relative', marginTop: '20px', marginBottom: '20px', padding: '10px 0' }}
               onClick={() => {
                  window.location.href = 'http://localhost:8000/auth/google'
               }}
            >
               <span
                  style={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     gap: '10px',
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

            {/* 입력 필드 반복적으로 정리 */}
            {[
               { label: '이름을 입력하세요.', value: name, setter: setName, name: 'name' },
               { label: '핸드폰 번호를 입력해주세요. 010-XXXX-XXXX', value: phone, setter: setPhone, name: 'phone' },
               { label: '이메일을 입력하세요. navi@example.com', value: email, setter: setEmail, name: 'email' },
               { label: '비밀번호를 입력하세요.', value: password, setter: setPassword, name: 'password', type: 'password' },
               { label: '비밀번호를 확인해주세요.', value: confirmPassword, setter: setConfirmPassword, name: 'confirmPassword', type: 'password' },
               { label: '사용할 닉네임을 입력하세요.', value: nick, setter: setNick, name: 'nick' },
               { label: '주소를 입력하세요. XX시 OO구 XX동', value: address, setter: setAddress, name: 'address' },
            ].map(({ label, value, setter, name, type = 'text' }) => (
               <div key={name} style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <TextField
                     label={label}
                     name={name}
                     type={type}
                     fullWidth
                     margin="normal"
                     value={value}
                     onChange={(e) => setter(e.target.value)}
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
               </div>
            ))}

            <Button
               onClick={async () => {
                  await handleSignup()
               }}
               variant="contained"
               type="button"
               fullWidth
               disabled={loading}
               sx={{ position: 'relative', marginTop: '20px', marginBottom: '20px' }}
               style={{ backgroundColor: '#F0907F', borderRadius: '30px', height: '112px' }}
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
                  <p style={{ fontSize: '36px', fontWeight: 500 }}>회원가입</p>
               )}
            </Button>

            {isOpen && (
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