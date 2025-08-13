// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay' // 없어도 되지만 명시적으로 추가해도 됨

// import required modules
import { Navigation, Autoplay } from 'swiper/modules'

import { Link } from 'react-router-dom'

import ItemSellList from '../components/item/ItemSellList'
import RentalSellList from '../components/rental/RentalSellList'

function Home({ searchTerm }) {
   return (
      <div className="main">
         <div>
            <Swiper navigation={true} modules={[Navigation, Autoplay]} autoplay={{ delay: 3000, disableOnInteraction: false }}>
               <SwiperSlide>
                  <img src="/images/banner1.jpg" alt="나비 뜻" />
               </SwiperSlide>
               <SwiperSlide>
                  <img src="/images/banner2.jpg" alt="나비 슬로건" />
               </SwiperSlide>
               <SwiperSlide>
                  <img src="/images/banner3.jpg" alt="나비송" />
               </SwiperSlide>
            </Swiper>
         </div>
         <div className="togo">
            <Link to="/items/list">
               <div style={{ backgroundColor: '#AEE9F5', color: '#016CFF' }}>
                  <img src="/images/상품.png" alt="상품 리스트 페이지로" />
               </div>
            </Link>
            <div>
               <img src="/images/S&R.png" alt="" />
            </div>
            <Link to="/rental/list">
               <div style={{ backgroundColor: '#FFD1BA', color: '#AA3900' }}>
                  <img src="/images/렌탈.png" alt="렌탈 리스트 페이지로" />
               </div>
            </Link>
         </div>
         <div>
            <h1 style={{ fontFamily: 'Ghanachocolate, sans-serif' }}>나누는 중…</h1>
            <div className="item">
               <ItemSellList searchTerm={searchTerm} />
            </div>
         </div>
         <div>
            <h1 style={{ fontFamily: 'Ghanachocolate, sans-serif' }}>빌려주는 중…</h1>
            <div className="rental">
               <RentalSellList searchTerm={searchTerm} />
            </div>
         </div>
      </div>
   )
}

export default Home
