import React, { useCallback, useMemo, useState } from "react";
import { message, InputNumber, Form } from "antd";
import axiosInstance from "../../ApiBaseUrl";
import { useMutation, useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { ActionMessage } from "../../SelfComponents/TranslateComponents/ActionMessage";
import { EditableTable, Statistics } from "../../../components/antd";
import { currencyHistoryBaseUrl } from "../../Reports/AllReports/CurrencyHistory/CurrencyHistory";
import { CURRENCY_RATE_M } from "../../../constants/permissions";
import { EditableTableActionColumnRender } from "../../../components";
import { manageErrors } from "../../../Functions";

const EditableCell = ({
  editing,
  dataIndex,
  index,
  children,
  save,
  ...restProps
}: any) => {
  const { t } = useTranslation();
  const handleStopPropagation = (e: any) => {
    e.stopPropagation();
  };
  const handleSelectValueOfInputNumber = (e: any) => {
    e.target.select();
  };
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          //@ts-ignore
          onDoubleClick={handleStopPropagation}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message:
                dataIndex === "base_amount"
                  ? t(
                      "Sales.Product_and_services.Currency.Default_rate_required"
                    )
                  : t(
                      "Sales.Product_and_services.Currency.Currency_rate_required"
                    ),
            },
          ]}
        >
          <InputNumber
            min={0}
            type="number"
            className="num"
            inputMode="numeric"
            onFocus={handleSelectValueOfInputNumber}
            // onPressEnter={() => save(record)}
          />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function CurrencyRateTable(props: { baseUrl: string }) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const isEditing = useCallback(
    (record: any) => record.symbol === editingKey,
    [editingKey]
  );

  const edit = useCallback(
    (record: any) => {
      form.setFieldsValue({
        equal_amount: parseFloat(record?.equal_amount ?? 0),
        base_amount: parseFloat(record?.base_amount ?? 0),
        // ...record,
      });
      setEditingKey(record.symbol);
    },
    [form]
  );

  const cancel = () => {
    setEditingKey("");
  };

  const editCurrencyRate = async ({ value, symbol }: any) =>
    axiosInstance.post(`/currency/${symbol}/set_currency_rate/`, value);

  const { mutate: mutateEditCurrencyRate, isLoading } = useMutation(
    editCurrencyRate,
    {
      onSuccess: (values: any) => {
        message.success(
          <ActionMessage
            name={values?.data?.name}
            message="Sales.Product_and_services.Currency.Update_currency_rate_message"
          />
        );
        setEditingKey("");

        queryClient.invalidateQueries(props?.baseUrl);
        queryClient.invalidateQueries(currencyHistoryBaseUrl);
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
          base_amount: row.base_amount,
          equal_amount: row.equal_amount,
        };
        mutateEditCurrencyRate({ value: allData, symbol: record.symbol });
      } catch (errInfo) {
        // 
      }
    },
    [form, mutateEditCurrencyRate]
  );

  const columns = useMemo(
    () => () =>
      [
        {
          title: (
            <span>
              {t(
                "Sales.Product_and_services.Currency.Currency_rate"
              ).toUpperCase()}
            </span>
          ),
          dataIndex: "equal_amount",
          // with:180,
          editable: true,
          sorter: { multiple: 5 },
          fixed: true,
          key: "equal_amount",
          render: (text: any) => {
            return <Statistics value={text} />;
          },
        },
        {
          title: t(
            "Sales.Product_and_services.Inventory.Currency"
          ).toUpperCase(),
          dataIndex: "symbol",
          // className: "table-col",
          // editable: true,
          sorter: { multiple: 4 },
          key: "symbol",
          render:(text:string) => t(`Reports.${text}`)
        },

        {
          title: `${t(
            "Sales.Product_and_services.Currency.Default_rate"
          ).toUpperCase()}`,
          dataIndex: "base_amount",
          // className: "table-col",
          editable: true,
          sorter: { multiple: 3 },
          key: "base_amount",
          render: (text: any) => {
            return <Statistics value={text} />;
          },
        },
        {
          title: `${t(
            "Sales.Product_and_services.Currency.Default_currency"
          ).toUpperCase()}`,
          // dataIndex: "currency",
          dataIndex:"currency",
          
          // className: "table-col",
          // editable: true,
          sorter: { multiple: 2 },
          key: "currency",
          render: (text: { name: string } , record:any) => {
            console.log("record"  , record )
            return text?.name
          }
        },

        {
          title: `${t(
            "Sales.Product_and_services.Currency.Exchange_rate_default_currency"
          ).toUpperCase()}`,
          dataIndex: "exchange",
          // className: "table-col",
          // editable: true,
          sorter: { multiple: 1 },
          key: "exchange",
          render: (text: any, record: any) => {
            console.log("record" , record)
            const  baseAmount = parseFloat(record?.base_amount)
            const equalAmount = parseFloat(record?.equal_amount)
            var num = baseAmount > equalAmount ? baseAmount /equalAmount : equalAmount /baseAmount ;
            return <Statistics value={num} />;
          },
        },
        {
          title: `${t("Table.Action")}`,
          dataIndex: "action",
          width: 70,
          key: "action",
          align: "center",

          fixed: "right",
          render: (text: any, record: any) => {
            const editable = isEditing(record);
            return (
              <EditableTableActionColumnRender
                {...{
                  record,
                  save,
                  edit,
                  editingKey,
                  onCancel: cancel,
                  model: CURRENCY_RATE_M,
                  editable,
                  disabled: editingKey !== "",
                }}
              >
                {null}
              </EditableTableActionColumnRender>
            );
          },
        },
      ],
    [edit, editingKey, isEditing, save, t]
  );

  const handleGetCurrencyRates = useCallback(async ({ queryKey }) => {
    const { page, pageSize, search, order } = queryKey?.[1];
    const { data } = await axiosInstance.get(
      `${props?.baseUrl}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}`
    );

    return data;
  }, []);
  return (
    <Form form={form} component={false}>
      <EditableTable
        model={CURRENCY_RATE_M}
        columns={columns}
        queryKey={props?.baseUrl}
        handleGetData={handleGetCurrencyRates}
        save={save}
        edit={edit}
        editLoading={isLoading}
        editableCell={EditableCell}
        editingKey={editingKey}
        rowSelectable={false}
        type="currencyRate"
      />
    </Form>
  );
}
