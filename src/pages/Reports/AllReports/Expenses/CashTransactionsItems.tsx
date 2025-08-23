import React, { useState } from 'react';
import { Col, Row, Form, Select } from 'antd';
import { debounce } from 'throttle-debounce';
import { useQuery } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { useTranslation } from 'react-i18next';
import { CenteredSpin } from '../../../SelfComponents/Spin';

const getData = async ({ queryKey }: { queryKey: string[] }) => {
  const [key] = queryKey;
  const { data } = await axiosInstance.get(`${key}?page=1&page_size=5`);
  return data;
};

const getSearchData = async ({ queryKey }: { queryKey: string[] }) => {
  const search = queryKey?.[1];
  const { data } = await axiosInstance.get(
    `/chart_of_account/?page=1&page_size=10&name__contains=${search}&content_type__model__in=staff,customer,bank,cash,supplier,incometype,expensetype,widthdraw`,
  );
  return data;
};

interface IProps {
  form: any;
  placeholder: string;
  name: string;
}
export const CashTransactionsItems: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [banks, setBanks] = useState<any>([]);
  const [cashes, setCashes] = useState<any>([]);
  const [customers, setCustomers] = useState<any>([]);
  const [employees, setEmployees] = useState<any>([]);
  const [suppliers, setSuppliers] = useState<any>([]);
  const [expenses, setExpenses] = useState<any>([]);
  const [incomes, setIncomes] = useState<any>([]);
  const [withDraws, setWithDraws] = useState<any>([]);

  //search all warehouse
  const onSearch = (value: string) => {
    debounceFuncWarehouse(value);
  };

  const debounceFuncWarehouse = debounce(600, async (value: string) => {
    setSearch(value);
  });

  const bankData = useQuery(`/chart_of_account/ABN-102/child/`, getData);
  const cash = useQuery(`/chart_of_account/ACB-101/child/`, getData);
  const customerData = useQuery(`/chart_of_account/ACU-103/child/`, getData);
  const employeeData = useQuery(`/chart_of_account/LST-203/child/`, getData);
  const supplierData = useQuery(`/chart_of_account/LSU-201/child/`, getData);
  const expenseData = useQuery(`/chart_of_account/IEI-502/child/`, getData);
  const incomeData = useQuery(`/chart_of_account/IEI-402/child/`, getData);
  const withDrawData = useQuery(`/chart_of_account/WTC-302/child/`, getData);
  const searchAllData = useQuery(
    [`/chart_of_account/cashTransactions/`, search],
    getSearchData,
  );

  React.useEffect(() => {
    const banks = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split('-');
      return id?.[0] === 'BNK';
    });
    //
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
    const expense = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split('-');
      return id?.[0] === 'OXP';
    });
    const income = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split('-');
      return id?.[0] === 'EIC';
    });
    const withdraw = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split('-');
      return id?.[0] === 'TAK';
    });
    setBanks(banks);
    setCashes(cash);
    setCustomers(customer);
    setEmployees(employee);
    setSuppliers(supplier);
    setExpenses(expense);
    setIncomes(income);
    setWithDraws(withdraw);
  }, [searchAllData?.data?.results?.length]);
  //when bank name change
  const onChangeAccountName = (value: any) => {
    //

    // const valueType = value?.value.split("-");

    setSearch('');
  };

  const allBanks = search ? banks : bankData?.data?.results;
  const allCashes = search ? cashes : cash?.data?.results;
  const allCustomers = search ? customers : customerData?.data?.results;
  const allEmployees = search ? employees : employeeData?.data?.results;
  const allSuppliers = search ? suppliers : supplierData?.data?.results;
  const allExpenses = search ? expenses : expenseData?.data?.results;
  const allIncomes = search ? incomes : incomeData?.data?.results;
  const allWithDraws = search ? withDraws : withDrawData?.data?.results;

  return (
    <Row gutter={10}>
      <Col span={24}>
        <Form.Item
          name={props.name}
          // label="Warehouse Name"
          className='margin1'
        >
          <Select
            placeholder={props.placeholder}
            showSearch
            onSearch={onSearch}
            onChange={onChangeAccountName}
            showArrow
            allowClear
            labelInValue
            notFoundContent={
              searchAllData?.isLoading || searchAllData?.isFetching ? (
                <CenteredSpin size='small' style={styles.spin} />
              ) : undefined
            }
            optionFilterProp='label'
            dropdownRender={(menu) => <div>{menu}</div>}
          >
            <Select.OptGroup label={t('Banking.Banks')}>
              {bankData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key='sdsds'
                  value='dsdsd'
                  label='sdfsdfds'
                  style={{ height: '40px' }}
                >
                  <CenteredSpin size='small' style={styles.spin} />
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
                  key='sdsds'
                  value='dsdsd'
                  label='sdfsdfds'
                  style={{ height: '40px' }}
                >
                  <CenteredSpin size='small' style={styles.spin} />
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
                  key='sdsds'
                  value='dsdsd'
                  label='sdfsdfds'
                  style={{ height: '40px' }}
                >
                  <CenteredSpin size='small' style={styles.spin} />
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
            <Select.OptGroup label={t('Expenses.Suppliers.1')}>
              {supplierData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key='sdsds'
                  value='dsdsd'
                  label='sdfsdfds'
                  style={{ height: '40px' }}
                >
                  <CenteredSpin size='small' style={styles.spin} />
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
            <Select.OptGroup label={t('Employees.1')}>
              {employeeData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key='sdsds'
                  value='dsdsd'
                  label='sdfsdfds'
                  style={{ height: '40px' }}
                >
                  <CenteredSpin size='small' style={styles.spin} />
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
            <Select.OptGroup label={t('Expenses.1')}>
              {expenseData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key='sdsds'
                  value='dsdsd'
                  label='sdfsdfds'
                  style={{ height: '40px' }}
                >
                  <CenteredSpin size='small' style={styles.spin} />
                </Select.Option>
              ) : (
                allExpenses?.map((item: any) => (
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
            <Select.OptGroup label={t('Expenses.Income.1')}>
              {incomeData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key='sdsds'
                  value='dsdsd'
                  label='sdfsdfds'
                  style={{ height: '40px' }}
                >
                  <CenteredSpin size='small' style={styles.spin} />
                </Select.Option>
              ) : (
                allIncomes?.map((item: any) => (
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
            <Select.OptGroup label={t('Expenses.With_draw.1')}>
              {withDrawData?.isLoading ? (
                <Select.Option
                  disabled={true}
                  key='sdsds'
                  value='dsdsd'
                  label='sdfsdfds'
                  style={{ height: '40px' }}
                >
                  <CenteredSpin size='small' style={styles.spin} />
                </Select.Option>
              ) : (
                allWithDraws?.map((item: any) => (
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
const styles = { spin: { padding: '7px' } };
