import React, { useState } from 'react';
import { Form, Select } from 'antd';
import { debounce } from 'throttle-debounce';
import { useQuery } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { useTranslation } from 'react-i18next';
import { CenteredSpin } from '../../SelfComponents/Spin';

const getData = async ({ queryKey }: any) => {
  const key = queryKey?.[0];
  const { data } = await axiosInstance.get(`${key}?page=1&page_size=10`);
  return data;
};

const getSearchData = async ({ queryKey }: any) => {
  const search = queryKey?.[1];
  const { data } = await axiosInstance.get(
    `/chart_of_account/?page=1&page_size=10&name__contains=${search}&content_type__model__in=customer,staff`,
  );
  return data;
};

interface IProps {
  form: any;
}
export const EmployeeAndCustomerChart: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<any>([]);
  const [employees, setEmployees] = useState<any>([]);

  const onSearch = (value: string) => {
    debounceFuncWarehouse(value);
  };

  const debounceFuncWarehouse = debounce(500, async (value: string) => {
    setSearch(value);
  });

  const customerData = useQuery(`/chart_of_account/ACU-103/child/`, getData);

  const employeeData = useQuery(`/chart_of_account/LST-203/child/`, getData);

  const searchAllData = useQuery(
    [`/chart_of_account/customerEmployee/`, search],
    getSearchData,
  );

  React.useEffect(() => {
    const customer = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split('-');
      return id?.[0] === 'CUS';
    });

    const employee = searchAllData?.data?.results?.filter((item: any) => {
      const id = item?.id?.split('-');
      return id?.[0] === 'SUP';
    });
    setCustomers(customer);
    setEmployees(employee);
  }, [searchAllData?.data?.results?.length]);

  const allCustomers = search ? customers : customerData?.data?.results;
  const allEmployees = search ? employees : employeeData?.data?.results;

  return (
    <Form.Item name='accountName' className='margin1'>
      <Select
        placeholder={t('Banking.Form.Account_name')}
        showSearch
        onSearch={onSearch}
        showArrow
        notFoundContent={
          searchAllData?.isLoading || searchAllData?.isFetching ? (
            <CenteredSpin size='small' style={styles.spin} />
          ) : undefined
        }
        labelInValue
        optionFilterProp='label'
        dropdownRender={(menu) => <div>{menu}</div>}
      >
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
              <Select.Option key={item?.id} value={item?.id} label={item?.name}>
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
              <Select.Option key={item?.id} value={item?.id} label={item?.name}>
                {item?.name}
              </Select.Option>
            ))
          )}
        </Select.OptGroup>
      </Select>
    </Form.Item>
  );
};
const styles = {
  spin: { padding: '7px' },
  optionLoader: { margin: '0px' },
  option: { height: '45px' },
};
