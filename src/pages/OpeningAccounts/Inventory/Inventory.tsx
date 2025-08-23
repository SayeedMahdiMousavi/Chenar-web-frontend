import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Layout } from 'antd';
import InventoryTable from './InventoryTable';
import { Title } from '../../SelfComponents/Title';
// import FiltersWarehouse from "../../Warehouse/WarehouseNotification/FilterWarehouse";
import { PageBackIcon } from '../../../components';
import { PRODUCT, PRODUCT_INVENTORY_LIST } from '../../../constants/routes';
import AddProductInventory from './Add';
import { useQueryClient } from 'react-query';

interface Props {}
const FirstPeriod: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  // const [warehouse, setWarehouse] = useState<any>(undefined);
  // const [editingKey, setEditingKey] = useState("");
  const queryClient = useQueryClient();

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(PRODUCT_INVENTORY_LIST);
  }, [queryClient]);

  return (
    <Layout>
      <Row className='categore-header' align='middle' justify='start'>
        <Col
          md={{ span: 10 }}
          sm={{ span: 11 }}
          xs={{ span: 14 }}
          className='Sales__content-3-body'
        >
          <Row>
            <Col span={24}>
              <Title
                value={t(
                  'Sales.Product_and_services.Inventory.Product_inventory',
                )}
              />
            </Col>
            <Col
              xl={{ span: 12, offset: 0 }}
              lg={{ span: 17, offset: 0 }}
              md={{ span: 18, offset: 0 }}
              xs={{ span: 17, offset: 0 }}
            >
              <PageBackIcon
                previousPageName={t('Sales.Product_and_services.1')}
                url={PRODUCT}
              />
            </Col>
          </Row>
        </Col>
        <Col
          xl={{ span: 6, offset: 8 }}
          md={{ span: 8, offset: 8 }}
          sm={{ span: 10, offset: 7 }}
        >
          {/* <FiltersWarehouse
            setWarehouse={setWarehouse}
            warehouse={warehouse}
            editingKey={editingKey}
          /> */}
          <Row justify={'space-around'} gutter={[0, 5]}>
            <Col xl={10} md={10} sm={9} xs={23}></Col>
            <Col xl={13} md={12} sm={13} xs={24}>
              <AddProductInventory handleUpdateItems={handleUpdateItems} />
            </Col>
          </Row>
          {/* <AddProductInventory /> */}
        </Col>
      </Row>

      <InventoryTable
        handleUpdateItems={handleUpdateItems}
        // warehouse={warehouse?.value}
        // editingKey={editingKey}
        // setEditingKey={setEditingKey}
      />
    </Layout>
  );
};

export default FirstPeriod;
