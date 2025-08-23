import React, { ReactNode, useCallback } from 'react';
import { Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { checkPermissions } from '../Functions';

interface IProps {
  children: ReactNode;
  model: string;
  record: any;
  disabled: boolean;
  editingKey: string;
  save: (record: any) => void;
  edit: (record: any) => void;
  onCancel: () => void;
  editable?: boolean;
}

export function EditableTableActionColumnRender({
  children,
  model,
  disabled,
  record,
  editable: isEditable,
  save,
  onCancel,
  editingKey,
  edit,
}: IProps) {
  const { t } = useTranslation();

  const isEditing = useCallback(
    //@ts-ignore
    (record) => record.id === editingKey,
    [editingKey],
  );
  const editable = Boolean(isEditable) ? isEditable : isEditing(record);
  return editable ? (
    <span>
      <a onClick={() => save(record)}>{t('Form.Save')}</a>
      <br />
      <Popconfirm
        title={t('Sales.Product_and_services.Categories.Edit_Message')}
        onConfirm={onCancel}
        okText={t('Form.Ok')}
        cancelText={t('Form.Cancel')}
      >
        <span className='category__cancel'>{t('Form.Cancel')}</span>
      </Popconfirm>
    </span>
  ) : (
    <div className='category__action'>
      {checkPermissions(`change_${model}`) && (
        <a
          //@ts-ignore
          disabled={disabled}
          onClick={() => edit(record)}
        >
          {t('Sales.Customers.Table.Edit')}
        </a>
      )}
      {children}
    </div>
  );
}
