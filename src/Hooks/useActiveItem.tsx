import { message } from 'antd';
import React, { useCallback } from 'react';
import { useMutation } from 'react-query';
import axiosInstance from '../pages/ApiBaseUrl';
import { ActionMessage } from '../pages/SelfComponents/TranslateComponents/ActionMessage';

interface IParams {
  baseUrl: string;
  setVisible: (value: boolean) => void;
  setActiveVisible: (value: boolean) => void;
  recordName: string;
  handleUpdateItems: () => void;
  type: 'active' | 'deactivate';
}

export default function useActiveItem({
  baseUrl,
  setVisible,
  recordName,
  handleUpdateItems,
  type,
  setActiveVisible,
}: IParams) {
  const { mutate: mutateActive, ...rest } = useMutation(
    async (value: { status: string }) =>
      await axiosInstance.patch(baseUrl, value),
    {
      onSuccess: () => {
        setVisible(false);
        setActiveVisible(false);
        message.success(
          <ActionMessage
            name={recordName}
            message={type === 'active' ? 'Message.Active' : 'Message.Inactive'}
          />,
        );
        handleUpdateItems();
      },
      onError: (error: any) => {
        if (error?.response) {
          message.error(error?.response?.data?.data?.message);
        }
      },
    },
  );

  //   let oneRequest = false;
  const handleActiveItem = useCallback(() => {
    // if (oneRequest) {
    //   return;
    // }
    // oneRequest = true;
    // try {
    mutateActive({ status: type });
    //   oneRequest = false;
    // } catch (info) {
    //   oneRequest = false;
    // }
  }, [mutateActive, type]);

  return { handleActiveItem, ...rest };
}
