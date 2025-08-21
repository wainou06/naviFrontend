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

   const data = []
   for (let i = 0; i < rating?.length; i++) {
      data.push(rating[i].rating)
   }

   function BasicLineChart() {
      return (
         <LineChart
            xAxis={[{ data: data }]}
            series={[
               {
                  data: [0, 1, 2, 3, 4, 5],
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
