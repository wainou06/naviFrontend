import naviApi from './axiosApi'

export const registerUser = async (userData) => {
   try {
      const response = await naviApi.post('/auth/join', userData)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

export const loginUser = async (credentials) => {
   try {
      const response = await naviApi.post('/auth/login', credentials)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

export const logoutUser = async () => {
   try {
      const response = await naviApi.get('/auth/logout')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

export const checkAuthStatus = async () => {
   try {
      const response = await naviApi.get('/auth/status')
      return response.data
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
