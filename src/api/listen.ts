import request from "../utils/request";
import type { RespListenVO } from "../types";

export const getListenDetail = async (id: number): Promise<RespListenVO> => {
  const response = await request.get<RespListenVO>("/listen/v1/get2", {
    params: { id },
  });
  return response as unknown as RespListenVO;
};

export const getListenTopHelpPiao = async (
  id: number,
  count: number = 4,
): Promise<any> => {
  const response = await request.post<any>(
    `/listen/v1/listTopHelpPiao2?id=${id}&count=${count}`,
    {},
  );
  return response as unknown as any;
};

export const getCommentList = async (params: {
  current?: number;
  size?: number;
  total?: number;
  pageNo?: number;
  pageSize?: number;
  recordTotal?: number;
  targetType: number;
  targetId: number;
  orderBy?: number;
}): Promise<any> => {
  const response = await request.post<any>("/comment/v1/listForApp2", params);
  return response as unknown as any;
};
