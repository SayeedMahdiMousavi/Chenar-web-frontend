/* eslint-disable react/display-name */
import React, { useMemo, useState } from 'react';
import { Colors } from '../../../colors';
import axiosInstance from '../../../ApiBaseUrl';
import { Checkbox, Menu, Table, Typography, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import Filters from '../WarehouseStatistics/Filters';
import { utcDate } from '../../../../Functions/utcDate';
import { indianToArabic } from '../../../../Functions/arabicToIndian';
import ShowDate from '../../../SelfComponents/JalaliAntdComponents/ShowDate';
import { ReportTable, Statistics } from '../../../../components/antd';

const dateFormat = 'YYYY-MM-DD';
const datePFormat = 'jYYYY/jM/jD';
const { Column } = Table;

const ExpiredProductsTable = (props) => {
  const { t } = useTranslation();
  const [
    {
      // unit,
      available,
      expirationDate,
    },
    setColumns,
  ] = useState({
    unit: true,
    available: true,
    expirationDate: true,
  });
  const [filters, setFilters] = useState(() => {
    return {
      endDate: indianToArabic(utcDate().add(1, 'month').format(dateFormat)),
      startDate: indianToArabic(utcDate().format(dateFormat)),
      product: { value: '', label: '' },
      warehouse: { value: '', label: '' },
    };
  });

  const { endDate, startDate, product, warehouse } = filters;

  // const onChangeUnit = (e) =>
  //   setColumns((prev) => {
  //     return { ...prev, unit: e.target.checked };
  //   });

  const onChangeAvailable = (e) =>
    setColumns((prev) => {
      return { ...prev, available: e.target.checked };
    });

  const onChangeExpirationDate = (e) => {
    setColumns((prev) => {
      return { ...prev, expirationDate: e.target.checked };
    });
  };

  const setting = (
    <Menu style={styles.settingsMenu}>
      <Menu.Item key='1'>
        <Typography.Text strong={true}>
          {t('Sales.Product_and_services.Columns')}
        </Typography.Text>
      </Menu.Item>
      {/* <Menu.Item key="2">
        <Checkbox checked={unit} onChange={onChangeUnit}>
          {t("Sales.Product_and_services.Units.Unit")}
        </Checkbox>
      </Menu.Item> */}
      <Menu.Item key='4'>
        <Checkbox checked={expirationDate} onChange={onChangeExpirationDate}>
          {t('Sales.Product_and_services.Inventory.Expiration_date')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='10'>
        <Checkbox checked={available} onChange={onChangeAvailable}>
          {t('Reports.Available_quantity')}
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  const handleGetExpiredProducts = React.useCallback(
    async ({ queryKey }) => {
      const {
        page,
        pageSize,
        search,
        order,
        product,
        warehouse,
        endDate,
        startDate,
      } = queryKey?.[1] || {
        page: 1,
        pageSize: 10,
        search: '',
        order: '-id',
        product: { value: '', label: '' },
        warehouse: { value: '', label: '' },
        endDate: indianToArabic(utcDate().add(1, 'month').format(dateFormat)),
        startDate: indianToArabic(utcDate().format(dateFormat)),
      };
      const productId = product?.value ?? '';
      const warehouseId = warehouse?.value ?? '';
      const { data } = await axiosInstance.get(
        `${props.baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&product=${productId}&search=${search}&warehouse=${warehouseId}&expire_date_before=${endDate}&expire_date_after=${startDate}`,
      );
      return data;
    },
    [props.baseUrl],
  );

  const columns = useMemo(
    () => (type) => {
      const sorter = type !== 'print';
      return (
        <React.Fragment>
          <Column
            title={t('Sales.Product_and_services.Product_id').toUpperCase()}
            dataIndex='product_id'
            key='product_id'
            fixed={type !== 'print' ? true : undefined}
            width={130}
            sorter={sorter && { multiple: 5 }}
            className='table-col'
            align='center'
          />
          <Column
            title={t('Sales.All_sales.Invoice.Product_name').toUpperCase()}
            dataIndex='product_name'
            key='product_name'
            fixed={type !== 'print' ? true : undefined}
            className='table-col'
            sorter={sorter && { multiple: 4 }}
          />

          {/* {unit && (
            <Column
              title={t("Sales.Product_and_services.Units.Unit").toUpperCase()}
              dataIndex="base_unit"
              key="base_unit"
              sorter={sorter && { multiple: 3 }}
              className="table-col"
            />
          )} */}

          {expirationDate && (
            <Column
              title={t(
                'Sales.Product_and_services.Inventory.Expiration_date',
              ).toUpperCase()}
              dataIndex='expire_date'
              key='expire_date'
              className='table-col'
              sorter={sorter && { multiple: 2 }}
              render={(text) => {
                return (
                  <ShowDate
                    date={text}
                    dateFormat={dateFormat}
                    datePFormat={datePFormat}
                  />
                );
              }}
            />
          )}

          {available && (
            <Column
              title={t('Reports.Available_quantity').toUpperCase()}
              dataIndex='available'
              key='available'
              className='table-col'
              sorter={sorter && { multiple: 1 }}
              render={(value) => <Statistics value={value} />}
            />
          )}
        </React.Fragment>
      );
    },
    [available, expirationDate, t],
  );

  // const printColumns = useMemo(() => {
  //   const newColumns = [
  //     {
  //       title: t("Table.Row"),
  //       dataIndex: "serial",
  //       key: "serial",
  //       width: 40,
  //       align: "center",
  //       className: "print-table-column",
  //       render: (_, __, index) => <span>{index + 1}</span>,
  //     },
  //     {
  //       title: t("Sales.Product_and_services.Product_id"),
  //       dataIndex: "product",
  //       key: "product",
  //       className: "print-table-column",
  //     },
  //     {
  //       title: t("Sales.Product_and_services.Categories.Name"),
  //       dataIndex: "product__name",
  //       key: "product__name",
  //       className: "print-table-column",
  //     },

  //     {
  //       title: t("Sales.Product_and_services.Units.Unit"),
  //       dataIndex: "base_unit",
  //       key: "base_unit",
  //       className: "print-table-column",
  //     },
  //     {
  //       title: t("Sales.Product_and_services.Inventory.Expiration_date"),
  //       dataIndex: "expire_date",
  //       key: "expire_date",
  //       className: "print-table-column",
  //       render: (text) => {
  //         return (
  //           <ShowDate
  //             date={text}
  //             dateFormat={dateFormat}
  //             datePFormat={datePFormat}
  //           />
  //         );
  //       },
  //     },
  //     {
  //       title: t("Reports.Available_quantity"),
  //       dataIndex: "remain",
  //       key: "remain",
  //       className: "print-table-column",
  //       render: (text) => (
  //         <div direction="ltr">{fixedNumber(text ?? 0, 4)}</div>
  //       ),
  //     },
  //   ];
  //   return newColumns;
  // }, [t]);

  const printFilters = (
    <Descriptions
      layout='horizontal'
      style={{ width: '100%', paddingTop: '40px' }}
      column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      size='small'
    >
      <Descriptions.Item label={t('Form.From')}>
        {startDate} {t('Form.To')} : {endDate}
      </Descriptions.Item>
      {warehouse?.label && (
        <Descriptions.Item label={t('Warehouse.1')}>
          {warehouse?.label}
        </Descriptions.Item>
      )}
      {product?.label && (
        <Descriptions.Item label={t('Sales.Product_and_services.Product')}>
          {product?.label}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
  return (
    <ReportTable
      title={props.title}
      columns={columns}
      queryKey={props.baseUrl}
      handleGetData={handleGetExpiredProducts}
      settingMenu={setting}
      filters={filters}
      filterNode={(setPage, setSelectedRowKeys) => (
        <Filters
          setFilters={setFilters}
          setSelectedRowKeys={setSelectedRowKeys}
          setPage={setPage}
          type={props.type}
        />
      )}
      filtersComponent={printFilters}
    />
  );
};
const styles = {
  modal1: (sales) => ({
    padding: '0px',
  }),
  closeIcon: { color: `${Colors.white}` },
  unit: { display: 'flex' },
  settingsMenu: { width: '165px', paddingBottom: '10px' },
};

export default ExpiredProductsTable;
