import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, message, Popconfirm } from "antd";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { connect } from "react-redux";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";

function CustomerDetailsActive(props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [activeVisible, setActiveVisible] = useState(false);
  const [activeLoading, setActiveLoading] = useState(false);
  // const database = useDatabase();

  const { mutate: mutateActive } = useMutation(
    async (value) =>
      await axiosInstance
        .patch(`/customer_account/customer/${props?.record?.id}/`, value)
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
        queryClient.invalidateQueries(`/customer_account/customer/`);
        queryClient.invalidateQueries(`/customer_account/customer`);
        queryClient.invalidateQueries(`/customer_account/customer1/`);
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
          name={`${props?.record?.first_name} ${props?.record?.last_name}`}
          message="Message.Active"
        />
      }
      onConfirm={handelActive}
      okText={t("Manage_users.Yes")}
      cancelText={t("Manage_users.No")}
      onCancel={handelCancel}
    >
      <Button className="num" shape="round" onClick={onClickActive}>
        {t("Sales.Customers.Table.Active")}
      </Button>
    </Popconfirm>
  );
}

export default connect()(CustomerDetailsActive);
