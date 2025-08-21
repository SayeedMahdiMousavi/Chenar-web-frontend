import { useQuery } from "react-query";
import axiosInstance from "../pages/ApiBaseUrl";

export default function useGetBaseCurrency() {
  const baseCurrency = useQuery(
    "/currency/base_currency/",
    async () => {
      const result = await axiosInstance.get(`/currency/base_currency/`);
      return result.data;
    },
    {
      cacheTime: 2592000000,
      refetchOnWindowFocus: false,
    }
  );
  return baseCurrency;
}
