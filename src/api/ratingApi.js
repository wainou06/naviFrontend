import api from './axiosApi'

export const getBuyerRating = async ({ userId, itemId }) => {
   try {
      const response = await api.get(`/rating/${userId}`, { params: { itemId: itemId } })
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

export const postRating = async (data) => {
   try {
      const response = await api.post('/rating', { data })
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

export const postRentalRating = async (data) => {
   try {
      const response = await api.post('/rating/rental', { data })
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
