import { useQuery } from "react-query";
import axiosInstance from "../pages/ApiBaseUrl";

export default function useGetCompanyInfo() {
  const companyData = useQuery("/company/company_info/", async () => {
    const { data } = await axiosInstance.get(`/company/company_info/`);

    return data;
  },{
    refetchOnWindowFocus:false
  });
  return companyData;
}
