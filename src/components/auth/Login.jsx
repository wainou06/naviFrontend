import { TextField, Button, Typography, CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUserThunk } from '../../features/authSlice'
import axios from 'axios'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
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
  const { loading, error } = useSelector((state) => state.auth)

  const [rememberMe, setRememberMe] = useState(false)
  const [modalState, setModalState] = useState('') // '', 'choice', 'email', 'phone', 'tempPassword'
  const [emailInput, setEmailInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [tempPasswordMsg, setTempPasswordMsg] = useState('')

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      alert('이메일과 패스워드를 입력해주세요!')
      return
    }
    if (rememberMe) {
      localStorage.setItem('savedEmail', email)
    } else {
      localStorage.removeItem('savedEmail')
    }
    dispatch(loginUserThunk({ email, password }))
      .unwrap()
      .then(() => navigate('/'))
      .catch((error) => console.error('로그인 실패: ', error))
  }

  const handleSendEmail = async () => {
    try {
      const res = await axios.post('http://localhost:8000/auth/forgot-password-email', { email: emailInput })
      setTempPasswordMsg(`임시 비밀번호: ${res.data.tempPassword}`)
      setEmailInput('')
      setModalState('tempPassword')
    } catch (err) {
      alert(err.response?.data?.message || '오류 발생')
    }
  }

  const handleSendPhone = async () => {
    try {
      const res = await axios.post('http://localhost:8000/auth/forgot-password-phone', { phone: phoneInput })
      setTempPasswordMsg(`임시 비밀번호: ${res.data.tempPassword}`)
      setPhoneInput('')
      setModalState('tempPassword')
    } catch (err) {
      alert(err.response?.data?.message || '오류 발생')
    }
  }

  return (
    <div className="login-container">
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      <form onSubmit={handleLogin}>
        <div className="login-title">
          이메일 <p className="login-title-sub">Email</p>
        </div>

        <TextField
          placeholder="이메일을 입력하세요. navi@example.com"
          name="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-textfield"
        />

        <div className="login-title">
          비밀번호 <p className="login-title-sub">Password</p>
        </div>

        <TextField
          placeholder="비밀번호를 입력하세요."
          type="password"
          name="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-textfield"
        />

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
              <TextField
                placeholder="회원가입 시 작성한 이메일을 입력해주세요. navi@example.com"
                variant="standard"
                InputProps={{ disableUnderline: true }}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                fullWidth
                className="popup-textfield"
              />
              <button type="button" className="popup-section" onClick={handleSendEmail}>
                <AlternateEmailIcon className="icon-accent" /> 이메일로 찾기
              </button>
            </div>
          )}

          {modalState === 'phone' && (
            <div className="popup-inner">
              <TextField
                placeholder="회원가입 시 작성한 핸드폰 번호를 입력해주세요. 010-XXXX-XXXX"
                variant="standard"
                InputProps={{ disableUnderline: true }}
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                fullWidth
                className="popup-textfield"
              />
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
          window.location.href = 'http://localhost:8000/auth/google'
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
