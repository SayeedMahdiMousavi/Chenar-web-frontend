import React from 'react';
import { Typography } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { Colors } from '../../../colors';
const { Text, Paragraph } = Typography;
const Supplier = (props) => {
  return (
    <div style={styles.accessPadding(props.isMiniTablet)}>
      <Text strong={true}>Suppliers and purchases</Text> <br />
      <br />
      <Text>This user can:</Text>
      <br />
      <br />
      <Paragraph>
        <ul className='ul_line'>
          <li>
            {' '}
            <CheckOutlined className='list_tick' />
            &nbsp; Enter bills from suppliers
          </li>
          <li>
            {' '}
            <CheckOutlined className='list_tick' />
            &nbsp; Enter cash and credit card purchases
          </li>
          <li>
            {' '}
            <CheckOutlined className='list_tick' /> &nbsp;Pay bills, write
            checks, and view check detail reports
          </li>
          <li>
            {' '}
            <CheckOutlined className='list_tick' /> &nbsp;Add, edit, and delete
            suppliers, products, and services
          </li>
          <li>
            {' '}
            <CheckOutlined className='list_tick' />
            &nbsp; View supplier and A/P reports
          </li>
          <li>
            {' '}
            <CheckOutlined className='list_tick' />
            &nbsp; View tax rates and agency settings
          </li>
          <li>
            {' '}
            <CheckOutlined className='list_tick' />
            &nbsp; Use and adjust tax in purchase, credit card, and banking
            transactions, including manually overriding calculated tax amounts
          </li>
          <li>
            {' '}
            <CheckOutlined className='list_tick' />
            &nbsp; Run tax reports or view tax history
          </li>
          <li>
            {' '}
            <CheckOutlined className='list_tick' />
            &nbsp; Prepare a tax return, record a payment or refund, or file
            taxes
          </li>
          <li>
            {' '}
            <CheckOutlined className='list_tick' />
            &nbsp; Add, edit, and delete currencies
          </li>
          <li>
            {' '}
            <CheckOutlined className='list_tick' />
            &nbsp; Edit exchange rates
          </li>
        </ul>
      </Paragraph>
      <br />
      <Text>They can’t:</Text>
      <br />
      <br />
      <Paragraph>
        <ul className='ul_line'>
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;Add, edit, and delete
            accounts and quantity on hand
          </li>
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;View account histories
          </li>
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;Set up new or change
            existing tax rates, tax method, or agency settings
          </li>

          <li>
            <CloseOutlined style={styles.close} /> &nbsp;See total income and
            expense amounts on Home, Supplier, and Customer pages
          </li>
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;Set up multiCurrency
          </li>
          <li>
            <CloseOutlined style={styles.close} /> &nbsp;Perform home currency
            adjustments
          </li>
        </ul>
      </Paragraph>
    </div>
  );
};
const styles = {
  close: { color: `${Colors.red}` },
  accessPadding: (isMiniTablet) => ({ paddingTop: isMiniTablet ? '15px' : '' }),
};
export default Supplier;
