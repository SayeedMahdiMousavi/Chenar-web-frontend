import React, { useState } from 'react';
import { Modal, Col, Row, Button, Switch } from 'antd';
import { useMediaQuery } from '../../MediaQurey';
import { useMutation } from 'react-query';
import axiosInstance from '../../ApiBaseUrl';
import { Form, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { Styles } from '../../styles';
import { ActionMessage } from '../../SelfComponents/TranslateComponents/ActionMessage';
import { manageErrors } from '../../../Functions';
import { CancelButton, EditMenuItem, SaveButton } from '../../../components';
import { BACKUP_SETTINGS_M } from '../../../constants/permissions';

const EditInterval = ({
  record,
  setVisible,
  baseUrl,
  handleUpdateItems,
  handleClickEdit,
  ...rest
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });

  const [disabled, setDisabled] = useState(true);
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  const intervale = record?.task_type !== 'clocked';

  const showModal = () => {
    handleClickEdit();
    setVisible(false);
    setIsShowModal({
      visible: true,
    });

    const formData = {
      description: record?.description,
      enabled: record?.enabled,
    };
    form.setFieldsValue({ ...formData });

    // if (intervale) {
    //   setPeriod(props?.record?.interval?.period);
    //   form.setFieldsValue({
    //     ...formData,
    //     every: props?.record?.interval?.every,
    //     period: props?.record?.interval?.period,
    //   });
    // } else {
    //   const date =
    //     calenderCode === "gregory"
    //       ? moment(props?.record?.clocked_time, dateFormat)
    //       : dayjs(changeGToJ(props?.record?.clocked_time, dateFormat), {
    //           //@ts-ignore
    //           jalali: true,
    //         });
    //   form.setFieldsValue({ ...formData, date: date });
    // }
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handleEditInterval = async (value) => {
    return await axiosInstance.put(`${baseUrl}${record.id}/`, value);
  };

  const {
    mutate: mutateEditInterval,
    isLoading,
    reset,
  } = useMutation(handleEditInterval, {
    onSuccess: (value) => {
      setIsShowModal({
        visible: false,
      });
      message.success(
        <ActionMessage name={value?.data?.id} message='Message.Update' />,
      );
      handleUpdateItems();
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const data = {
          description: values.description,
          enabled: values.enabled,
        };

        mutateEditInterval(data);
        // if (intervale) {
        //   data["interval"] = { every: values.every, period: values?.period };
        //   mutateEditInterval(data);
        // } else {
        //   const dateTime =
        //     calenderCode === "gregory"
        //       ? values?.date?.format(dateFormat)
        //       : changeJToG(
        //           values?.date.locale("fa").format(dateFormat),
        //           dateFormat
        //         );
        //   data["clocked"] = { clocked_time: dateTime };
        //   mutateEditInterval(data);
        // }
      })
      .catch((info) => {
        //
      });
  };

  const handleAfterClose = () => {
    form.resetFields();
    reset();
  };
  const ref = React.useRef(null);

  return (
    <div>
      <EditMenuItem
        {...rest}
        onClick={showModal}
        permission={BACKUP_SETTINGS_M}
      />

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={
              intervale
                ? t('Company.Edit_intervale')
                : t('Company.Edit_schedule')
            }
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        centered
        destroyOnClose
        afterClose={handleAfterClose}
        open={isShowModal.visible}
        onCancel={onCancel}
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        width={isMobile ? '100%' : isTablet ? 370 : isBgTablet ? 370 : 370}
        footer={
          <Row justify='end'>
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
          {/* {intervale ? (
            <Form.Item
              label={
                <>
                  {t("Company.Intervale")}
                  <span className="star">*</span>
                </>
              }
              style={styles.margin}
            >
              <Input.Group compact>
                <Form.Item
                  name="every"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: t("Company.Intervale_required"),
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "40%" }}
                    type="number"
                    min={
                      period === "minutes"
                        ? 10
                        : period === "seconds"
                        ? 600
                        : undefined
                    }
                  />
                </Form.Item>
                <Form.Item name="period" noStyle>
                  <Select
                    style={{ width: "60%" }}
                    onChange={handleChangePeriod}
                  >
                    {props?.periodList?.map((item) => (
                      <Select.Option value={item?.value} key={item?.value}>
                        {item?.display_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          ) : (
            <DatePickerFormItem
              placeholder=""
              name="date"
              label={t("Sales.Customers.Form.Date")}
              showTime={true}
              format={dateFormat}
              rules={[
                { type: "object" },
                {
                  required: true,
                  message: t("Sales.Customers.Form.Date_required"),
                },
              ]}
              style={styles.margin}
            />
          )} */}
          <Form.Item
            name='description'
            label={t('Form.Description')}
            style={styles.margin}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label={t('Company.Enabled')}
            name='enabled'
            valuePropName='checked'
            style={{ ...styles.margin, width: '90px' }}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
const styles = {
  margin: { marginBottom: '8px' },
  modal: { maxHeight: `calc(100vh - 135px)`, overflowY: 'auto' },
};

export default EditInterval;
