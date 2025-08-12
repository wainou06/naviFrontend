import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { TableVirtuoso } from 'react-virtuoso'
import '../../styles/managerUser.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getUserInfoThunk } from '../../features/infoSlice'
import { Box, Pagination } from '@mui/material'
import { useState } from 'react'

function ManagerUser() {
   const dispatch = useDispatch()
   const info = useSelector((state) => state.info.userInfo.users)
   const pageInfo = useSelector((state) => state.info.userInfo.pagination)
   const [rows, setRows] = useState([])
   const [pagination, setPagination] = useState(1)

   useEffect(() => {
      dispatch(getUserInfoThunk(1))
   }, [dispatch])
   console.log(pageInfo)

   useEffect(() => {
      if (info && info.length > 0) {
         const newRows = Array.from({ length: pageInfo.limit }, (_, index) => ({
            id: index,
            nick: info[index].nick,
            name: info[index].name,
            email: info[index].email,
            address: info[index].address,
            phone: info[index].phone,
         }))
         setRows(newRows)
      }
   }, [info])

   const columns = [
      {
         width: 100,
         label: '닉네임',
         dataKey: 'nick',
      },
      {
         width: 100,
         label: '이름',
         dataKey: 'name',
      },
      {
         width: 100,
         label: '이메일',
         dataKey: 'email',
         // numeric: true,
      },
      {
         width: 100,
         label: '주소',
         dataKey: 'address',
      },
      {
         width: 100,
         label: '폰 번호',
         dataKey: 'phone',
      },
      {
         width: 70,
         label: '계정 정지',
         dataKey: 'userStop',
      },
      {
         width: 90,
         label: '계정 삭제',
         dataKey: 'userDelete',
      },
   ]

   const VirtuosoTableComponents = {
      Scroller: React.forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
      Table: (props) => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
      TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
      TableRow,
      TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
   }

   function fixedHeaderContent() {
      return (
         <TableRow>
            {columns.map((column) => (
               <TableCell key={column.dataKey} variant="head" align={column.numeric || false ? 'right' : 'left'} style={{ width: column.width }} sx={{ backgroundColor: 'background.paper' }}>
                  {column.label}
               </TableCell>
            ))}
         </TableRow>
      )
   }

   function rowContent(_index, row) {
      return (
         <React.Fragment>
            {columns.map((column) => (
               <TableCell key={column.dataKey} align={column.numeric || false ? 'right' : 'left'}>
                  {column.dataKey === 'userStop' ? (
                     <a className="managerUserLink managerUserButton">stop</a>
                  ) : (
                     <>
                        {column.dataKey === 'userDelete' ? (
                           <a className="managerUserLink managerUserButton">delete</a>
                        ) : (
                           <>
                              <a className="managerUserLink">{row[column.dataKey]}</a>
                           </>
                        )}
                     </>
                  )}
               </TableCell>
            ))}
         </React.Fragment>
      )
   }

   function ReactVirtualizedTable() {
      return (
         <Paper style={{ height: 700, width: '100%' }}>
            <TableVirtuoso data={rows} components={VirtuosoTableComponents} fixedHeaderContent={fixedHeaderContent} itemContent={rowContent} />
         </Paper>
      )
   }
   return (
      <>
         <ReactVirtualizedTable></ReactVirtualizedTable>
         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination onChange={() => alert('눌렀대요')} count={pageInfo.pageCount} page={pagination} color="primary" />
         </Box>
      </>
   )
}

export default ManagerUser
