import React, { useState } from 'react';
import { Modal, Col, Row } from 'antd';
import { useMediaQuery } from '../../../MediaQurey';
import dayjs from 'dayjs';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import moment from 'moment';
import { Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalDragTitle } from '../../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { DatePickerFormItem } from '../../../SelfComponents/JalaliAntdComponents/DatePickerFormItem';
import { trimString } from '../../../../Functions/TrimString';
import {
  changeGToJ,
  handlePrepareDateForServer,
  utcDate,
} from '../../../../Functions/utcDate';
import useGetCalender from '../../../../Hooks/useGetCalender';
import { CancelButton, SaveButton } from '../../../../components';
import { manageErrors, updateMessage } from '../../../../Functions';

const dateFormat = 'YYYY-MM-DD';
const Edit = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');

  //get current calender
  const userCalender = useGetCalender();
  const calendarCode = userCalender?.data?.user_calender?.code;

  const showModal = () => {
    const endDate =
      calendarCode === 'gregory'
        ? moment(props?.record?.end_date, dateFormat)
        : dayjs(changeGToJ(props?.record?.end_date, dateFormat), {
            //@ts-ignore
            jalali: true,
          });
    form.setFieldsValue({
      name: props?.record?.name,
      endDate: endDate,
      description: props?.record?.description,
    });

    setIsShowModal({
      visible: true,
    });
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const editFinancialPeriod = async (value) =>
    await axiosInstance.patch(`${props.baseUrl}${props.record.id}/`, value);

  const {
    mutate: mutateEditFinancialPeriod,
    isLoading,
    reset,
  } = useMutation(editFinancialPeriod, {
    onSuccess: (values) => {
      setIsShowModal({
        visible: false,
      });
      updateMessage(values?.data?.name);
      queryClient.invalidateQueries(props.baseUrl);
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (value) => {
      let values = {};
      if (props.record.is_running === true) {
        const endDate = handlePrepareDateForServer({
          date: values?.endData,
          calendarCode,
          dateFormat,
        });

        values = {
          ...value,
          endDate: endDate,
        };
      }

      const allData = {
        name:
          props.record.is_running === true
            ? trimString(values.name)
            : trimString(value.name),
        end_date: props.record.is_running ? values.endDate : undefined,
        description:
          props.record.is_running === true
            ? values.description
            : value.description,
      };
      if (props.record.end_date === values.endData) {
        delete allData['end_date'];
      }
      mutateEditFinancialPeriod(allData);
    });
  };

  const handleAfterClose = () => {
    form.resetFields();
    reset();
  };

  function disabledDate(current) {
    return current && current < utcDate().endOf('day');
  }
  const ref = React.useRef(null);

  return (
    <div>
      <div className='num' onClick={showModal}>
        <a
          className='ant-dropdown-link'
          href='#'
          onClick={(e) => e.preventDefault()}
        >
          {t('Sales.Customers.Table.Edit')}
        </a>
      </div>

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Company.New_financial_period')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        centered
        open={isShowModal.visible}
        destroyOnClose
        afterClose={handleAfterClose}
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
          {props.record.is_running === true && (
            <DatePickerFormItem
              name='endDate'
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
                {
                  required: true,
                  message: `${t('Company.Required_end_data')}`,
                },
              ]}
            />
          )}
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
  message: { width: '306px' },
};

export default Edit;
