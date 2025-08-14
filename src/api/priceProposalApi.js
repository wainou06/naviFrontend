import naviApi from './axiosApi'

export async function createPriceProposal(proposalData) {
   try {
      const response = await naviApi.post(`/priceProposal`, proposalData, {
         withCredentials: true, // 로그인 쿠키 전송이 필요하면
      })
      return response.data
   } catch (error) {
      console.error('가격 제안 생성 실패:', error.response?.data || error.message)
      throw error
   }
}

// 특정 아이템의 가격 제안 리스트 조회
export async function fetchPriceProposals(itemId) {
   try {
      const response = await naviApi.get(`/priceProposal/${itemId}`, {
         withCredentials: true,
      })
      return response.data
   } catch (error) {
      console.error('가격 제안 리스트 조회 실패:', error.response?.data || error.message)
      throw error
   }
}

// 가격 제안 상태 변경 (수락/거절)
export const updatePriceProposalStatus = async (proposalId, status) => {
   try {
      const response = await naviApi.patch(`/priceProposal/${proposalId}/status`, { status }, { withCredentials: true })
      console.log('updatePriceProposalStatus API 응답:', response.data)
      return response.data
   } catch (error) {
      console.error('가격 제안 상태 변경 실패:', error.response?.data || error.message)
      throw error
   }
}

// 내가 보낸 가격 제안들 조회
export async function getMyProposals() {
   try {
      const response = await naviApi.get(`/priceProposal/user/sent`, {
         withCredentials: true,
      })
      return response.data
   } catch (error) {
      console.error('내가 보낸 가격 제안 조회 실패:', error.response?.data || error.message)
      throw error
   }
}

// 내가 받은 가격 제안들 조회
export async function getReceivedProposals() {
   try {
      const response = await naviApi.get(`/priceProposal/user/received`, {
         withCredentials: true,
      })
      return response.data
   } catch (error) {
      console.error('받은 가격 제안 조회 실패:', error.response?.data || error.message)
      throw error
   }
}

// 거래 완료된 내역 조회
export async function getCompletedDeals() {
   try {
      const response = await naviApi.get(`/priceProposal/user/completed`, {
         withCredentials: true,
      })
      return response.data
   } catch (error) {
      console.error('완료된 거래 조회 실패:', error.response?.data || error.message)
      throw error
   }
}
