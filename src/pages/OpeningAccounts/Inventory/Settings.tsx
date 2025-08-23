//@ts-nocheck
import React from 'react';
import { Row, Col, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';

interface VisibilityFilters {
  barcode: boolean;
  units: boolean;
  date: boolean;
  available: boolean;
  currency: boolean;
}
interface Props {
  setColumns: (prev: VisibilityFilters) => void;
  columnVisible: VisibilityFilters;
  onChangeUnits: (value: boolean) => void;
}

const Settings: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const onChangeBarcode = () => {
    props.setColumns((prev) => {
      return { ...prev, barcode: !props.columnVisible.barcode };
    });
  };

  // const onChangeUnits = () =>{
  //   props.setColumns((prev:any) => {
  //     return { ...prev, units: !props.columnVisible.units };
  //   });
  // }

  const onChangeDate = () =>
    //@ts-ignore
    props.setColumns((prev) => {
      return { ...prev, date: !props.columnVisible.date };
    });
  const onChangeAvailable = () =>
    //@ts-ignore
    props.setColumns((prev) => {
      return { ...prev, available: !props.columnVisible.available };
    });

  const onChangeCurrency = () => {
    //@ts-ignore
    props.setColumns((prev) => {
      return { ...prev, currency: !props.columnVisible.currency };
    });
  };
  return (
    <div className='table__header2-setting'>
      {/* <Col span={24}> */}
      <Checkbox.Group defaultValue={['A', 'B', 'C', 'D', 'E']}>
        <Row className='table__header2-setting-group' gutter={[0, 11]}>
          <Col span={20} offset={2}>
            <h4>{t('Sales.Product_and_services.Columns')}</h4>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='A'
              name='quality'
              onChange={onChangeBarcode}
              className='table__header2-setting-column'
            >
              {t('Sales.Product_and_services.Form.Barcode')}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              value='B'
              className='table__header2-setting-column'
              onChange={props.onChangeUnits}
            >
              {t('Sales.Product_and_services.Form.Units')}
            </Checkbox>
          </Col>

          <Col span={20} offset={2}>
            <Checkbox
              value='C'
              onChange={onChangeDate}
              className='table__header2-setting-column'
            >
              {t('Sales.Customers.Form.Date')}
            </Checkbox>
          </Col>
          <Col span={20} offset={2}>
            <Checkbox
              name='price'
              value='D'
              onChange={onChangeAvailable}
              className='table__header2-setting-column'
            >
              {t('Sales.Product_and_services.Inventory.Available')}
            </Checkbox>
          </Col>

          <Col span={20} offset={2} onChange={onChangeCurrency}>
            <Checkbox value='E' className='table__header2-setting-column'>
              {t('Sales.Product_and_services.Inventory.Currency')}
            </Checkbox>
          </Col>

          {/* {visibality && (
              <Col span={20} offset={2}>
                <Checkbox value='F' className='table__header2-setting-column'>
                  {t("Sales.Product_and_services.Form.Units")}
                </Checkbox>
              </Col>
            )}
            <Col span={12} offset={12}>
              <span onClick={handelVisibality}>
                {visibality ? (
                  <span className='table__header2-setting-showMore'>
                    <UpOutlined />
                    {t("Sales.Product_and_services.Show_less")}
                  </span>
                ) : (
                  <span className='table__header2-setting-showMore'>
                    <DownOutlined />
                    {t("Sales.Product_and_services.Show_More")}
                  </span>
                )}
              </span>
            </Col> */}
        </Row>
      </Checkbox.Group>
      {/* <Row>
          <Col offset={2} span={22}>
            <label htmlFor='status'>{t("Sales.Product_and_services.Rows")}</label>
          </Col>
          <Col offset={2} span={10}>
            <Select
              showSearch
              defaultValue={count}
              placeholder='Select a person'
              optionFilterProp='children'
              onChange={onChangeNumber}
              onFocus={onFocus}
              onBlur={onBlur}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value={30}>30</Option>
              <Option value={20}>20</Option>
              <Option value={10}>10</Option>
            </Select>
          </Col>
        </Row> */}
      {/* </Col> */}
    </div>
  );
};
export default Settings;
