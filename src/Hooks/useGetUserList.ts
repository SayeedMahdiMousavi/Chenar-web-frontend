import { useQuery } from 'react-query';
import { USERS_LIST } from '../constants/routes';
import axiosInstance from '../pages/ApiBaseUrl';

export function useGetUserList() {
  const result = useQuery(`${USERS_LIST}/sidebar/`, async () => {
    const result = await axiosInstance.get(
      `${USERS_LIST}?page=1&page_size=10&fields=id,photo,username`,
    );
    return result?.data;
  });

  return result;
}
