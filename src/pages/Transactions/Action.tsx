import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Menu, Dropdown } from 'antd';
import EditPayAndReceiveCash from './PayAndReceiveTransactions/EditPayAndRecCash';
import EditTransaction from './EditTransaction';
import ActionButton from '../SelfComponents/ActionButton';
import { RemovePopconfirm } from '../../components';
import { useRemoveItem } from '../../Hooks';
import { checkPermissions } from '../../Functions';

// import {
//   journalResultUrl,
//   journalUrl,
// } from "../Reports/AllReports/JournalBook/JournalBook";
// import { accountStatisticsUrl } from "../Reports/AllReports/AccountsStatistics/AccountsStatistics";
// import { debitCreditUrl } from "../Reports/AllReports/DebitAndCredit/DebitAndCredit";
// import { cashTransactionsUrl } from "../Reports/AllReports/AllReports";

interface IProps {
  record: any;
  baseUrl: string;
  place: string;
  modalTitle: string;
  hasSelected: boolean;
  model: string;
}
const Action: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  //     onSuccess: () => {
  //       // queryClient.invalidateQueries(`${journalUrl}`);
  //       // queryClient.invalidateQueries(`${journalResultUrl}`);
  //       // queryClient.invalidateQueries(`${cashTransactionsUrl}`);
  //       // queryClient.invalidateQueries(`${cashTransactionsUrl}result/`);
  //       queryClient.invalidateQueries(`${props.baseUrl}`);
  //       if (
  //         props.place === "employeePayAndRecCash" ||
  //         props.place === "supplierPayAndRecCash" ||
  //         props.place === "customerPayAndRecCash" ||
  //         props.place === "recordSalaries"
  //       ) {
  //         // queryClient.invalidateQueries(`${accountStatisticsUrl}`);
  //         // queryClient.invalidateQueries(`${accountStatisticsUrl}result/`);
  //         // queryClient.invalidateQueries(`${debitCreditUrl}`);
  //         // queryClient.invalidateQueries(`${debitCreditUrl}result/`);
  //       }
  //     },

  const handleUpdateItems = useCallback(() => {
    queryClient.invalidateQueries(props.baseUrl);
  }, [props.baseUrl, queryClient]);

  //delete transaction item
  const {
    reset,
    isLoading,
    handleDeleteItem,
    removeVisible,
    setRemoveVisible,
  } = useRemoveItem({
    baseUrl: `${props.baseUrl}${props?.record?.id}/`,
    setVisible,
    recordName: t(
      'Sales.All_sales.Purchase_and_sales.Transaction',
    ).toLocaleLowerCase(),
    handleUpdateItems: handleUpdateItems,
    removeMessage: t('Message.Transaction_remove_message'),
  });

  const handleCancel = () => {
    setVisible(false);
    setRemoveVisible(false);
    reset();
  };

  const handleClickRemove = () => {
    setRemoveVisible(!removeVisible);
  };

  const handleClickEdit = () => {
    setRemoveVisible(false);
  };

  const payCashId =
    props?.record?.pay_by && props?.record?.pay_by?.id?.split('-');

  const action = (
    <Menu>
      <RemovePopconfirm
        itemName={t(
          'Sales.All_sales.Purchase_and_sales.Transaction',
        ).toLocaleLowerCase()}
        openConfirm={removeVisible}
        loading={isLoading}
        onConfirm={handleDeleteItem}
        onCancel={handleCancel}
        onClick={handleClickRemove}
        permission={props?.model}
      />

      {checkPermissions(`change_${props.model}`) && (
        <Menu.Item onClick={handleClickEdit}>
          {props.place === 'customerPayAndRecCash' ||
          props.place === 'employeePayAndRecCash' ||
          props.place === 'supplierPayAndRecCash' ||
          props.place === 'currencyExchange' ||
          props.place === 'withdrawPayAndRecCash' ? (
            <EditPayAndReceiveCash
              record={props.record}
              baseUrl={props.baseUrl}
              place={props.place}
              type={payCashId?.[0] === 'CSH' ? 'payCash' : 'recCash'}
              setVisible={setVisible}
            />
          ) : (
            <EditTransaction
              record={props.record}
              setVisible={setVisible}
              baseUrl={props.baseUrl}
              place={props.place}
              modalTitle={props.modalTitle}
            />
          )}
        </Menu.Item>
      )}
    </Menu>
  );

  const handleVisibleChange = (flag: any) => {
    setVisible(flag);
  };

  return (
    <Dropdown
      overlay={action}
      trigger={['click']}
      onOpenChange={handleVisibleChange}
      open={visible}
      disabled={props.hasSelected}
    >
      <ActionButton onClick={handleVisibleChange} />
    </Dropdown>
  );
};

export default Action;
