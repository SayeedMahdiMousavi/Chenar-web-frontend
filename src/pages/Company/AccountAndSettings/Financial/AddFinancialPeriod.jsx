import React, { useState } from 'react';
import {
  Modal,
  Col,
  Row,
  Button,
  Typography,
  Popconfirm,
  Form,
  Input,
} from 'antd';
import { useMediaQuery } from '../../../MediaQurey';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ModalDragTitle } from '../../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { DatePickerFormItem } from '../../../SelfComponents/JalaliAntdComponents/DatePickerFormItem';
import { trimString } from '../../../../Functions/TrimString';
import {
  handlePrepareDateForServer,
  utcDate,
} from '../../../../Functions/utcDate';
import useGetCalender from '../../../../Hooks/useGetCalender';
import useGetRunningPeriod from '../../../../Hooks/useGetRunningPeriod';
import { CancelButton, SaveButton } from '../../../../components';
import { addMessage, manageErrors } from '../../../../Functions';

const dateFormat = 'YYYY-MM-DD';
const { Paragraph } = Typography;
const AddFinancialPeriod = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [confMessage, setConfMessage] = useState('');
  const [disabled, setDisabled] = useState(true);
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  //get running period
  const runningPeriod = useGetRunningPeriod();
  const curStartDate = runningPeriod?.data?.start_date;

  const showModal = () => {
    setConfMessage('');
    setIsShowModal({
      visible: true,
    });
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const addFinancialPeriod = async (value) =>
    await axiosInstance.post(`${props.baseUrl}`, value);

  const {
    mutate: mutateAddFinancialPeriod,
    isLoading,
    reset,
  } = useMutation(addFinancialPeriod, {
    onSuccess: (values) => {
      setIsShowModal({
        visible: false,
      });
      addMessage(values?.data?.name);
      queryClient.invalidateQueries(`${props.baseUrl}`);
      queryClient.invalidateQueries(`${props.baseUrl}get_running_period/`);
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const endDate = handlePrepareDateForServer({
        date: values?.endData,
        calendarCode,
        dateFormat,
      });

      mutateAddFinancialPeriod({
        name: trimString(values.name),
        end_date: endDate,
        description: values.description,
      });
    });
  };

  const handleAfterClose = () => {
    form.resetFields();
    reset();
  };

  //end date

  function disabledDate(current) {
    return current && current < utcDate().endOf('day');
  }

  const text = `${t('Company.End_financial_period_message1', {
    name: runningPeriod?.data?.name,
  })}`;
  const onChangeMessage = (e) => {
    setConfMessage(e.target.value);
  };

  const confirm = () => {
    return (
      <Row style={styles.message}>
        <Col span={24}>
          <Paragraph>
            <ul style={{ listStyleType: 'disc' }}>
              <li>
                {curStartDate &&
                  moment(curStartDate, 'YYYY-MM-DD HH:mm:ss').fromNow()}{' '}
                {t('Company.End_financial_period_message2')}
              </li>
              <li>{t('Company.End_financial_period_message3')}</li>
              <li>{t('Company.End_financial_period_message')}</li>
            </ul>
          </Paragraph>
        </Col>
        <br />
        <h3>{text} </h3>
        <Col span={24}>
          <Input onChange={onChangeMessage} value={confMessage} />{' '}
        </Col>
      </Row>
    );
  };
  const onCancelPop = () => {
    setConfMessage('');
  };
  return (
    <div>
      <Popconfirm
        placement='bottomLeft'
        title={confirm}
        onConfirm={showModal}
        okText={t('Manage_users.Yes')}
        okButtonProps={{
          disabled: trimString(text) !== trimString(confMessage),
        }}
        cancelText={t('Manage_users.No')}
        onCancel={onCancelPop}
      >
        <Button shape='round' type='primary'>
          {t('Company.End_financial_period')}
        </Button>
      </Popconfirm>
      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Company.New_financial_period')}
          />
        }
        afterClose={handleAfterClose}
        destroyOnClose
        modalRender={(modal) => (
          <Draggable disabled={disabled}>{modal}</Draggable>
        )}
        centered
        open={isShowModal.visible}
        onCancel={onCancel}
        width={isMobile ? '100%' : isTablet ? 380 : 380}
        footer={
          <Row justify='end' align='middle'>
            <Col>
              <CancelButton onClick={onCancel} />
              <SaveButton onClick={handleOk} loading={isLoading} />
            </Col>
          </Row>
        }
      >
        <Form
          form={form}
          hideRequiredMark={true}
          scrollToFirstError={true}
          layout='vertical'
        >
          <Form.Item
            name='name'
            label={
              <span>
                {t('Form.Name')} <span className='star'>*</span>
              </span>
            }
            style={styles.margin}
            rules={[{ required: true, message: `${t('Form.Name_required')}` }]}
          >
            <Input />
          </Form.Item>

          <DatePickerFormItem
            name='endData'
            label={
              <span>
                {t('Taxes.Form.End_date')} <span className='star'>*</span>
              </span>
            }
            showTime={false}
            placeholder=''
            format=''
            disabledDate={disabledDate}
            style={styles.margin}
            rules={[
              { type: 'object' },
              { required: true, message: `${t('Company.Required_end_data')}` },
            ]}
          />

          <Form.Item
            name='description'
            label={t('Form.Description')}
            style={styles.margin}
          >
            <Input.TextArea showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const styles = {
  cancel: { margin: '0px 8px' },
  margin: { marginBottom: '8px' },
  message: { width: '350px' },
};

export default AddFinancialPeriod;
