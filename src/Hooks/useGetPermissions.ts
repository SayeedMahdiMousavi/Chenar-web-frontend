import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import axiosInstance from '../pages/ApiBaseUrl';

export default function useGetPermissions() {
  const { i18n } = useTranslation();
  const [allData, setAllData] = useState([]);

  const handleGetPermissions = async () => {
    const { data } = await axiosInstance.get(
      `/user_account/permit/format_permission/?page_size=100`
    );
    return data;
  };

  const permissions = useQuery('/user_account/permit/', handleGetPermissions);

  const formatPermissionsList = useCallback(
    (data: any) => {
      const newList =
        data &&
        data?.map((item: any) => {
          const title =
            i18n.language === 'en'
              ? item?.en_name
              : i18n.language === 'ps'
              ? item?.ps_name
              : item?.fa_name;
          if (item.data) {
            return {
              title: title || item.menu,
              value: item?.id,
              key: item?.id,
              children: formatPermissionsList(item.data),
            };
          } else {
            return {
              title: title || item.menu,
              value: item?.id,
              key: item?.id,
            };
          }
        });

      return newList;
    },
    [i18n.language]
  );

  useEffect(() => {
    setAllData(formatPermissionsList(permissions?.data));
  }, [formatPermissionsList, permissions.data]);

  return { ...permissions, data: allData };
}
