import axios from 'axios'
import api from './axiosApi'

const BASE_URL = import.meta.env.VITE_APP_PYTHON_API_URL

//axios 인스턴스 생성
const pythonApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json', // request, response 할때 json 객체로 주고 받겠다
   },
   withCredentials: true, // 세션이나 쿠키를 request에 포함
})

// 주문갯수로 추천
export const recommendOrderCountUser = async (userId) => {
   try {
      const response = await pythonApi.get(`/recommend?user_id=${userId}`)
      const recommendData = response.data

      const responseFinal = await api.post('/recommend/recommend', recommendData)
      return responseFinal
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
