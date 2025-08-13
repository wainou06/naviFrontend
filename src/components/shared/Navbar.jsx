import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUserThunk } from '../../features/authSlice'

import Modal from '../chat/Modal'
import ChatRoomList from '../chat/ChatRoomList'

function Navbar({ isAuthenticated, user, onSearch }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [anchorElUser, setAnchorElUser] = useState(null)
   const userMenuAnchorRef = useRef(null)
   const [searchTerm, setSearchTerm] = useState('')
   const [isChatOpen, setIsChatOpen] = useState(false)

   const reduxUser = useSelector((state) => state.auth.user)
   const reduxIsAuthenticated = useSelector((state) => state.auth.isAuthenticated)

   const handleLogout = () => {
      dispatch(logoutUserThunk())
         .unwrap()
         .then(() => navigate('/'))
         .catch((error) => alert('로그아웃 실패: ' + error))
   }

   const handleOpenUserMenu = () => setAnchorElUser(userMenuAnchorRef.current)
   const handleCloseUserMenu = () => setAnchorElUser(null)

   const handleInputChange = (e) => setSearchTerm(e.target.value)

   const handleSearch = (e) => {
      e.preventDefault()
      if (onSearch && searchTerm.trim()) {
         onSearch(searchTerm.trim())
         setSearchTerm('')
      }
   }

   // 메뉴 항목 중 '1:1 채팅' 클릭시 팝업 열기 핸들러
   const handleChatOpen = () => {
      setIsChatOpen(true)
      handleCloseUserMenu()
   }
   const handleChatClose = () => setIsChatOpen(false)

   // 메뉴 구성 데이터
   const managerMenu = [
      { to: '/manager', label: '상품관리' },
      { to: '/manager/keywords', label: '키워드관리' },
      { to: '/manager/user', label: '사용자관리' },
      { to: `/manager/user/${user?.id}/rating`, label: '통계' },
      { label: '1:1 채팅', action: handleChatOpen },
      { label: '로그아웃', action: handleLogout },
   ]

   const userMenuItems = [
      { to: '/my', label: '나의 정보' },
      { to: '/my/items', label: '나의 상품' },
      { to: '/my/rental', label: '렌탈 내역' },
      { to: '/my/deal', label: '거래 내역' },
      { label: '1:1 채팅', action: handleChatOpen },
      { label: '로그아웃', action: handleLogout },
   ]

   const menuItems = user?.access === 'MANAGER' ? managerMenu : userMenuItems

   const renderUserMenu = () => (
      <Box sx={{ flexGrow: 0 }}>
         <Tooltip title="Open settings">
            <Box ref={userMenuAnchorRef} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleOpenUserMenu}>
               <Avatar alt={user?.name} src="/images/로그인상태.png" />
               <Typography sx={{ ml: 1, mr: 2, color: '#000' }}>{user?.nick}님</Typography>
            </Box>
         </Tooltip>
         <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
            {menuItems.map((item, idx) => (
               <MenuItem
                  key={idx}
                  onClick={() => {
                     handleCloseUserMenu()
                     item.action?.()
                  }}
               >
                  {item.to ? (
                     <Link to={item.to}>
                        <Typography sx={{ textAlign: 'center' }}>{item.label}</Typography>
                     </Link>
                  ) : (
                     <Typography sx={{ textAlign: 'center' }}>{item.label}</Typography>
                  )}
               </MenuItem>
            ))}
         </Menu>
      </Box>
   )

   return (
      <>
         <header>
            <div className="shadow">
               <nav>
                  <Link to="/" className="logo">
                     <img src="/images/logo.png" alt="로고" height="69" />
                  </Link>

                  <form className="search" onSubmit={handleSearch}>
                     <input type="text" placeholder="어떤 물건을 찾고 계신가요? 검색해주세요." value={searchTerm} onChange={handleInputChange} />
                     <button type="submit">
                        <SearchIcon style={{ fontSize: '30px' }} />
                     </button>
                  </form>

                  <ul className="nav_menu">
                     <li>
                        <img src="/images/고객센터.png" alt="고객센터" height="50" />
                        <span>고객센터</span>
                     </li>

                     <li>
                        {isAuthenticated ? (
                           <Link to={user.access === 'MANAGER' ? '/manager' : '/items/create'}>
                              <img src="/images/글쓰기.png" alt="상품등록" height="50" />
                              <span>{user.access === 'MANAGER' ? '상품관리' : '상품등록'}</span>
                           </Link>
                        ) : (
                           <Link to="/signup">
                              <img src="/images/회원가입.png" alt="회원가입하세요" height="50" />
                              <span>회원가입</span>
                           </Link>
                        )}
                     </li>

                     <li>
                        {isAuthenticated ? (
                           renderUserMenu()
                        ) : (
                           <Link to="/login">
                              <img src="/images/로그아웃상태.png" alt="로그인하세요" height="50" />
                              <span>로그인</span>
                           </Link>
                        )}
                     </li>
                  </ul>
               </nav>
            </div>
         </header>
         {/* 채팅 모달 */}
         <Modal isOpen={isChatOpen} onClose={handleChatClose}>
            <ChatRoomList />
         </Modal>
      </>
   )
}

export default Navbar
