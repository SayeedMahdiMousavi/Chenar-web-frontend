import { useQuery } from 'react-query';
import axiosInstance from '../pages/ApiBaseUrl';

export default function useGetRunningPeriod() {
  const { data, failureCount } = useQuery(
    '/system_setting/finance_period/get_running_period/',
    async () => {
      const result = await axiosInstance.get(
        `/system_setting/finance_period/get_running_period/`,
      );
      return result?.data;
    },
    {
      cacheTime: 86400000,
      retry: 4,
      refetchOnWindowFocus: false,
    },
  );

  return { data, failureCount };
}
