// 사용하는 파일
import apiClient from "@/api/apiClient";

export const getTransactionData = async (type: string, year: number) => {
  const { data } = await apiClient.get("/transactions", {
    params: { type, year },
  });
  return data;
};
