// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'

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
         <div className="homesession">
            <div className="togo">
               <Link to="/items/list">
                  <div className="navi">나누GO, 비우Go! &gt;</div>
               </Link>
               <div>
                  <img src="/images/S&R.png" alt="나비" />
               </div>
               <Link to="/rental/list">
                  <div className="rentalitem">물건 렌탈하러 가기 &gt;</div>
               </Link>
            </div>
            <div className="itemsession">
               <h1>나누는 중…</h1>
               <div className="item">
                  <ItemSellList searchTerm={searchTerm} />
               </div>
            </div>
            <div className="rentalsession">
               <h1>빌려주는 중…</h1>
               <div className="rental">
                  <RentalSellList searchTerm={searchTerm} />
               </div>
            </div>
         </div>
      </div>
   )
}

export default Home
