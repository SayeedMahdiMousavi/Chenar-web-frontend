import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Table } from 'antd';
import { useMediaQuery } from '../../MediaQurey';
import { ModalDragTitle } from '../../SelfComponents/ModalDragTitle';
import Draggable from 'react-draggable';
import { Styles } from '../../styles';
import { ViewButton } from '../../../components';

interface IProps {
  record: any;
}

const ViewAuditing: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });
  const [allData, setAllData] = useState([]);

  const [disabled, setDisabled] = useState<boolean>(true);
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isSubBase = useMediaQuery('(max-width: 375px)');

  const showModal = () => {
    setIsShowModal({
      visible: true,
    });

    if (props?.record?.changed_fields !== null) {
      const values: any = [];
      const modifiedValues = props?.record?.changed_fields;
      for (let value in modifiedValues) {
        values.push({
          key: value,
          prevValue: modifiedValues[value]?.[0],
          newValue: modifiedValues[value]?.[1],
        });
      }
      setAllData(values);
    }
  };
  const handleCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const columns = [
    {
      dataIndex: 'row',
      key: 'row',
      title: t('Table.Row'),
      align: 'center',
      width: 60,
      render: (_: any, __: any, index: number) => (
        <React.Fragment>{index + 1}</React.Fragment>
      ),
    },
    {
      title: t('Auditing.Field'),
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: t('Auditing.Previous_value'),
      dataIndex: 'prevValue',
      key: 'prevValue',
    },
    {
      title: t('Auditing.New_value'),
      dataIndex: 'newValue',
      key: 'newValue',
    },
  ];

  const handleAfterClose = () => {
    setAllData([]);
  };
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <ViewButton onClick={showModal} />

      <Modal
        maskClosable={false}
        title={
          <ModalDragTitle
            disabled={disabled}
            setDisabled={setDisabled}
            title={t('Auditing.Account_information')}
          />
        }
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            nodeRef={ref as React.RefObject<HTMLElement>}
          >
            <div ref={ref}>{modal}</div>
          </Draggable>
        )}
        style={Styles.modal(isMobile)}
        bodyStyle={{
          ...Styles.modalBody(isMobile, isSubBase, isMiniTablet),
          paddingBottom: '24px',
        }}
        open={isShowModal.visible}
        destroyOnClose
        afterClose={handleAfterClose}
        centered
        width={800}
        onCancel={handleCancel}
        footer={false}
      >
        <Table
          dataSource={allData}
          pagination={false}
          //@ts-ignore
          columns={columns}
          // rowClassName={() => "page-break"}
          bordered
          size='small'
        />
      </Modal>
    </div>
  );
};

export default ViewAuditing;
