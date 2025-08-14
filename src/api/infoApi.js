import api from './axiosApi'

//유저 조회

export const getUserInfo = async (page) => {
   try {
      const response = await api.get(`/info/managerUser/${page}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//계정 삭제

export const deleteUserInfo = async (id) => {
   try {
      const response = await api.delete(`/info/managerUserDelete/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
   }
}

//계정 정지

export const suspendUserInfo = async (id, date) => {
   try {
      const response = await api.put(`/info/managerUserSuspend/${id}`, { date: date })
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//비밀번호 수정

export const userPasswordEdit = async (data) => {
   try {
      console.log(data)
      const response = await api.put('/info/userPasswordEdit', data)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
