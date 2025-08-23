import React, { useState } from 'react';
import axiosInstance from '../../../ApiBaseUrl';
import { useQueryClient, useMutation } from 'react-query';
import Action from './Action';
import {
  message,
  Typography,
  Modal,
  Form,
  InputNumber,
  Select,
  Menu,
  Checkbox,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../../MediaQurey';
import PriceRecordingSettings from './PriceRecordingSettings';
import { ActionMessage } from '../../../SelfComponents/TranslateComponents/ActionMessage';
import AddVipPercent from '../BachActions/AddVipPercent';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { EditableTable, Statistics } from '../../../../components/antd';
import { PRODUCT_PRICE_M } from '../../../../constants/permissions';
import { EditableTableActionColumnRender } from '../../../../components';
import { manageErrors } from '../../../../Functions';

const baseUrl = '/product/items/';
const FormItem = Form.Item;
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  save,
  ...restProps
}: any) => {
  const { t } = useTranslation();

  const handleFocusInputNumber = (e: any) => {
    e.target.select();
  };
  const getInput = () => {
    switch (dataIndex) {
      case 'unit':
        return (
          <Form.Item name={dataIndex} style={styles.formItem}>
            <Select>
              {record?.product_units?.map((item: any) => (
                <Select.Option value={item?.unit?.id}>
                  {item?.unit?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      case 'price__sales_rate':
        return (
          <Form.Item
            name={dataIndex}
            style={styles.formItem}
            rules={[
              {
                required: true,
                message: t(
                  'Sales.Product_and_services.Price_recording.Sales_required',
                ),
              },
            ]}
          >
            <InputNumber
              min={0.01}
              max={20}
              type='number'
              className='num'
              inputMode='numeric'
              onFocus={handleFocusInputNumber}
              onPressEnter={() => save(record)}
            />
          </Form.Item>
        );
      default:
        return (
          <FormItem
            name={dataIndex}
            style={styles.formItem}
            rules={[
              {
                required: true,
                message: t(
                  'Sales.Product_and_services.Price_recording.Purchases_required',
                ),
              },
            ]}
          >
            <InputNumber
              min={0.01}
              autoFocus
              type='number'
              max={20}
              className='num'
              inputMode='numeric'
              onFocus={handleFocusInputNumber}
              onPressEnter={() => save(record)}
            />
          </FormItem>
        );
    }
  };
  return <td {...restProps}>{editing ? getInput() : children}</td>;
};

const baseUnit = (record: any) => {
  return record?.product_units.find((item: any) => item?.base_unit === true);
};
const baseUnitPrice = (record: any) => {
  return record?.price?.find((item: any) =>
    item?.unit_pro_relation?.includes('base_unit'),
  );
};

interface Props {}
const PriceRecordingTable: React.FC<Props> = (props) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const isMobile = useMediaQuery('(max-width:400px)');
  const [editingKey, setEditingKey] = useState('');
  const [columnFilters, setColumnFilters] = useState<string[]>([]);
  const { t } = useTranslation();

  // on success edit or update
  const onSuccessPrice = useCallback(() => {
    queryClient.invalidateQueries(`${baseUrl}price/`);
    queryClient.invalidateQueries(`${baseUrl}`);
  }, [queryClient]);

  const editProductPricing = async ({ value, id }: any) =>
    await axiosInstance.put(`/product/price/${id}/`, value);

  const { mutate: mutateEditPricing, isLoading: editLoading } = useMutation(
    editProductPricing,
    {
      onSuccess: (_, { product }) => {
        message.success(
          <ActionMessage
            name={product}
            message='Sales.Product_and_services.Price_recording.Update_message'
          />,
        );
        setEditingKey('');
        onSuccessPrice();
      },
      onError: (error) => {
        manageErrors(error);
      },
    },
  );

  const handleAddPriceRecording = async ({ value }: any) =>
    await axiosInstance.post(`/product/price/`, value);

  const { mutate: mutateAddPriceRecording, isLoading: addLoading } =
    useMutation(handleAddPriceRecording, {
      onSuccess: (_, { product }) => {
        message.success(
          <ActionMessage
            name={product}
            message='Sales.Product_and_services.Price_recording.Add_message'
          />,
        );
        setEditingKey('');
        onSuccessPrice();
      },
      onError: (error) => {
        manageErrors(error);
      },
    });

  const editPriceRecording = async ({ value, product, id }: any) =>
    await axiosInstance.put(`/product/price/bulk_update/${id}/`, value);

  const { mutate: mutateEditPriceRecording, isLoading } = useMutation(
    editPriceRecording,
    {
      onSuccess: (_, { product }) => {
        message.success(
          <ActionMessage
            name={product}
            message='Sales.Product_and_services.Price_recording.Update_message'
          />,
        );
        setEditingKey('');
        onSuccessPrice();
      },
      onError: (error: any) => {
        manageErrors(error);
        if (error?.response?.data?.non_field_errors?.[0]) {
          message.error(`${error?.response.data?.non_field_errors?.[0]}`);
        }
      },
    },
  );

  const getPriceRecording = (unitId: number, record: any) => {
    const unit = record?.unit_conversion?.find(
      (item: any) => item?.from_unit?.id === unitId,
    );
    return unit?.ratio ? unit?.ratio : 0;
  };

  const save = useCallback(
    async (record: any) => {
      try {
        const row = await form.validateFields();

        const sales =
          parseFloat(row?.price__sales_rate) < 0 ? 0 : row?.price__sales_rate;
        const purchases =
          parseFloat(row?.price__perches_rate) < 0
            ? 0
            : row?.price__perches_rate;
        const allData = {
          sales_rate: sales,
          perches_rate: purchases,
          product: record?.id,
          unit:
            baseUnitPrice(record) !== undefined
              ? baseUnitPrice(record)?.unit?.id
              : baseUnit(record)?.unit?.id,

          currency: record?.currency?.id,
          currency_rate: 1,
        };

        if (parseFloat(sales) < parseFloat(purchases)) {
          Modal.warning({
            bodyStyle: {
              direction: t('Dir') as
                | 'ltr'
                | 'rtl'
                | 'inherit'
                | 'initial'
                | 'unset',
            },
            title: (
              <ActionMessage
                name={record?.name}
                message={
                  'Sales.All_sales.Invoice.error_message_when_sales_is_less_than_purchase'
                }
              />
            ),
            content: (
              <img
                width='200px'
                height='200px'
                src='/gif/salesError.gif'
                alt='fklasdfsa'
              />
            ),
          });
        }

        if (baseUnitPrice(record) === undefined) {
          mutateAddPriceRecording({
            value: allData,
            product: record?.name,
          });
        } else {
          if (
            parseFloat(baseUnitPrice(record)?.perches_rate) ===
              parseFloat(purchases) ||
            record?.price?.length < 2
          ) {
            mutateEditPricing({
              value: allData,
              id: baseUnitPrice(record)?.id,
              product: record?.name,
            });
          } else {
            const newPrice = record?.price?.filter(
              (item: any) => !item?.unit_pro_relation?.includes('base_unit'),
            );
            const priceRecording = newPrice?.map((item: any) => {
              return {
                sales_rate: item?.sales_rate,
                perches_rate:
                  parseFloat(getPriceRecording(item?.unit?.id, record)) *
                  parseFloat(purchases),
                product: record?.id,
                unit: item?.unit?.id,

                currency: item?.currency?.id,
                currency_rate: 1,
              };
            });
            const bullkPrice = [...priceRecording, allData];

            mutateEditPriceRecording({
              value: bullkPrice,
              id: record?.id,
              product: record?.name,
            });
          }
        }
      } catch (errInfo) {}
    },
    [
      form,
      mutateAddPriceRecording,
      mutateEditPriceRecording,
      mutateEditPricing,
      t,
    ],
  );

  const edit = useCallback(
    (record: any) => {
      form.setFieldsValue({
        price__sales_rate: baseUnitPrice(record)?.sales_rate,
        price__perches_rate: baseUnitPrice(record)?.perches_rate,
        unit:
          baseUnitPrice(record) !== undefined
            ? baseUnitPrice(record)?.unit?.id
            : baseUnit(record)?.unit?.id,
        // ...record,
      });
      setEditingKey(record.id);
    },
    [form],
  );

  const cancel = () => {
    setEditingKey('');
  };

  const columnFiltersLength = columnFilters?.length;

  const columns = useMemo(
    () => (type: string, hasSelected: boolean) => {
      const sorter = type !== 'print';
      const allColumns = [
        {
          title: t('Form.Name').toUpperCase(),
          dataIndex: 'name',
          key: 'name',
          fixed: type !== 'print' ? true : undefined,
          className: 'table-col',
          sorter: sorter && { multiple: 5 },
        },
        {
          title: t('Sales.Product_and_services.Barcode').toUpperCase(),
          dataIndex: 'barcode',
          key: 'barcode',
          className: 'table-col',
          sorter: sorter && { multiple: 4 },
          render: (text: any, record: any) => (
            <React.Fragment>
              {
                record?.product_barcode?.find(
                  (item: any) => item?.default === true,
                )?.barcode
              }
            </React.Fragment>
          ),
        },
        {
          title: t('Sales.Product_and_services.Units.Unit').toUpperCase(),
          dataIndex: 'unit',
          key: 'unit',
          width: type !== 'print' ? 170 : undefined,
          className: 'table-col',

          render: (text: any, record: any) => (
            <>
              {baseUnitPrice(record)?.unit?.name
                ? baseUnitPrice(record)?.unit?.name
                : baseUnit(record)?.unit?.name}
            </>
          ),
        },

        {
          title: t(
            'Sales.Product_and_services.Price_recording.Purchase_price',
          ).toUpperCase(),
          width: type !== 'print' ? 155 : undefined,
          dataIndex: 'price__perches_rate',
          key: 'price__perches_rate',
          className: 'table-col',
          sorter: sorter && { multiple: 3 },
          editable: true,
          render: (text: any, record: any) =>
            baseUnitPrice(record)?.unit?.name && (
              <Statistics value={baseUnitPrice(record)?.perches_rate} />
            ),
        },
        {
          title: t(
            'Sales.Product_and_services.Price_recording.Sales_price',
          ).toUpperCase(),
          width: type !== 'print' ? 140 : undefined,
          dataIndex: 'price__sales_rate',
          key: 'price__sales_rate',
          className: 'table-col',
          sorter: sorter && { multiple: 2 },
          editable: true,
          render: (text: any, record: any) => {
            return (
              baseUnitPrice(record)?.unit?.name && (
                <Statistics value={baseUnitPrice(record)?.sales_rate} />
              )
            );
          },
        },
        {
          title: t(
            'Sales.Product_and_services.Price_recording.Benefit_percent',
          ).toUpperCase(),
          width: type !== 'print' ? 160 : undefined,
          dataIndex: 'benefit',
          key: 'benefit',
          className: 'table-col',

          sorter: (a: any, b: any) => a?.email?.localeCompare(b?.email),
          sortDirections: ['ascend', 'descend'],
          render: (text: any, record: any) => {
            const baseUnit = baseUnitPrice(record);
            const benefit =
              ((baseUnit?.sales_rate - baseUnit?.perches_rate) * 100) /
              baseUnit?.perches_rate;

            return (
              baseUnitPrice(record)?.unit?.name && (
                <Statistics value={benefit} suffix={'%'} />
              )
            );
          },
        },

        {
          title: t(
            'Sales.Product_and_services.Inventory.Currency',
          ).toUpperCase(),
          width: type !== 'print' ? 120 : undefined,
          dataIndex: 'currency',
          key: 'currency',
          className: 'table-col',
          sorter: sorter && { multiple: 1 },
          render: (text: any, record: any) => (
            <>
              {baseUnitPrice(record)?.unit?.name
                ? text?.name
                : baseUnitPrice(record)?.currency?.name}
            </>
          ),
        },

        {
          title: t('Table.Action').toUpperCase(),
          key: 'action',
          className: 'table-col',
          width: isMobile ? 50 : 80,
          align: 'center',
          fixed: 'right',
          render: (text: any, record: any) => {
            return (
              <EditableTableActionColumnRender
                {...{
                  record,
                  save,
                  edit,
                  editingKey,
                  onCancel: cancel,
                  model: PRODUCT_PRICE_M,
                  disabled: editingKey !== '' || hasSelected,
                }}
              >
                <Action
                  record={record}
                  editingKey={editingKey}
                  baseUrl={baseUrl}
                  hasSelected={hasSelected}
                />
              </EditableTableActionColumnRender>
            );
          },
        },
      ];
      return allColumns?.filter((item) => !columnFilters?.includes(item?.key));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnFiltersLength, edit, editingKey, isMobile, save, t],
  );

  const changeFilter = (value: boolean, column: string) => {
    setColumnFilters((prev) => {
      if (value === true) {
        return prev?.filter((item) => item !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  const onChangeBarcode = (e: any) => changeFilter(e.target.checked, 'barcode');

  const onChangeUnits = (e: any) => changeFilter(e.target.checked, 'unit');

  const onChangeBenefit = (e: any) => changeFilter(e.target.checked, 'benefit');

  const onChangeCurrency = (e: any) =>
    changeFilter(e.target.checked, 'currency');

  const menu = (
    <Menu>
      <Menu.Item key='1'>
        <Typography.Text strong={true}>
          {t('Sales.Product_and_services.Columns')}
        </Typography.Text>
      </Menu.Item>
      <Menu.Item key='2'>
        <Checkbox
          checked={!columnFilters?.includes('barcode')}
          onChange={onChangeBarcode}
        >
          {t('Sales.Product_and_services.Form.Barcode')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='3'>
        <Checkbox
          checked={!columnFilters?.includes('unit')}
          onChange={onChangeUnits}
        >
          {t('Sales.Product_and_services.Form.Units')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='4'>
        <Checkbox
          checked={!columnFilters?.includes('benefit')}
          onChange={onChangeBenefit}
        >
          {t('Sales.Product_and_services.Price_recording.Benefit_percent')}
        </Checkbox>
      </Menu.Item>

      <Menu.Item key='5'>
        <Checkbox
          checked={!columnFilters?.includes('currency')}
          onChange={onChangeCurrency}
        >
          {t('Sales.Product_and_services.Inventory.Currency')}
        </Checkbox>
      </Menu.Item>
      <Menu.Item key='6'>
        <PriceRecordingSettings />
      </Menu.Item>
      <Menu.Item key='7'>
        <AddVipPercent />
      </Menu.Item>
    </Menu>
  );

  const handleGetProductPrices = useCallback(
    async ({ queryKey }: { queryKey: any }) => {
      const { page, pageSize, search, order } = queryKey?.[1];
      const { data } = await axiosInstance.get(
        `${baseUrl}?page=${page}&page_size=${pageSize}&ordering=${order}&status=active&search=${search}&expand=price,price.unit,price.currency,product_units,product_units.unit,unit_conversion,product_barcode.unit&omit=product_statistic,min_max,is_pine,cht_account_id,barcode,category,created,description,is_asset,is_have_vip_price,modified,modified_by,original_barcode,photo,status,supplier,created_by`,
      );

      return data;
    },
    [],
  );

  return (
    <Form form={form} component={false}>
      <EditableTable
        model={PRODUCT_PRICE_M}
        placeholder={t('Sales.Product_and_services.Find_Products_and_Services')}
        title={t('Sales.Product_and_services.Price_recording.1')}
        columns={columns}
        queryKey={`${baseUrl}price/`}
        handleGetData={handleGetProductPrices}
        save={save}
        editLoading={isLoading || addLoading || editLoading}
        edit={edit}
        editableCell={EditableCell}
        editingKey={editingKey}
        settingMenu={menu}
      />
    </Form>
  );
};
const styles = {
  formItem: { marginBottom: 0 },
};

export default PriceRecordingTable;
