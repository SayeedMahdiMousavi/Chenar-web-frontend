import { useQuery } from "react-query";
import { INVOICES_P } from "../constants/permissions";
import { INVOICES_RESULT_LIST } from "../constants/routes";
import { checkPermissions } from "../Functions";
import { utcDate } from "../Functions/utcDate";
import axiosInstance from "../pages/ApiBaseUrl";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
export default function useGetInvoicesResult(
  startDate: string,
  invoiceType: string
) {
  const data = useQuery(
    [INVOICES_RESULT_LIST, { startDate, invoiceType }],
    async ({ queryKey }) => {
      const { startDate, invoiceType }: any = queryKey?.[1];

      const { data } = await axiosInstance.get(
        `${INVOICES_RESULT_LIST}?date_time_after=${startDate}&date_time_before=${utcDate().format(
          dateFormat
        )}&page_size=200`
      );
      return data;
    },
    {
      enabled: !!startDate && checkPermissions(INVOICES_P),
      // refetchOnWindowFocus:false
    }
  );
  return data;
}
