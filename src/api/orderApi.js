import naviApi from './axiosApi'

// 주문하기
export const createOrder = async (orderDate) => {
   try {
      // orderData: 주문 상품 목록 데이터
      // { items: [{itemId: 1, count: 2 }, {itemId: 2, count: 1 }] }
      const response = await naviApi.post('/order', orderDate)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 주문 목록
export const getOrders = async (data) => {
   try {
      const { page, limit, startDate, endDate } = data

      const response = await naviApi.get(`/order/list?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 주문 취소
export const cancelOrder = async (id) => {
   try {
      const response = await naviApi.post(`/order/cancel/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

// 주문 삭제
export const deleteOrder = async (id) => {
   try {
      const response = await naviApi.delete(`/order/delete/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
