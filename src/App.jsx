import { checkAuthStatusThunk } from './features/authSlice'

import { Route, Routes, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import './styles/common.css'
import './styles/itemCreate.css'
import './styles/itemList.css'

import Home from './pages/Home'
import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ItemCreatePage from './pages/ItemCreatePage'
import ItemListPage from './pages/ItemListPage'
import ItemEditPage from './pages/ItemEditPage'
import ItemDetailPage from './pages/ItemDetailPage'
import ManagerPage from './pages/ManagerPage'
import RentalListPage from './pages/RentalListPage'
import RentalCreatePage from './pages/RentalCreatePage'
import RentalDetailPage from './pages/RentalDetailPage'
import MyPage from './pages/MyPage'
import RentalEditPage from './pages/RentalEditPage'

function App() {
   const dispatch = useDispatch()
   const location = useLocation()
   const { isAuthenticated, user } = useSelector((state) => state.auth)

   const [searchTerm, setSearchTerm] = useState('')
   const onSearch = (search) => {
      setSearchTerm(search)
   }

   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])

   return (
      <>
         <Navbar isAuthenticated={isAuthenticated} user={user} onSearch={onSearch} />
         <Routes>
            <Route path="/" element={<Home searchTerm={searchTerm} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/my" element={<MyPage user={user} />} />
            <Route path="/my/items" element={<MyPage user={user} />} />
            <Route path="/my/rental" element={<MyPage user={user} />} />
            <Route path="/my/deal" element={<MyPage user={user} />} />

            <Route path="/items/list" element={<ItemListPage key={location.key} />} />
            <Route path="/items/create" element={<ItemCreatePage />} />
            <Route path="/items/edit/:id" element={<ItemEditPage />} />
            <Route path="/items/detail/:id" element={<ItemDetailPage />} />

            <Route path="/manager" element={<ManagerPage user={user} />} />
            <Route path="/manager/keywords" element={<ManagerPage user={user} />} />
            <Route path="/manager/user" element={<ManagerPage user={user} />} />
            <Route path="/manager/user/:id/rating" element={<ManagerPage user={user} />} />

            <Route path="/rental/list" element={<RentalListPage />} />
            <Route path="/rental/create" element={<RentalCreatePage />} />
            <Route path="/rental/detail/:id" element={<RentalDetailPage />} />
            <Route path="/rental/edit/:id" element={<RentalEditPage />} />

            <Route path="/manager" element={<ManagerPage user={user} />} />
            <Route path="/manager/keywords" element={<ManagerPage user={user} />} />
            <Route path="/manager/user" element={<ManagerPage user={user} />} />
            <Route path="/manager/user/:id/rating" element={<ManagerPage user={user} />} />
         </Routes>
         <Footer />
      </>
   )
}

export default App
