import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, message, Popconfirm } from "antd";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";

function SupplierDetailsActive(props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [activeVisible, setActiveVisible] = useState(false);
  const [activeLoading, setActiveLoading] = useState(false);

  const { mutate: mutateActive } = useMutation(
    async (value) =>
      await axiosInstance
        .patch(`/supplier_account/supplier/${props?.record?.id}/`, value)
        .then((res) => {
          setActiveLoading(false);
          message.success(
            <ActionMessage
              name={`${props?.record?.first_name} ${props?.record?.last_name}`}
              message="Message.Active"
            />
          );
        })
        .catch((error) => {
          setActiveLoading(false);
          
        }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`/supplier_account/supplier/`);
        queryClient.invalidateQueries(`/supplier_account/supplier`);
        queryClient.invalidateQueries(`/supplier_account/supplier1/`);
      },
    }
  );

  let inactive = false;
  const handelActive = async () => {
    if (inactive) {
      return;
    }
    inactive = true;
    setActiveLoading(true);
    try {
      mutateActive(
        { status: "active" },
        {
          onSuccess: () => {},
        }
      );
      inactive = false;
    } catch (info) {
      
      inactive = false;
    }
  };
  const handelCancel = () => {
    setActiveLoading(false);
    setActiveVisible(false);
  };

  const onClickActive = () => {
    setActiveVisible(!activeVisible);
  };
  return (
    <Popconfirm
      placement="topRight"
      open={activeVisible}
      okButtonProps={{ loading: activeLoading }}
      title={
        <ActionMessage
          name={props?.record?.first_name}
          message="Message.Remove_item_message"
        />
      }
      onConfirm={handelActive}
      okText={t("Manage_users.Yes")}
      cancelText={t("Manage_users.No")}
      onCancel={handelCancel}
    >
      <Button shape="round" onClick={onClickActive}>
        {t("Sales.Customers.Table.Active")}
      </Button>
    </Popconfirm>
  );
}

export default SupplierDetailsActive;
