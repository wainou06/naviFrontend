import naviApi from './axiosApi'

export const rentalItemsAPI = {
   // 렌탈상품 목록 조회 (페이징, 검색 기능 포함)
   getRentalItems: async (params = {}) => {
      try {
         const response = await naviApi.get('/rental/list', { params })
         return response.data
      } catch (error) {
         console.error('렌탈상품 목록 조회 오류:', error)
         throw error.response?.data || error
      }
   },

   // 특정 렌탈상품 조회
   getRentalItem: async (id) => {
      try {
         const response = await naviApi.get(`/rental/detail/${id}`)
         return response.data
      } catch (error) {
         console.error('렌탈상품 조회 오류:', error)
         throw error.response?.data || error
      }
   },

   // 렌탈상품 등록 (이미지 포함)
   createRentalItem: async (rentalItemData) => {
      try {
         const formData = new FormData()

         // 기본 렌탈상품 정보 추가
         formData.append('rentalItemNm', rentalItemData.rentalItemNm)
         formData.append('oneDayPrice', rentalItemData.oneDayPrice)
         formData.append('quantity', rentalItemData.quantity)
         if (rentalItemData.rentalDetail) formData.append('rentalDetail', rentalItemData.rentalDetail)
         if (rentalItemData.rentalStatus) formData.append('rentalStatus', rentalItemData.rentalStatus)
         if (rentalItemData.keywords) formData.append('keywords', rentalItemData.keywords)

         // 이미지 파일들 추가
         if (rentalItemData.images && rentalItemData.images.length > 0) {
            rentalItemData.images.forEach((image) => {
               formData.append('img', image)
            })
         }

         const response = await naviApi.post('/rental/', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         })
         return response.data
      } catch (error) {
         console.error('렌탈상품 등록 오류:', error)
         throw error.response?.data || error
      }
   },

   // 렌탈상품 수정 (이미지 포함)
   updateRentalItem: async (id, rentalItemData) => {
      try {
         // FormData가 이미 전달된 경우 그대로 서버에 전송
         if (rentalItemData instanceof FormData) {
            console.log('FormData로 받음 - 그대로 전송')

            const response = await naviApi.put(`/rental/edit/${id}`, rentalItemData, {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            })
            return response.data
         }

         // 일반 객체로 받은 경우 FormData로 변환 (기존 방식 유지)
         console.log('일반 객체로 받음 - FormData로 변환')
         const formData = new FormData()

         if (rentalItemData.rentalItemNm !== undefined) formData.append('rentalItemNm', rentalItemData.rentalItemNm)
         if (rentalItemData.oneDayPrice !== undefined) formData.append('oneDayPrice', rentalItemData.oneDayPrice)
         if (rentalItemData.quantity !== undefined) formData.append('quantity', rentalItemData.quantity)
         if (rentalItemData.rentalDetail !== undefined) formData.append('rentalDetail', rentalItemData.rentalDetail)
         if (rentalItemData.rentalStatus !== undefined) formData.append('rentalStatus', rentalItemData.rentalStatus)
         if (rentalItemData.keywords !== undefined) formData.append('keywords', rentalItemData.keywords)

         if (rentalItemData.deleteImages && rentalItemData.deleteImages.length > 0) {
            formData.append('deleteImages', JSON.stringify(rentalItemData.deleteImages))
         }

         if (rentalItemData.images && rentalItemData.images.length > 0) {
            rentalItemData.images.forEach((image) => {
               formData.append('img', image)
            })
         }

         const response = await naviApi.put(`/rental/edit/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         })
         return response.data
      } catch (error) {
         console.error('렌탈상품 수정 오류:', error)
         throw error.response?.data || error
      }
   },

   // 렌탈 상품 삭제
   deleteRentalItem: async (id) => {
      try {
         const response = await naviApi.delete(`/rental/${id}`)
         return response.data
      } catch (error) {
         console.error('렌탈상품 삭제 오류:', error)
         throw error.response?.data || error
      }
   },
}
