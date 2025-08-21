import React, { useState } from "react";
import { Input, Form } from "antd";
import axiosInstance from "../../ApiBaseUrl";
import { useQueryClient, useMutation } from "react-query";
import { useTranslation } from "react-i18next";
import Action from "./Action";
import { trimString } from "../../../Functions/TrimString";
import { useMemo } from "react";
import { useCallback } from "react";
import {
  EditableTable,
  InfiniteScrollSelectFormItem,
  AntdTag,
} from "../../../components/antd";
import { Colors } from "../../colors";
import { CASH_M } from "../../../constants/permissions";
import { EditableTableActionColumnRender } from "../../../components";
import { manageErrors, updateMessage } from "../../../Functions";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  index,
  children,
  save,
  ...restProps
}: any) => {
  const { t } = useTranslation();

  const message =
    dataIndex === "cashier"
      ? t("Banking.Cash_box.Cashier_required")
      : t("Form.Name_required");
  return (
    <td {...restProps}>
      {editing ? (
        dataIndex === "cashier" ? (
          <InfiniteScrollSelectFormItem
            name="employee"
            mode="multiple"
            style={styles.formItem}
            fields="full_name,id"
            baseUrl="/staff_account/staff/"
            rules={[
              {
                required: true,
                message: message,
              },
            ]}
          />
        ) : (
          <Form.Item
            name={dataIndex}
            style={styles.formItem}
            rules={[
              {
                required: true,
                message: message,
              },
              {
                whitespace: true,
                message: message,
              },
            ]}
          >
            <Input className="num" onPressEnter={save} />
          </Form.Item>
        )
      ) : (
        children
      )}
    </td>
  );
};

interface IProps {
  baseUrl: string;
}

const CashBox: React.FC<IProps> = (props) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const edit = useCallback(
    (record: any) => {
      form.setFieldsValue({
        account_name: record?.account_name,
        employee: record?.cashier?.map((item: any) => {
          return { label: item?.full_name, value: item?.id };
        }),
        // ...record,
      });
      setEditingKey(record.id);
    },
    [form]
  );

  const cancel = () => {
    setEditingKey("");
  };

  const editCashBox = async ({ value, id }: any) =>
    await axiosInstance.put(`${props.baseUrl}${id}/`, value);

  const { mutate: mutateEditCashbox, isLoading } = useMutation(editCashBox, {
    onSuccess: (values: any) => {
      setEditingKey("");
      updateMessage(values?.data?.account_name);

      queryClient.invalidateQueries(props.baseUrl);
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const save = useCallback(
    async (record: any) => {
      try {
        const row = await form.validateFields();
        const cashier = row?.employee?.map(
          (item: { value: number }) => item?.value
        );
        const allData = {
          account_name: trimString(row.account_name),
          cashier: cashier,
        };
        mutateEditCashbox({ value: allData, id: record.id });
      } catch (errInfo) {
        // 
      }
    },
    [form, mutateEditCashbox]
  );

  const columns = useMemo(
    () => (type: string, hasSelected: boolean) => {
      const sorter = type !== "print" ? true : false;
      return [
        {
          title: `${t("Banking.Cash_box.Cash_box_id").toUpperCase()}`,
          dataIndex: "id",
          key: "id",
          width:
            type !== "print" ? (i18n.language === "en" ? 140 : 165) : undefined,
          fixed: type !== "print" ? true : undefined,
          className: "table-col",
          // align: "center",
          sorter: sorter && { multiple: 3 },
        },
        {
          title: <span>{t("Form.Name").toUpperCase()}</span>,
          dataIndex: "account_name",
          editable: true,
          sorter: sorter && { multiple: 2 },
          key: "account_name",
        },
        {
          title: `${t("Banking.Cash_box.Cashier").toUpperCase()}`,
          dataIndex: "cashier",
          key: "cashier",

          render: (text: any, record: any) => (
            <div>
              {text?.map((item: any) => (
                <AntdTag key={item?.id} color={Colors.primaryColor}>
                  {item?.full_name}
                </AntdTag>
              ))}
            </div>
          ),
          sorter: sorter && { multiple: 1 },
          editable: true,
        },

        {
          title: `${t("Table.Action")}`,
          dataIndex: "action",
          width: 70,
          key: "action",
          align: "center",
          fixed: "right",
          // className: "table-col",
          render: (_: any, record: any) => {
            return (
              <EditableTableActionColumnRender
                {...{
                  record,
                  save,
                  edit,
                  editingKey,
                  onCancel: cancel,
                  model: CASH_M,
                  disabled: editingKey !== "" || hasSelected,
                }}
              >
                <Action
                  editingKey={editingKey}
                  record={record}
                  hasSelected={hasSelected}
                  baseUrl={props.baseUrl}
                />
              </EditableTableActionColumnRender>
            );
          },
        },
      ];
    },
    [edit, editingKey, i18n.language, props.baseUrl, save, t]
  );

  const handleGetCashes = useCallback(
    // @ts-ignore
    async ({ queryKey }) => {
      const { page, pageSize, search, order } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&expand=*`
      );

      return data;
    },
    [props.baseUrl]
  );

  return (
    <Form form={form} component={false}>
      <EditableTable
        model={CASH_M}
        placeholder={t("Employees.Filter_by_name")}
        title={t("Banking.Cash_box.1")}
        columns={columns}
        queryKey={props.baseUrl}
        handleGetData={handleGetCashes}
        save={save}
        editLoading={isLoading}
        edit={edit}
        editableCell={EditableCell}
        editingKey={editingKey}
      />
    </Form>
  );
};
const styles = {
  formItem: { marginBottom: "0px" },
};

export default CashBox;
