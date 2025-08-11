import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { TableVirtuoso } from 'react-virtuoso'
import Chance from 'chance'
import '../../styles/managerUser.css'

const chance = new Chance(42)

function createData(id) {
   return {
      id,
      nick: chance.first(),
      name: chance.last(),
      email: chance.email(),
      address: chance.state({ full: true }),
      phone: chance.phone(),
   }
}

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
]

const rows = Array.from({ length: 200 }, (_, index) => createData(index))

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
               <a className="managerUserLink">{row[column.dataKey]}</a>
            </TableCell>
         ))}
      </React.Fragment>
   )
}

export function ReactVirtualizedTable() {
   return (
      <Paper style={{ height: 700, width: '100%' }}>
         <TableVirtuoso data={rows} components={VirtuosoTableComponents} fixedHeaderContent={fixedHeaderContent} itemContent={rowContent} />
      </Paper>
   )
}

function ManagerUser() {
   return (
      <>
         <ReactVirtualizedTable></ReactVirtualizedTable>
      </>
   )
}

export default ManagerUser
