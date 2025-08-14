import { LineChart } from '@mui/x-charts/LineChart'

function ManagerUserRating() {
   function BasicLineChart() {
      return (
         <LineChart
            xAxis={[{ data: [0, 1, 2, 3, 4, 5] }]}
            series={[
               {
                  data: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
               },
            ]}
            height={600}
         />
      )
   }
   return (
      <>
         <BasicLineChart />
      </>
   )
}

export default ManagerUserRating
