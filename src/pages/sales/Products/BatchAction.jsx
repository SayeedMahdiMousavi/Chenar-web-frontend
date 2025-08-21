import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import { Menu, Dropdown, Button, message, Row, Col, Space } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import PrintBarcode from "./PrintSections/PrintBarcode";
import { CategorySelect } from "./Categories/CategorySelect";
import ChangeVip from "./BachActions/ChangeVip";
import ChangeVipPercent from "./BachActions/ChangeVipPercent";
import LabelPriceBarcode from "./PrintSections/LabelPriceBarcode";
import PrintTable from "../../PrintComponents/PrintTable";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
// import withObservables from "@nozbe/with-observables";

function BatchAction(props) {
  const queryClient = useQueryClient();
  const printRef = useRef();
  const printTableRef = useRef();
  const { t } = useTranslation();

  const [categoryValue, setCategoryValue] = useState();

  const { mutate: mutateChangeProductCategory } = useMutation(
    async (value) => {
      await axiosInstance
        .put(`${props?.baseUrl}bulk/update/category/`, value)
        .then((res) => {
          message.success(`${res?.data?.message}`);
          setCategoryValue();
          props.setSelectedRows([]);
          props.setSelectedRowKeys([]);
        })
        .catch((error) => {
          message.error(`${error?.data?.message}`);
        });
    },
    {
      onSuccess: () => queryClient.invalidateQueries(`${props?.baseUrl}`),
    }
  );
  let changeCategory = false;
  const onChangeCategory = async (value, event) => {
    // const products = database.collections.get("products");

    // await database.action(async () => {
    //   for (let index = 0; index < props.selectedRowKeys.length; index++) {
    //     const element = props.selectedRowKeys[index];

    //     const product = await products.find(element);
    //     await product.update((product) => {
    //       product.group = value;
    //     });
    //   }
    // });
    // 
    if (changeCategory) {
      return;
    }
    changeCategory = true;
    try {
      mutateChangeProductCategory({
        products: props?.selectedRowKeys,
        category: value?.value,
      });
      // { products: props?.selectedRowKeys, category: value?.value },
      // {
      //   onSuccess: () => {
      //     props.setSelectedRowKeys([]);
      //     message.info(`${t("Message.Update")}`);
      //   },
      // }

      changeCategory = false;
    } catch (info) {
      // message.error(`${info.message}`);
      changeCategory = false;
    }
  };
  const { mutate: mutateDeleteProduct } = useMutation(
    async () => {
      for (let index = 0; index < props.selectedRowKeys.length; index++) {
        const element = props.selectedRowKeys[index];
        await axiosInstance
          .delete(`/user_account/users/${element}`)
          .then((res) => {})
          .catch((error) => {
            message.error(`${error.message}`);
          });
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(`/user_account/users/`),
    }
  );

  let oneRequest = false;
  const onDelete = async () => {
    // const products = database.collections.get("products");

    // await database.action(async () => {
    //   for (let index = 0; index < props.selectedRowKeys.length; index++) {
    //     const element = props.selectedRowKeys[index];

    //     const product = await products.find(element);
    //     await product.destroyPermanently(); // permanent
    //   }
    // });
    if (oneRequest) {
      return;
    }
    oneRequest = true;
    try {
      mutateDeleteProduct(undefined, {
        onSuccess: () => {
          message.info(`${t("Message.Remove")} `);
        },
      });

      oneRequest = false;
    } catch (info) {
      message.error(`${info.message}`);
      oneRequest = false;
    }
  };
  const { mutate: mutateInActiveProduct } = useMutation(
    async (value) => {
      for (let index = 0; index < props.selectedRowKeys.length; index++) {
        const element = props.selectedRowKeys[index];
        await axiosInstance
          .patch(`/user_account/users/${element}/`, value)
          .then((res) => {})
          .catch((error) => {
            message.error(`${error.message}`);
          });
      }
    },
    {
      onSuccess: () => queryClient.invalidateQueries(`/user_account/users/`),
    }
  );
  let Inactive = false;
  const onMakeInActive = async () => {
    // const products = database.collections.get("products");

    // await database.action(async () => {
    //   for (let index = 0; index < props.selectedRowKeys.length; index++) {
    //     const element = props.selectedRowKeys[index];

    //     const product = await products.find(element);
    //     await product.update((product) => {
    //       product.status = "inActive";
    //     });
    //   }
    // });
    // props.MakeInActiveMultiple();
    // message.info(`${t("Message.Inactive")} `);
    if (Inactive) {
      return;
    }
    Inactive = true;
    try {
      mutateInActiveProduct(
        { is_active: false },
        {
          onSuccess: () => {
            props.setSelectedRowKeys([]);
            message.info(`${t("Message.Inactive")}`);
          },
        }
      );

      Inactive = false;
    } catch (info) {
      message.error(`${info.message}`);
      Inactive = false;
    }
  };

  const onAfterPrint = () => {
    props.setSelectedRows([]);
    props.setSelectedRowKeys([]);
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    removeAfterPrint: true,
    bodyClass: "barcode-print-body",
    // onAfterPrint: onAfterPrint,
    // print: () => {
    //   props.setSelectedRows([]);
    //   props.setSelectedRowKeys([]);
    // },
  });

  const pageStyle = ` @page {
    margin: 4mm 7mm;
  };`;
  const handlePrintTable = useReactToPrint({
    content: () => printTableRef.current,
    removeAfterPrint: true,
    pageStyle: pageStyle,
  });

  const handlePrintPriceLabel = () => {
    handlePrint();
  };

  const { mutate: mutateAssignBarcode } = useMutation(
    async (value) =>
      await axiosInstance
        .post(`${props.baseUrl}bulk/create/barcode/`, value)
        .then((res) => {
          // setRemoveVisible(false);
          message.success(res?.data?.message);
          // setLoading(false);
          props.setSelectedRows([]);
          props.setSelectedRowKeys([]);
        })
        .catch((error) => {
          // setLoading(false);
          // 
          message.error(`${error?.response?.data?.data?.message}`);
        }),
    {
      onSuccess: () => queryClient.invalidateQueries(`${props.baseUrl}`),
    }
  );

  let isAssignBarcode = false;
  //   
  const handleAssignBarcode = async () => {
    // setLoading(true);
    if (isAssignBarcode) {
      return;
    }
    isAssignBarcode = true;
    try {
      const productsId = props?.selectedRows
        ?.filter((item) => item?.barcode === null)
        ?.map((item) => item?.id);

      if (productsId.length > 0) {
        mutateAssignBarcode({
          products: productsId,
        });
      } else {
        message.error(
          t("Sales.Product_and_services.Form.Bulk_assign_barcode_message")
        );
      }

      isAssignBarcode = false;
    } catch (info) {
      // 
      isAssignBarcode = false;
    }
  };

  const batch = (
    <Menu>
      <Menu.Item key="1">
        <LabelPriceBarcode
          setSelectedRows={props.setSelectedRows}
          setSelectedRowKeys={props.setSelectedRowKeys}
          selectedRows={props.selectedRows}
        />
      </Menu.Item>
      <Menu.Item key="2">
        <PrintBarcode
          type="batch"
          setSelectedRows={props.setSelectedRows}
          setSelectedRowKeys={props.setSelectedRowKeys}
          selectedRows={props.selectedRows}
        />
      </Menu.Item>
      {/* <Menu.Item key="4" onClick={handleAssignBarcode}>
        {t("Sales.Product_and_services.Form.Assign_barcode")}
      </Menu.Item>
      <Menu.Item key="3">
        <ChangeOriginalBarcode
          baseUrl={props.baseUrl}
          setSelectedRows={props.setSelectedRows}
          setSelectedRowKeys={props.setSelectedRowKeys}
          selectedRowKeys={props.selectedRowKeys}
        />
      </Menu.Item> */}

      <Menu.Item key="3">
        <ChangeVip
          baseUrl={props.baseUrl}
          setSelectedRows={props.setSelectedRows}
          setSelectedRowKeys={props.setSelectedRowKeys}
          selectedRowKeys={props.selectedRowKeys}
        />
      </Menu.Item>
      <Menu.Item key="5">
        <ChangeVipPercent
          baseUrl={props.baseUrl}
          setSelectedRows={props.setSelectedRows}
          setSelectedRowKeys={props.setSelectedRowKeys}
          selectedRows={props.selectedRows}
        />
      </Menu.Item>
      <Menu.Item key="9" onClick={handlePrintTable}>
        {t("Form.Print")}
      </Menu.Item>
      {/* <Menu.Item key="6">
        <AddVipPercent
          baseUrl={props.baseUrl}
          setSelectedRows={props.setSelectedRows}
          setSelectedRowKeys={props.setSelectedRowKeys}
          selectedRowKeys={props.selectedRowKeys}
        />
      </Menu.Item> */}

      {/* <Menu.Item key="1" onClick={onMakeInActive}>
        {t("Sales.Customers.Table.inactive")}
      </Menu.Item>
      <Menu.Item key="2" onClick={onDelete}>
        {t("Sales.Customers.Table.Remove")}
      </Menu.Item> */}
    </Menu>
  );

  return (
    <Space>
      <div className="hide-print-component">
        <PrintTable
          //@ts-ignore
          printRef={printTableRef}
          domColumns={props.columns("print")}
          title={t("Sales.Product_and_services.1")}
          dataSource={props.selectedRows}
        />
      </div>
      {/* <Select
          showSearch
          placeholder={t("Sales.Product_and_services.Assign_category")}
          //   listHeight={130}
          className="num table-col"
          onChange={onChangeCategory}
          dropdownRender={(menu) => <div>{menu}</div>}
        >
          {items?.map((item) => (
            <Option value={item.name} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select> */}
      <CategorySelect
        url="/product/category/"
        placeholder={t("Sales.Product_and_services.Assign_category")}
        onChange={onChangeCategory}
        setValue={setCategoryValue}
        value={categoryValue}
      />

      <Dropdown overlay={batch} trigger={["click"]}>
        <Button
          className="num table-col"
          style={{ fontSize: ".9rem" }}
          type="primary"
          shape="round"
          ghost
        >
          {t("Sales.Customers.Table.Batch_action")} <CaretDownOutlined />
        </Button>
      </Dropdown>
    </Space>
  );
}
// export default withDatabase(
//   withObservables(["groups"], ({ database }) => ({
//     groups: database.collections.get("groups").query().observe(),
//   }))(BatchAction)
// );
export default BatchAction;
