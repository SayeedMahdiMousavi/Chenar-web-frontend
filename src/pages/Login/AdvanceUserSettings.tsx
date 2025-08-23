import React, { useState } from 'react';
import { Modal, Select, message, Form, Space, Spin } from 'antd';
import { useMediaQuery } from '../MediaQurey';
import { useMutation, useQueryClient } from 'react-query';
import axiosInstance from '../ApiBaseUrl';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import moment from 'moment';
import { lessVars } from '../../theme/index';
import { useDarkMode } from '../../Hooks/useDarkMode';
import { manageNetworkError } from '../../Functions/manageNetworkError';
import { useGetUserInfo } from '../../Hooks';
import { CancelButton, SaveButton } from '../../components';
import { manageErrors } from '../../Functions';

const { Option } = Select;

function AdvanceUserSettings() {
  const queryClient = useQueryClient();
  const [mode, setMode] = useDarkMode();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isShowModal, setIsShowModal] = useState({
    visible: false,
  });

  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 425px)');

  //get calender list
  const calenderList = useQuery(
    '/system_setting/calender/',
    async () => {
      const result = await axiosInstance.get(`/system_setting/calender/`);
      return result.data;
    },
    { cacheTime: 86400000 },
  );

  //get theme list
  const themeList = useQuery(
    '/system_setting/theme/',
    async () => {
      const result = await axiosInstance.get(`/system_setting/theme/`);
      return result.data;
    },
    { cacheTime: 86400000 },
  );

  //get languages list
  const languageList = useQuery(
    '/system_setting/language/',
    async () => {
      const result = await axiosInstance.get(`/system_setting/language/`);
      return result.data;
    },
    { cacheTime: 86400000, refetchOnWindowFocus: false },
  );

  //get user information
  const userData = useGetUserInfo();

  const showModal = async () => {
    // props.setVisible(false);
    setIsShowModal({
      visible: true,
    });

    if (
      Boolean(userData?.data?.user_language?.symbol) &&
      Boolean(userData?.data?.user_calender?.id) &&
      Boolean(userData?.data?.user_theme?.id)
    ) {
      form.setFieldsValue({
        language: userData?.data?.user_language?.symbol,
        calendar: userData?.data?.user_calender?.id,
        theme: userData?.data?.user_theme?.id,
      });
    } else {
      const id = localStorage.getItem('user_id');
      setLoading(true);
      await axiosInstance
        .get(
          `/user_account/user_profile/${id}/?expand=*&fields=user_language,,user_calender,user_theme`,
        )
        .then((res) => {
          //
          setLoading(false);
          form.setFieldsValue({
            language: res?.data?.user_language?.symbol,
            calendar: res?.data?.user_calender?.id,
            theme: res?.data?.user_theme?.id,
          });
        })
        .catch((error) => {
          manageNetworkError(error);
          setLoading(false);
        });
    }
  };

  const onCancel = () => {
    setIsShowModal({
      visible: false,
    });
  };

  const handelChangeAdvanceSettings = async ({ value }: any) => {
    const id = localStorage.getItem('user_id');
    return await axiosInstance.patch(
      `/user_account/user_profile/${id}/`,
      value,
    );
  };

  const {
    mutate: mutateChangeAdvanceSettings,
    isLoading,
    reset,
  } = useMutation(handelChangeAdvanceSettings, {
    onSuccess: async (_: any, { value, prevValue }) => {
      setIsShowModal({
        visible: false,
      });

      if (prevValue?.language !== value?.user_language) {
        await i18n.changeLanguage(value.user_language);
        if (value?.user_language === 'en') {
          // moment.locale("en");
        } else {
          // moment.locale("fa");
        }
      }

      if (prevValue?.theme !== value?.user_theme) {
        setMode(value?.user_theme === 1 ? 'dark' : 'light');
        //@ts-ignore
        window.less.modifyVars(
          value?.user_theme === 1 ? lessVars.dark : lessVars.light,
        );
      }

      message.success(t('Profile.Advance_user_settings_message'));
      queryClient.invalidateQueries(`/user_account/user_profile/calender/`);
      queryClient.invalidateQueries(`/user_account/user_profile/`);
    },
    onError: (error) => {
      manageErrors(error);
    },
  });

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const value = {
        user_language: values.language,
        user_calender: values.calendar,
        user_theme: values.theme,
      };

      const prevValue = {
        language: userData?.data?.user_language?.symbol,
        calendar: userData?.data?.user_calender?.id,
        theme: userData?.data?.user_theme?.id,
      };

      mutateChangeAdvanceSettings({ value, prevValue });
    });
  };

  const handelAfterClose = () => {
    form.resetFields();
    reset();
  };

  return (
    <div>
      <div onClick={showModal}>{t('Profile.Advance_user_settings')}</div>
      <Modal
        maskClosable={false}
        title={t('Profile.Advance_user_settings')}
        destroyOnClose
        afterClose={handelAfterClose}
        centered
        open={isShowModal.visible}
        onCancel={onCancel}
        width={isMobile ? '100%' : isTablet ? 350 : 350}
        footer={
          <Space>
            <CancelButton onClick={onCancel} />
            <SaveButton onClick={handleOk} loading={isLoading} />
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            hideRequiredMark={true}
            scrollToFirstError={true}
            layout='vertical'
          >
            <Form.Item
              name='language'
              label={t('Profile.Language')}
              style={styles.formItem}
            >
              <Select>
                {languageList?.data?.results?.map(
                  (item: { symbol: number; name: string }) => (
                    <Option
                      label={item?.name}
                      value={item?.symbol}
                      key={item?.symbol}
                    >
                      {item?.name}
                    </Option>
                  ),
                )}
              </Select>
            </Form.Item>
            <Form.Item
              name='calendar'
              label={t('Profile.Calender')}
              style={styles.formItem}
            >
              <Select>
                {calenderList?.data?.results?.map(
                  (item: { id: number; name: string; code: string }) => (
                    <Option label={item?.name} value={item?.id} key={item?.id}>
                      {item?.name}
                    </Option>
                  ),
                )}
              </Select>
            </Form.Item>

            <Form.Item
              name='theme'
              label={t('Profile.Theme')}
              style={{ marginBottom: '0px' }}
            >
              <Select>
                {themeList?.data?.results?.map(
                  (item: { id: number; name: string; type: string }) => (
                    <Option label={item?.name} value={item?.id} key={item?.id}>
                      {item?.name}
                    </Option>
                  ),
                )}
              </Select>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}

//@ts-ignore
AdvanceUserSettings = React.memo(AdvanceUserSettings);
const styles = {
  formItem: { marginBottom: '10px' },
};

export default AdvanceUserSettings;
