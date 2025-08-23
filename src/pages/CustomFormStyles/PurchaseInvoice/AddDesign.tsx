import {
  Col,
  Row,
  Drawer,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Button,
  Space,
} from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CancelButton,
  FormItemRequiredLabel,
  SaveButton,
} from '../../../components';

export default function AddPurchaseDesign() {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [{ logo, logoSize }, setFormData] = useState({
    logo: true,
    logoSize: 80,
  });

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleChangeInput = (e: any) => {
    if (typeof e === 'number') {
    } else {
    }
  };

  const handleSaveDesign = () => {};

  return (
    <>
      <div onClick={showDrawer}>Purchase invoice</div>
      <Drawer
        maskClosable={false}
        title='Basic Drawer'
        placement='top'
        onClose={onClose}
        open={visible}
        height='100%'
        footer={
          <div className='textAlign__end'>
            <Space>
              <CancelButton onClick={onClose} />
              <SaveButton onClick={handleSaveDesign} />
            </Space>
          </div>
        }
      >
        <Row>
          <Col span={12}>
            <Form
              layout='vertical'
              hideRequiredMark
              form={form}
              // onFinish={onFinish}
              initialValues={{ logoSize: 80, companyNameSize: 4 }}
            >
              <Row>
                <Col span={12}>
                  <Form.Item
                    name='name'
                    className='formItem'
                    label={<FormItemRequiredLabel label={t('Form.Name')} />}
                    rules={[
                      {
                        required: true,
                        message: t('Form.Name_required'),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name='showLogo'
                    valuePropName='checked'
                    className='formItem'
                  >
                    <Checkbox onChange={handleChangeInput} name='name'>
                      {t('Company.Logo')}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={15}>
                  <Form.Item
                    name='logoSize'
                    className='formItem'
                    // className="edit_fields_pdf"
                    label={t('Custom_form_styles.Logo_size')}
                  >
                    <InputNumber
                      onChange={handleChangeInput}
                      min={30}
                      max={170}
                      name='name'
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {' '}
                  <Form.Item
                    name='companyName'
                    className='formItem'
                    valuePropName='checked'
                  >
                    <Checkbox onChange={handleChangeInput}>
                      {t('Custom_form_styles.Business_name')}
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    name='companyNameSize'
                    className='formItem'
                    label={t('Custom_form_styles.Business_name_font_size')}
                  >
                    <InputNumber
                      onChange={handleChangeInput}
                      className='num'
                      min={1}
                      max={5}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={12}></Col>
        </Row>
      </Drawer>
    </>
  );
}
