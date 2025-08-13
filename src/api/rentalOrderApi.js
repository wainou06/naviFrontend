import naviApi from './axiosApi'

// 렌탈 주문 생성
export const createRentalOrder = async (rentalData) => {
   const response = await naviApi.post('/rental/orders', rentalData)
   return response.data
}

// 특정 렌탈 상품의 주문 목록 조회 (소유자/매니저용)
export const fetchRentalOrdersByItem = async (rentalItemId) => {
   const response = await naviApi.get(`/rental/orders/item/${rentalItemId}`)
   return response.data
}

// 내 렌탈 주문 목록 조회
export const fetchMyRentalOrders = async (params = {}) => {
   const response = await naviApi.get('/rental/orders/list', { params })
   return response.data
}

// 렌탈 주문 상세 조회
export const fetchRentalOrderDetail = async (orderId) => {
   const response = await naviApi.get(`/rental/orders/${orderId}`)
   return response.data
}

// 렌탈 주문 상태 수정
export const updateRentalOrderStatus = async (orderId, orderStatus) => {
   const response = await naviApi.put(`/rental/orders/${orderId}`, { orderStatus })
   return response.data
}

// 렌탈 주문 삭제
export const deleteRentalOrder = async (orderId) => {
   const response = await naviApi.delete(`/rental/orders/${orderId}`)
   return response.data
}
