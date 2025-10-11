import axiosInstance from './axiosInstance'

interface EarningsResponse {
  data: {
    id: string
    date: string
    amount: number
    status: string
    tripCount: number
  }[]
  total: number
}

const EarningsService = {
  getRiderEarnings: async (
    riderId: string,
    page: number,
    limit: number
  ): Promise<EarningsResponse> => {
    const response = await axiosInstance.get(`/api/riders/${riderId}/earnings`, {
      params: {
        page,
        limit,
      },
    })
    return response.data
  },
}

export default EarningsService