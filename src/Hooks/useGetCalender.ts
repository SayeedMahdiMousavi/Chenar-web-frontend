import { useQuery } from "react-query";
import axiosInstance from "../pages/ApiBaseUrl";

export default function useGetCalender() {
  const id = localStorage.getItem("user_id");
  const userCalender = useQuery(
    "/user_account/user_profile/calender/",
    async () => {
      const { data } = await axiosInstance.get(
        `/user_account/user_profile/${id}/?expand=user_calender&fields=user_calender`
      );
      // 
      return data;
    },
    {
      cacheTime: 86400000,
      // refetchOnWindowFocus: false,
      enabled: !!id,
      refetchOnWindowFocus:false
    }
  );
  return userCalender;
}
