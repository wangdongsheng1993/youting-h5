import request from '../utils/request'
import type { RespListenVO } from '../types'

export const getListenDetail = async (id: number): Promise<RespListenVO> => {
  const response = await request.get<RespListenVO>('/listen/v1/get', { params: { id } })
  return response as unknown as RespListenVO
}
