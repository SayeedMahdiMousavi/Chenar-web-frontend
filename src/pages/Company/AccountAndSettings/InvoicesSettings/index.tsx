import { Col, Row, Typography, Descriptions, Form, Switch } from 'antd';
import React, { Children, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const CheckBoxItem = ({ name }: { name: string }) => {
  return (
    <Form.Item name={name} valuePropName='checked' style={styles.formItem}>
      <Switch />
    </Form.Item>
  );
};

const DescriptionItem = ({
  label,
  children,
  ...rest
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <Descriptions.Item label={label} {...rest}>
      {children}
    </Descriptions.Item>
  );
};

const Description = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <>
      <Title level={5} style={{ marginBottom: '20px' }}>
        {title}
      </Title>
      <Descriptions
        column={1}
        style={{ paddingInlineStart: '40px' }}
        colon={false}
        labelStyle={{
          width: '200px',
          paddingInlineEnd: '10px',
          alignItems: 'center',
        }}
      >
        {children}
      </Descriptions>
    </>
  );
};

export default function InvoiceSettings() {
  const { t } = useTranslation();
  return (
    <Form initialValues={{ switch: true }}>
      <Row style={{ padding: '35px' }}>
        <Col span={24}>
          <Description title={t('Invoices_general_settings')}>
            <DescriptionItem label='UserName'>
              <CheckBoxItem name='switch' />
            </DescriptionItem>
            <DescriptionItem label='Telephone'>
              <CheckBoxItem name='switch' />
            </DescriptionItem>
            <DescriptionItem label='Live'>
              <CheckBoxItem name='switch' />
            </DescriptionItem>
            <DescriptionItem label='Remark'>
              <CheckBoxItem name='switch' />
            </DescriptionItem>
          </Description>
          <Description title={t('Invoices_general_settings')}>
            <DescriptionItem label='UserName'>
              <CheckBoxItem name='switch' />
            </DescriptionItem>
            <DescriptionItem label='Telephone'>
              <CheckBoxItem name='switch' />
            </DescriptionItem>
            <DescriptionItem label='Live'>
              <CheckBoxItem name='switch' />
            </DescriptionItem>
            <DescriptionItem label='Remark'>
              <CheckBoxItem name='switch' />
            </DescriptionItem>
          </Description>
        </Col>
      </Row>
    </Form>
  );
}

interface IStyles {
  formItem: React.CSSProperties;
}

const styles = {
  formItem: { marginBottom: '0px' },
};
