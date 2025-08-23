import { useQuery } from 'react-query';
import { useGetBaseCurrency } from '.';
import { DEBIT_CREDIT_P } from '../constants/permissions';
import { DEBIT_CREDIT_RESULT_LIST } from '../constants/routes';
import { reportsDateFormat } from '../Context';
import { checkPermissions } from '../Functions';
import { utcDate } from '../Functions/utcDate';
import axiosInstance from '../pages/ApiBaseUrl';

export function useGetDebitCreditResult({
  startDate,
  transactionType,
}: {
  startDate: string;
  transactionType?: string;
}) {
  const baseCurrency = useGetBaseCurrency();
  const currencyId = baseCurrency?.data?.id;

  const data = useQuery(
    [DEBIT_CREDIT_RESULT_LIST, { startDate, transactionType, currencyId }],
    async ({ queryKey }) => {
      const { startDate, transactionType, currencyId }: any = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${DEBIT_CREDIT_RESULT_LIST}?date_time_after=${startDate}&date_time_before=${utcDate().format(
          reportsDateFormat,
        )}&transaction_type=${transactionType ?? ''}&&currency=${currencyId}`,
      );
      return data;
    },
    {
      enabled: checkPermissions(DEBIT_CREDIT_P) && !!currencyId && !!startDate,
      refetchOnWindowFocus: false,
    },
  );
  return data;
}
