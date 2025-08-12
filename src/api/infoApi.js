import api from './axiosApi'

export const getUserInfo = async (page) => {
   try {
      const response = await api.get(`/info/managerUser/${page}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
