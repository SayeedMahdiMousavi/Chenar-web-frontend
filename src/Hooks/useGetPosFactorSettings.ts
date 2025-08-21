import { useQuery } from "react-query";
import axiosInstance from "../pages/ApiBaseUrl";

export default function useGetPosFactorSettings() {
  const posSettings = useQuery(
    "/setting/pos_invoice/get_default_setting/",
    async () => {
      const { data } = await axiosInstance.get(
        `/setting/pos_invoice/get_default_setting/?invoice_type=sales_pos`
      );

      return data;
    }
  );
  return posSettings;
}
