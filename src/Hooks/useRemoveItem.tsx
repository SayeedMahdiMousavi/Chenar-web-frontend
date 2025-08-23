import { message } from 'antd';
import React, { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import axiosInstance from '../pages/ApiBaseUrl';
import { ActionMessage } from '../pages/SelfComponents/TranslateComponents/ActionMessage';

interface IParams {
  baseUrl: string;
  setVisible?: (value: boolean) => void;
  recordName?: string;
  handleUpdateItems: () => void;
  removeMessage?: string;
  messageValues?: any;
}

export default function useRemoveItem({
  baseUrl,
  setVisible,
  recordName,
  handleUpdateItems,
  removeMessage,
  messageValues,
}: IParams) {
  const [removeVisible, setRemoveVisible] = useState(false);

  const { mutate: mutateDelete, ...rest } = useMutation(
    async () => await axiosInstance.delete(baseUrl),
    {
      onSuccess: () => {
        setRemoveVisible(false);
        message.success(
          <ActionMessage
            name={recordName}
            values={messageValues}
            message={removeMessage ? removeMessage : 'Message.Remove'}
          />,
        );
        handleUpdateItems();
        if (setVisible) {
          setVisible(false);
        }
      },
      onError: (error: any) => {
        if (error?.response?.data) {
          message.error(error?.response?.data?.data?.message);
        }
      },
    },
  );

  const handleDeleteItem = useCallback(() => {
    mutateDelete();
  }, [mutateDelete]);

  return { handleDeleteItem, ...rest, removeVisible, setRemoveVisible };
}
