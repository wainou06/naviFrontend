import api from './axiosApi'

export const postKeyword = async (name) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'application/json',
         },
      }
      const response = await api.post('/keyword', { name: name }, config)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

export const getKeyword = async () => {
   try {
      const response = await api.get('/keyword')
      return response
   } catch (error) {
      console.error(`API Reques 오류: ${error}`)
      throw error
   }
}

export const putKeyword = async (id, name) => {
   try {
      const config = {
         headers: {
            'Content-type': 'application/json',
         },
      }

      const response = await api.put(`/keyword/${id}`, { name: name }, config)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

export const deleteKeyword = async (id) => {
   try {
      const response = await api.delete(`/keyword/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
   }
}
