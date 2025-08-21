import { useQuery } from "react-query";
import axiosInstance from "../pages/ApiBaseUrl";

export default function useGetUserInfo() {
  const id = localStorage.getItem("user_id");
  const userInfo = useQuery(
    ["/user_account/user_profile/", { id }],
    async ({ queryKey }) => {
      const { id }: any = queryKey?.[1];
      const result = await axiosInstance.get(
        `/user_account/user_profile/${id}/?expand=*`
      );

      return result.data;
    },
    { cacheTime: 86400000, enabled: !!id }
  );
  return userInfo;
}
