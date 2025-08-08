import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import '../../styles/managerParts.css'

function TabPanel(props) {
   const { children, value, index, ...other } = props

   return (
      <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
         {value === index && (
            <Box sx={{ p: 3 }}>
               <Typography>{children}</Typography>
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

export default function ManagerParts({ user }) {
   const [value, setValue] = React.useState(1)

   const handleChange = (event, newValue) => {
      setValue(newValue)
   }

   return (
      <>
         <div className="linktab">
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
                        <p style={{ fontSize: '40px', margin: '20px 0px 10px' }}>관리자 {user?.nick}님</p>
                        <p style={{ fontSize: '24px', color: '#757575', fontFamily: 'Arial, sans-serif', textTransform: 'none' }}>{user?.email}</p>
                     </div>
                  }
                  {...a11yProps(0)}
               />
               <Tab label={<div style={{ width: '100%', textAlign: 'left' /* left, right, center */ }}>상품관리</div>} {...a11yProps(1)} />
               <Tab label={<div style={{ width: '100%', textAlign: 'left' /* left, right, center */ }}>키워드관리</div>} {...a11yProps(2)} />
               <Tab label={<div style={{ width: '100%', textAlign: 'left' /* left, right, center */ }}>사용자관리</div>} {...a11yProps(3)} />
               <Tab label={<div style={{ width: '100%', textAlign: 'left' /* left, right, center */ }}>통계</div>} {...a11yProps(4)} />
            </Tabs>

            <TabPanel value={value} index={0} className="form">
               Item One
            </TabPanel>
            <TabPanel value={value} index={1} className="form">
               Item Two
            </TabPanel>
            <TabPanel value={value} index={2} className="form">
               Item Three
            </TabPanel>
            <TabPanel value={value} index={3} className="form">
               Item Four
            </TabPanel>
            <TabPanel value={value} index={4} className="form">
               Item Five
            </TabPanel>
         </div>
      </>
   )
}
