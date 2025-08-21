import React, { useState } from "react";
import { message, Input, Form } from "antd";
import axiosInstance from "../../ApiBaseUrl";
import { useQueryClient, useMutation } from "react-query";
import { useTranslation } from "react-i18next";
import Action from "./Action";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";
import { trimString } from "../../../Functions/TrimString";
import { useMemo } from "react";
import { useCallback } from "react";
import { EditableTable } from "../../../components/antd";
import { EditableTableActionColumnRender } from "../../../components";
import { manageErrors, updateMessage } from "../../../Functions";

const EditableCell = ({
  editing,
  dataIndex,
  index,
  children,
  save,
  ...restProps
}: any) => {
  const { t } = useTranslation();

  const onClickInput = (e: any) => {
    e.stopPropagation();
  };
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: t("Form.Name_required"),
            },
            {
              whitespace: true,
              message: t("Form.Name_required"),
            },
          ]}
        >
          <Input
            onClick={onClickInput}
            onDoubleClick={onClickInput}
            onPressEnter={save}
          />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface IProps {
  baseUrl: string;
  title: string;
  model: string;
}

const IncomeTypeTable: React.FC<IProps> = ({ baseUrl, title, model }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [editingKey, setEditingKey] = useState("");

  const isEditing = useCallback(
    (record: any) => record.id === editingKey,
    [editingKey]
  );

  const edit = useCallback(
    (record: any) => {
      form.setFieldsValue({
        name: record?.name,
        ...record,
      });
      setEditingKey(record.id);
    },
    [form]
  );

  const cancel = () => {
    setEditingKey("");
  };

  const editIncomeType = async ({ value, id }: any) =>
    await axiosInstance.put(`${baseUrl}${id}/`, value);

  const { mutate: mutateEditIncomeType, isLoading } = useMutation(
    editIncomeType,
    {
      onSuccess: (values: any) => {
        setEditingKey("");
        updateMessage(values?.data?.name);
        queryClient.invalidateQueries(baseUrl);
      },
      onError: (error) => {
        manageErrors(error);
      },
    }
  );

  const save = useCallback(
    async (record: any) => {
      try {
        const row = await form.validateFields();

        const allData = {
          name: trimString(row.name),
        };
        mutateEditIncomeType({ value: allData, id: record?.id });
      } catch (errInfo) {
        
      }
    },
    [form, mutateEditIncomeType]
  );

  const columns = useMemo(
    () => (type: string, hasSelected: boolean) => {
      const sorter = type !== "print" ? true : false;
      return [
        {
          title: `${
            baseUrl !== "/expense_revenue/withdraw/"
              ? t("Expenses.Income.Income_id").toUpperCase()
              : t("Expenses.With_draw.With_draw_id").toUpperCase()
          }`,
          dataIndex: "id",
          key: "id",
          width: type !== "print" ? 150 : undefined,
          fixed: type !== "print" ? true : undefined,
          className: "table-col",
          // align: "center",
          sorter: sorter && { multiple: 2 },
        },
        {
          title: <span>{t("Form.Name").toUpperCase()}</span>,
          dataIndex: "name",
          editable: true,
          sorter: sorter && { multiple: 1 },
          key: "name",
        },

        {
          title: `${t("Table.Action")}`,
          dataIndex: "action",
          width: 70,
          key: "action",
          align: "center",
          render: (_: any, record: any) => {
            const editable = isEditing(record);
            return (
              <EditableTableActionColumnRender
                {...{
                  record,
                  save,
                  edit,
                  editingKey,
                  onCancel: cancel,
                  model: model,
                  editable,
                  disabled:
                    editingKey !== "" ||
                    record?.system_default === true ||
                    hasSelected,
                }}
              >
                <Action
                  editingKey={editingKey}
                  record={record}
                  baseUrl={baseUrl}
                  hasSelected={hasSelected}
                  model={model}
                />
              </EditableTableActionColumnRender>
            );
          },
        },
      ];
    },
    [baseUrl, t, isEditing, save, edit, editingKey, model]
  );

  const handleGetIncomes = React.useCallback(
    // @ts-ignore
    async ({ queryKey }) => {
      const { page, pageSize, search, order } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}`
      );

      return data;
    },
    [baseUrl]
  );

  return (
    <Form form={form} component={false}>
      <EditableTable
        model={model}
        placeholder={t("Employees.Filter_by_name")}
        title={title}
        columns={columns}
        queryKey={baseUrl}
        handleGetData={handleGetIncomes}
        save={save}
        editLoading={isLoading}
        edit={edit}
        editableCell={EditableCell}
        editingKey={editingKey}
      />
    </Form>
  );
};

export default IncomeTypeTable;
