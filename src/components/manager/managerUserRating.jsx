import { LineChart } from '@mui/x-charts/LineChart'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRatingThunk } from '../../features/ratingSlice'

function ManagerUserRating() {
   const dispatch = useDispatch()
   const rating = useSelector((state) => state.rating.rating.rating)
   const query = window.location.search.substring(1)

   useEffect(() => {
      if (query) {
         dispatch(getRatingThunk(query))
      }
   }, [dispatch, query])

   const xAxisLabels = rating?.map((_, index) => `${index + 1}번째 `)
   const yAxisData = rating?.map((item) => item.rating)

   function BasicLineChart() {
      return (
         <LineChart
            xAxis={[{ scaleType: 'point', data: xAxisLabels }]}
            series={[
               {
                  data: yAxisData,
               },
            ]}
            height={600}
         />
      )
   }
   return (
      <>
         {query ? (
            <>
               {rating?.length ? (
                  <>
                     <BasicLineChart />
                  </>
               ) : (
                  <h2>별점을 받지 않았나 봐요</h2>
               )}
            </>
         ) : (
            <>
               <h2>사용자관리에서 유저를 클릭하세요</h2>
            </>
         )}
      </>
   )
}

export default ManagerUserRating
