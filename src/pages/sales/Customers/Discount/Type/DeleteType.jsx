import React from "react";
import { Modal, Button, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../../../ApiBaseUrl";
import { useTranslation } from "react-i18next";
import { ActionMessage } from "../../../../SelfComponents/TranslateComponents/ActionMessage";

const ReachableContext = React.createContext();
const UnreachableContext = React.createContext();

const DeleteType = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [modal, contextHolder] = Modal.useModal();

  const { mutate: mutateDelete } = useMutation(
    async (name) =>
      await axiosInstance
        .delete(`/customer_account/discount/type/${props?.record?.id}/`)
        .then((res) => {
          //   setRemoveLoading(false);
          // setRemoveVisible(false);
          message.success(
            <ActionMessage
              name={props?.record?.name}
              message="Message.Remove"
            />
          );

          //   setVisible(false);
        })
        .catch((error) => {
          //   setRemoveLoading(false);
          
        }),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(`/customer_account/discount/type/`),
    }
  );
  let oneRequest = false;
  const handelDelete = async (e) => {
    if (oneRequest) {
      return;
    }
    oneRequest = true;

    try {
      mutateDelete(props.record.name, {});

      oneRequest = false;
    } catch (info) {
      
      oneRequest = false;
    }

    // props.delete(props.record.name, e);
    // setVisible(false);
  };
  const config = {
    title: (
      <ActionMessage
        name={props?.record?.name}
        message="Message.Remove_item_message"
      />
    ),
    content: (
      <>
        <ReachableContext.Consumer>
          {(name) => `${t("Sales.Customers.Discount.Remove_Type_message1")}`}
        </ReachableContext.Consumer>
        <br />
        <UnreachableContext.Consumer>
          {(name) => `${t("Sales.Customers.Discount.Remove_Type_message")}`}
        </UnreachableContext.Consumer>
      </>
    ),
    onOk: handelDelete,
  };
  return (
    <ReachableContext.Provider value="Light">
      <Button
        shape="circle"
        size="small"
        icon={<CloseOutlined />}
        type="danger"
        onClick={() => {
          modal.confirm(config);
        }}
      ></Button>
      {/* `contextHolder` should always under the context you want to access */}
      {contextHolder}

      {/* Can not access this context since `contextHolder` is not in it */}
      <UnreachableContext.Provider value="Bamboo" />
    </ReachableContext.Provider>
  );
};

export default DeleteType;
