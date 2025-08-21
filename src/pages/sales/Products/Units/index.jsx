import React, { useCallback, useMemo, useState } from "react";
import { Title } from "../../../SelfComponents/Title";
import { Row, Col, Input, Form } from "antd";
import axiosInstance from "../../../ApiBaseUrl";
import { useQueryClient, useMutation } from "react-query";
import { useTranslation } from "react-i18next";
import AddUnits from "./AddUnits";
import UnitAction from "./UnitAction";
import Filters from "./Filters";
import { trimString } from "../../../../Functions/TrimString";
import { EditableTable } from "../../../../components/antd";
import {
  EditableTableActionColumnRender,
  PageBackIcon,
} from "../../../../components";
import { PRODUCT_UNIT_M } from "../../../../constants/permissions";
import { PRODUCT_UNIT_LIST } from "../../../../constants/routes";
import { manageErrors, updateMessage } from "../../../../Functions";

const EditableCell = ({
  editing,
  dataIndex,
  index,
  children,
  save,
  ...restProps
}) => {
  const { t } = useTranslation();

  const message =
    dataIndex === "name"
      ? t("Form.Name_required")
      : t("Sales.Product_and_services.Units.Required_symbol");
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          className="margin1"
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
          <Input onPressEnter={save} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function Units() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ state: "active" });
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const handleUpdateItems = React.useCallback(() => {
    queryClient.invalidateQueries(PRODUCT_UNIT_LIST);
    queryClient.invalidateQueries(`${PRODUCT_UNIT_LIST}infinite/`);
  }, [queryClient]);

  const edit = useCallback(
    (record) => {
      form.setFieldsValue({
        name: "",
        description: "",
        ...record,
      });
      setEditingKey(record.id);
    },
    [form]
  );

  const cancel = () => {
    setEditingKey("");
  };

  const handleEditUnit = async ({ value, name }) => {
    return await axiosInstance.put(`${PRODUCT_UNIT_LIST}${name}/`, value);
  };

  const { mutate: mutateEditUnit, isLoading } = useMutation(handleEditUnit, {
    onSuccess: (value) => {
      updateMessage(value?.data?.name);
      handleUpdateItems();
      setEditingKey("");
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const save = useCallback(
    async (record) => {
      try {
        const row = await form.validateFields();

        const value = {
          name: trimString(row?.name),
          symbol: trimString(row?.symbol),
        };

        mutateEditUnit({ value, name: record.name });
      } catch (errInfo) {
        // 
      }
    },
    [form, mutateEditUnit]
  );

  const columns = useMemo(
    () => () =>
      [
        {
          title: t("Form.Name").toUpperCase(),
          dataIndex: "name",

          editable: true,
          sorter: { multiple: 2 },
          key: "name",
        },

        {
          title: t("Sales.Product_and_services.Units.Symbol"),
          dataIndex: "symbol",

          editable: true,
          sorter: { multiple: 1 },
          key: "symbol",
        },
        {
          title: t("Table.Action"),
          dataIndex: "action",
          width: 70,
          key: "action",
          align: "center",

          render: (_, record) => {
            return (
              <EditableTableActionColumnRender
                {...{
                  record,
                  save,
                  edit,
                  editingKey,
                  onCancel: cancel,
                  model: PRODUCT_UNIT_M,
                  disabled: editingKey !== "" || record.status !== "active",
                }}
              >
                <UnitAction
                  editingKey={editingKey}
                  record={record}
                  baseUrl={PRODUCT_UNIT_LIST}
                  handleUpdateItems={handleUpdateItems}
                />
              </EditableTableActionColumnRender>
            );
          },
        },
      ],
    [edit, editingKey, handleUpdateItems, save, t]
  );

  const handleGetUnits = useCallback(async ({ queryKey }) => {
    const { page, pageSize, search, order, state } = queryKey?.[1] || {
      page: 1,
      pageSize: 10,
      search: "",
      order: "-id",
      state: filters?.state,
      };
    const { data } = await axiosInstance.get(
      `${PRODUCT_UNIT_LIST}?page=${page}&page_size=${pageSize}&search=${search}&ordering=${order}&status=${state}`
    );

    return data;
  }, []);

  return (
    <div>
      <Row className="categore-header" align="middle" justify="start">
        <Col
          md={{ span: 10 }}
          sm={{ span: 11 }}
          xs={{ span: 14 }}
          className="Sales__content-3-body"
        >
          <Row>
            <Col span={24}>
              <Title
                value={t("Sales.Product_and_services.Units.Product_units")}
              />
            </Col>
            <Col
              xl={{ span: 12, offset: 0 }}
              lg={{ span: 17, offset: 0 }}
              md={{ span: 18, offset: 0 }}
              xs={{ span: 17, offset: 0 }}
            >
              <PageBackIcon
                previousPageName={t("Sales.Product_and_services.1")}
                url="/product"
              />
            </Col>
          </Row>
        </Col>
        <Col
          xl={{ span: 3, offset: 11 }}
          lg={{ span: 3, offset: 11 }}
          md={{ span: 4, offset: 10 }}
          sm={{ span: 5, offset: 8 }}
          xs={{ span: 6, offset: 4 }}
        >
          <AddUnits
            baseUrl={PRODUCT_UNIT_LIST}
            handleUpdateItems={handleUpdateItems}
          />
        </Col>
      </Row>

      <Form form={form} component={false}>
        <EditableTable
          placeholder={t("Sales.Product_and_services.Units.Filter_by_name")}
          columns={
            columns
            // : columns?.filter((item) => item?.dataIndex !== "action")
          }
          queryKey={PRODUCT_UNIT_LIST}
          handleGetData={handleGetUnits}
          save={save}
          edit={edit}
          type="units"
          editLoading={isLoading}
          editableCell={EditableCell}
          editingKey={editingKey}
          filters={filters}
          model={PRODUCT_UNIT_M}
          rowSelectable={false}
          filterNode={(setPage, setVisible) => (
            <Filters
              setFilters={setFilters}
              setVisible={setVisible}
              setPage={setPage}
            />
          )}
        />
      </Form>
    </div>
  );
}

export default Units;
