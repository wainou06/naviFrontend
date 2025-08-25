import axios from 'axios'
import api from './axiosApi'

const BASE_URL = import.meta.env.VITE_APP_PYTHON_API_URL

//axios 인스턴스 생성
const pythonApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true,
})

// 주문갯수로 추천
export const recommendOrderCountUser = async (userId) => {
   try {
      const response = await pythonApi.get(`/recommend?user_id=${userId}`)

      const recommendData = response.data

      const recommendId = []

      for (let i = 0; i < recommendData.length; i++) {
         if (recommendData[i].userId !== userId) recommendId.push(recommendData[i].userId)
      }

      const responseFinal = await api.post('/recommend/recommend', recommendId)
      return responseFinal
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
