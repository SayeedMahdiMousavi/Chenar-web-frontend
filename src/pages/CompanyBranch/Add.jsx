import React, { useState } from 'react';
import { Modal, Col, Row, Button } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../ApiBaseUrl';
import { Form, Input, message } from 'antd';
// import { useDatabase } from "@nozbe/watermelondb/hooks";
// import withObservables from "@nozbe/with-observables";
// import { withDatabase } from "@nozbe/watermelondb/DatabaseProvider";
import { useTranslation } from 'react-i18next';
import Draggable from 'react-draggable';
import { ModalDragTitle } from '../SelfComponents/ModalDragTitle';
import { Styles } from '../styles';
import { ActionMessage } from '../SelfComponents/TranslateComponents/ActionMessage';
import { trimString } from '../../Functions/TrimString';
import { CancelButton, PageNewButton, SaveButton } from '../../components';
import { BRANCH_M } from '../../constants/permissions';

const AddBranch = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');
  const isBgTablet = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
    setLoading(false);
    form.resetFields();
  };

  const handleAfterClose = () => {
    setLoading(false);
    form.resetFields();
  };

  const handleAddBranch = async (value) => {
    await axiosInstance
      .post(`/inventory/warehouse/`, value)
      .then((res) => {
        setIsShowModal({
          visible: false,
        });
        message.success(
          <ActionMessage name={res.data?.name} message='Message.Add' />,
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error?.response?.data?.name) {
          message.error(`${error?.response?.data?.name?.[0]}`);
        } else if (error?.response?.data?.responsible) {
          message.error(`${error?.response?.data?.responsible?.[0]}`);
        } else if (error?.response?.data?.address) {
          message.error(`${error?.response?.data?.address?.[0]}`);
        }
      });
  };

  const { mutate: mutateAddBranch, isLoading } = useMutation(handleAddBranch, {
    onSuccess: () => queryClient.invalidateQueries(`/inventory/warehouse/`),
  });

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        const data = {
          name: trimString(values.name),
          responsible: trimString(values.responsible),
          address: trimString(values.address),
        };
        mutateAddBranch(data);
      })
      .catch((info) => {});
  };
  const ref = React.useRef(null);

  return (
    <div>
      <PageNewButton onClick={showModal} model={BRANCH_M} />

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Company_branch.Branch_information')}
          />
        }
        modalRender={(modal) => (
          <Draggable disabled={disabled} nodeRef={ref}>
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        afterClose={handleAfterClose}
        destroyOnClose
        centered
        open={isShowModal.visible}
        onCancel={onCancel}
        wrapClassName='warehouse_add_modal'
        style={Styles.modal(isMobile)}
        bodyStyle={Styles.modalBody(isMobile, isSubBase, isMiniTablet)}
        width={isMobile ? '100%' : isTablet ? 370 : isBgTablet ? 370 : 370}
        footer={
          <Row justify='end' align='middle'>
            <Col>
              <CancelButton onClick={onCancel} />
              <SaveButton onClick={handleOk} loading={loading} />
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
            label={
              <span>
                {t('Form.Name')}
                <span className='star'>*</span>
              </span>
            }
            style={styles.margin}
            name='name'
            rules={[{ required: true, message: `${t('Form.Name_required')}` }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            label={
              <span>
                {t('Warehouse.Responsible')}
                <span className='star'>*</span>
              </span>
            }
            style={styles.margin}
            name='responsible'
            rules={[
              {
                required: true,
                message: `${t('Warehouse.Required_responsible')}`,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <span>
                {t('Form.Address')}
                <span className='star'>*</span>
              </span>
            }
            name='address'
            style={styles.margin}
            rules={[
              { required: true, message: `${t('Form.Required_address')}` },
            ]}
          >
            <Input.TextArea />
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
// const enhancProduct = withObservables(["groups"], ({ database }) => ({
//   groups: database.collections.get("groups").query().observe(),
// }));
// export default connect(null)(withDatabase(enhancProduct(AddBackup)));

export default AddBranch;
