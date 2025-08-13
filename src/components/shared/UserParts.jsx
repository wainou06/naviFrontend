import * as React from 'react'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

import '../../styles/userParts.css'
import MyProfile from '../auth/MyProfile'
import MyItems from '../my/MyItems'
import MyRental from '../my/MyRental'

function TabPanel(props) {
   const { children, value, index, ...other } = props

   return (
      <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
         {value === index && (
            <Box sx={{ p: 3 }}>
               <div>{children}</div>
            </Box>
         )}
      </div>
   )
}

TabPanel.propTypes = {
   children: PropTypes.node,
   index: PropTypes.number.isRequired,
   value: PropTypes.number.isRequired,
}

function a11yProps(index) {
   return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
   }
}

export default function UserParts({ user }) {
   const location = useLocation()

   const [value, setValue] = React.useState(1)

   useEffect(() => {
      if (location.pathname === '/my') {
         setValue(1)
      } else if (location.pathname === '/my/items') {
         setValue(3)
      } else if (location.pathname === '/my/rental') {
         setValue(4)
      } else if (location.pathname === '/my/deal') {
         setValue(5)
      }
   }, [location.pathname])

   const handleChange = (event, newValue) => {
      setValue(newValue)
   }

   return (
      <>
         <div className="userlinktab">
            <Tabs
               orientation="vertical"
               variant="scrollable"
               value={value}
               onChange={handleChange}
               aria-label="Vertical tabs example"
               TabIndicatorProps={{
                  sx: {
                     backgroundColor: 'transparent',
                  },
               }}
            >
               <Tab
                  disabled
                  label={
                     <div className="profile">
                        <img src="/images/로그아웃상태.png" alt="프로필" />
                        <p style={{ fontSize: '40px', margin: '20px 0px 10px' }}>{user?.nick}님</p>
                        <p style={{ fontSize: '24px', color: '#757575', fontFamily: 'Arial, sans-serif', textTransform: 'none' }}>{user?.email}</p>
                     </div>
                  }
                  {...a11yProps(0)}
               />
               <Tab label={<div style={{ width: '100%', textAlign: 'left' /* left, right, center */ }}>내 프로필</div>} {...a11yProps(1)} />
               <Tab label={<div style={{ width: '100%', textAlign: 'left' /* left, right, center */ }}>보안설정</div>} {...a11yProps(2)} />
               <Tab label={<div style={{ width: '100%', textAlign: 'left' /* left, right, center */ }}>나의 상품</div>} {...a11yProps(3)} />
               <Tab label={<div style={{ width: '100%', textAlign: 'left' /* left, right, center */ }}>렌탈 내역</div>} {...a11yProps(4)} />
               <Tab label={<div style={{ width: '100%', textAlign: 'left' /* left, right, center */ }}>거래 내역</div>} {...a11yProps(5)} />
            </Tabs>

            <TabPanel value={value} index={0} className="form">
               비활성화 상태
            </TabPanel>
            <TabPanel value={value} index={1} className="form">
               <h1>내 프로필</h1>
               <MyProfile user={user} />
            </TabPanel>
            <TabPanel value={value} index={2} className="form">
               <h1>보안설정</h1>
            </TabPanel>
            <TabPanel value={value} index={3} className="form">
               <h1>나의 상품</h1>
               <MyItems />
            </TabPanel>
            <TabPanel value={value} index={4} className="form">
               <h1>렌탈 내역</h1>
               <MyRental />
            </TabPanel>
            <TabPanel value={value} index={5} className="form">
               <h1>거래 내역</h1>
            </TabPanel>
         </div>
      </>
   )
}
