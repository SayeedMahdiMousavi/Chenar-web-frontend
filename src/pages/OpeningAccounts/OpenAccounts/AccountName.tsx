import React, { useState } from 'react';
import { Col, Row, Form, Select } from 'antd';
import { debounce } from 'throttle-debounce';
import { useQuery } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { useTranslation } from 'react-i18next';
import { CenteredSpin } from '../../SelfComponents/Spin';

const getData = async ({ queryKey }: { queryKey: string[] }) => {
  const [key] = queryKey;
  const { data } = await axiosInstance.get(`${key}?page=1&page_size=10`);
  return data;
};

const getSearchData = async ({ queryKey }: { queryKey: string[] }) => {
  const [_, search] = queryKey;
  const { data } = await axiosInstance.get(
    `/chart_of_account/?page=1&page_size=10&name__contains=${search}&content_type__model__in=staff,customer,bank,cash,supplier`,
  );
  return data;
};

interface IProps {
  onChange: (value: string) => void;
}
export const AccountName: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [banks, setBanks] = useState<any>([]);
  const [cashes, setCashes] = useState<any>([]);
  const [customers, setCustomers] = useState<any>([]);
  const [employees, setEmployees] = useState<any>([]);
  const [suppliers, setSuppliers] = useState<any>([]);

  const onSearch = (value: string) => {
    debounceFuncWarehouse(value);
  };

  const debounceFuncWarehouse = debounce(500, async (value: string) => {
    setSearch(value);
  });

  const bankData = useQuery(`/chart_of_account/ABN-102/child/`, getData);
  const cash = useQuery(`/chart_of_account/ACB-101/child/`, getData);
  const customerData = useQuery(`/chart_of_account/ACU-103/child/`, getData);
  const employeeData = useQuery(`/chart_of_account/LST-203/child/`, getData);
  const supplierData = useQuery(`/chart_of_account/LSU-201/child/`, getData);
  const searchAllData = useQuery(
    [`/chart_of_account/bankCashCustomerEmployeeSupplier/`, search],
    getSearchData,
  );

  React.useEffect(() => {
    const banks = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split('-');
      return id?.[0] === 'BNK';
    });

    const cash = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split('-');
      return id?.[0] === 'CSH';
    });
    const customer = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split('-');
      return id?.[0] === 'CUS';
    });
    const employee = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split('-');
      return id?.[0] === 'STF';
    });
    const supplier = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split('-');
      return id?.[0] === 'SUP';
    });
    setBanks(banks);
    setCashes(cash);
    setCustomers(customer);
    setEmployees(employee);
    setSuppliers(supplier);
  }, [searchAllData?.data?.results?.length]);

  const onChangeAccountName = (value: any) => {
    const splitValue = value?.value.split('-');
    const newValue = splitValue?.[0];
    props.onChange(newValue);

    setSearch('');
  };

  const allBanks = search ? banks : bankData?.data?.results;
  const allCashes = search ? cashes : cash?.data?.results;
  const allCustomers = search ? customers : customerData?.data?.results;
  const allEmployees = search ? employees : employeeData?.data?.results;
  const allSuppliers = search ? suppliers : supplierData?.data?.results;

  return (
    <Row gutter={10}>
      <Col span={24}>
        <Form.Item
          name='accountName'
          // label="Warehouse Name"
          className='margin1'
          rules={[
            {
              required: true,
              message: t('Banking.Form.Account_name_required'),
            },
          ]}
        >
          <Select
            placeholder={t('Banking.Form.Account_name')}
            showSearch
            onSearch={onSearch}
            onChange={onChangeAccountName}
            showArrow
            labelInValue
            optionFilterProp='label'
            notFoundContent={
              searchAllData?.isLoading || searchAllData?.isFetching ? (
                <CenteredSpin size='small' style={styles.spin} />
              ) : undefined
            }
            dropdownRender={(menu) => <div>{menu}</div>}
          >
            <Select.OptGroup label={t('Banking.Banks')}>
              {bankData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key='bankLoader'
                  value='bankLoader'
                  label={<CenteredSpin size='small' />}
                  style={styles.option}
                >
                  <CenteredSpin size='small' style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allBanks?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.name}
                  >
                    {item?.name}
                  </Select.Option>
                ))
              )}
            </Select.OptGroup>

            <Select.OptGroup label={t('Banking.Cash_box.1')}>
              {cash?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key='cashLoader'
                  value='cashLoader'
                  label={<CenteredSpin size='small' />}
                  style={styles.option}
                >
                  <CenteredSpin size='small' style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allCashes?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.name}
                  >
                    {item?.name}
                  </Select.Option>
                ))
              )}
            </Select.OptGroup>
            <Select.OptGroup label={t('Sales.Customers.1')}>
              {customerData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key='customerLoader'
                  value='customerLoader'
                  label={<CenteredSpin size='small' />}
                  style={styles.option}
                >
                  <CenteredSpin size='small' style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allCustomers?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.name}
                  >
                    {item?.name}
                  </Select.Option>
                ))
              )}
            </Select.OptGroup>
            <Select.OptGroup label={t('Employees.1')}>
              {employeeData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key='employeeLoader'
                  value='employeeLoader'
                  label={<CenteredSpin size='small' />}
                  style={styles.option}
                >
                  <CenteredSpin size='small' style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allEmployees?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.name}
                  >
                    {item?.name}
                  </Select.Option>
                ))
              )}
            </Select.OptGroup>
            <Select.OptGroup label={t('Expenses.Suppliers.1')}>
              {supplierData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key='supplierLoader'
                  value='supplierLoader'
                  label={<CenteredSpin size='small' />}
                  style={styles.option}
                >
                  <CenteredSpin size='small' style={styles.optionLoader} />
                </Select.Option>
              ) : (
                allSuppliers?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={item?.name}
                  >
                    {item?.name}
                  </Select.Option>
                ))
              )}
            </Select.OptGroup>
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

const styles = {
  spin: {
    padding: '7px',
  },
  optionLoader: { margin: '0px' },
  option: { height: '45px' },
};
