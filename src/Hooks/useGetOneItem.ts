import { useQuery } from "react-query";
import axiosInstance from "../pages/ApiBaseUrl";

export default function useGetOneItem(url: string, restUrl: string) {
  const { data } = useQuery(
    `${url}default/`,
    async () => {
      const { data } = await axiosInstance.get(`${url}${restUrl}`);
      return data;
    },
    {
      cacheTime: 86400000,
      // refetchOnWindowFocus: false,
    }
  );
  return data;
}
