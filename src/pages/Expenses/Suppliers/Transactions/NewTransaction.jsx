import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  Dropdown,
  Button,
  // message,
  // Tooltip,
  Row,
  Col,
  // Divider,
  // Select,
} from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
// import withObservables from "@nozbe/with-observables";
// const { Option } = Select;
function NewTransaction(props) {
  // const database = useDatabase();
  const { t } = useTranslation();
  const onDelete = async () => {
    // const products = database.collections.get("products");
    // await database.action(async () => {
    //   for (let index = 0; index < props.selectedRowKeys.length; index++) {
    //     const element = props.selectedRowKeys[index];
    //     const product = await products.find(element);
    //     await product.destroyPermanently(); // permanent
    //   }
    // });
    // props.delete();
  };
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
  };
  const batch = (
    <Menu>
      <Menu.Item key='1' onClick={onMakeInActive}>
        {t('Expenses.Expense')}
      </Menu.Item>
      <Menu.Item key='2' onClick={onDelete}>
        {t('Expenses.Cheque')}
      </Menu.Item>
      <Menu.Item key='3' onClick={onDelete}>
        {t('Expenses.Supplier_credit')}
      </Menu.Item>
      <Menu.Item key='4' onClick={onDelete}>
        {t('Expenses.Pay_down_credit_card')}
      </Menu.Item>
    </Menu>
  );
  return (
    <Row>
      <Col span={23}>
        <Dropdown overlay={batch} disabled={true}>
          <Button
            className='num table-col'
            type='primary'
            shape='round'
            disabled={true}
          >
            {t('Sales.Product_and_services.New')}&nbsp;
            {t('Sales.Customers.Details.Transaction')} <CaretDownOutlined />
          </Button>
        </Dropdown>
      </Col>
    </Row>
  );
}
// export default withDatabase(
//   withObservables(["groups"], ({ database }) => ({
//     groups: database.collections.get("groups").query().observe(),
//   }))(NewTransaction)
// );
export default NewTransaction;
