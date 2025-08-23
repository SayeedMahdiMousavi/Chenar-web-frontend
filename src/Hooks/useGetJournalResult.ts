import { useQuery } from 'react-query';
import { useGetBaseCurrency } from '.';
import { JOURNAL_M } from '../constants/permissions';
import { JOURNAL_RESULT_LIST } from '../constants/routes';
import { reportsDateFormat } from '../Context';
import { checkPermissions } from '../Functions';
import { utcDate } from '../Functions/utcDate';
import axiosInstance from '../pages/ApiBaseUrl';

export function useGetJournalResult({
  startDate,
  accountType,
}: {
  startDate: string;
  accountType: string;
}) {
  const baseCurrency = useGetBaseCurrency();
  const currencyId = baseCurrency?.data?.id;

  const data = useQuery(
    [JOURNAL_RESULT_LIST, { startDate, accountType, currencyId }],
    async ({ queryKey }) => {
      const { startDate, accountType, currencyId }: any = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${JOURNAL_RESULT_LIST}?date_time_after=${startDate}&date_time_before=${utcDate().format(
          reportsDateFormat,
        )}&account_type=${accountType}&&currency=${currencyId}`,
      );
      return data;
    },
    {
      enabled: !!startDate && checkPermissions(JOURNAL_M) && !!currencyId,
      refetchOnWindowFocus: false,
    },
  );
  return data;
}
