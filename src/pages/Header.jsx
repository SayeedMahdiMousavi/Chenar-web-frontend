import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SearchOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import axiosInstance from './ApiBaseUrl';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { useMediaQuery } from './MediaQurey';
import UserProfile from './Login/UserProfile';
import {
  Row,
  Col,
  Avatar,
  Popover,
  Dropdown,
  Button,
  Modal,
  Space,
  Select,
  message,
  AutoComplete,
} from 'antd';
import MobileNav from './Router/MobileNav';
import New from './New/New';
import Settings from './Settings/Settings'; // Keep the Settings import
import { Link, useNavigate } from 'react-router-dom';
import {
  SidebarCollapseContext,
  SidebarSetCollapseContext,
} from '../context/CollapseSidebarProvider';
import { useDarkMode } from '../Hooks/useDarkMode';
import { useGetUserInfo } from '../Hooks';
import { CenteredSpin } from './SelfComponents/Spin';
import { ExpandIcon, LogoutIcon } from '../icons';
import { AiOutlineNodeCollapse as CollapseIcon } from 'react-icons/ai';
import {
  checkPermissionsModel,
  handleClearLocalStorageLogout,
  manageErrors,
} from '../Functions';
import { lessVars } from '../theme/index';
import {
  BACKUP_PAGE_M,
  USERS_PAGE_M,
  AUDIT_CENTER_PAGE_M,
  COMPANY_INFO_M,
  CUSTOM_FORM_STYLE_M,
} from '../constants/permissions';
import { Colors } from './colors';
import { ThemeButton } from '../components';
import { createOption } from '../components/data/systemSearchData';

import AccountSettings from './Company/AccountAndSettings/AccountSettings';
import AdvanceUserSettings from './Login/AdvanceUserSettings';

export default function Header(props) {
  const queryClient = useQueryClient();
  const [mode, setMode] = useDarkMode();
  const collapsed = useContext(SidebarCollapseContext);
  const setCollapsed = useContext(SidebarSetCollapseContext);
  const history = useNavigate();
  const isMobile = useMediaQuery('(max-width: 425px)');
  const isTablet = useMediaQuery('(max-width: 767px)');
  const isMiniTablet = useMediaQuery('(max-width: 576px)');
  const [visible, setVisible] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const [permit, setPermit] = useState(' ');
  const permission = localStorage.getItem('user_permit');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    setPermit(permission ? permission : ' ');
  }, [permission]);

  // Get user information
  const { data } = useGetUserInfo();

  const handleClickCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const handleVisibleChange1 = (flag) => {
    setNewVisible(flag);
  };

  // Logout
  const handleLogout = async () => {
    setLoading(true);
    await axiosInstance
      .post('/user_account/tokens/blacklist/', {
        refresh_token: window.localStorage.getItem('refresh_token'),
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        return error;
      });
    if (mode !== 'light') {
      window.less.modifyVars(lessVars.light);
      setMode('light');
    }
    handleClearLocalStorageLogout();
    queryClient.clear();
    history('/');
  };

  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  // Handle modal OK (logout)
  const handleModalOk = () => {
    handleLogout();
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setLogoutModalVisible(false);
  };

  // Define Settings submenu items based on the Settings component
  const settingsMenuItems = [
    checkPermissionsModel(COMPANY_INFO_M) && {
      key: '3-1',
      label: <AccountSettings />,
      onClick: () => setVisible(false), // Close dropdown on click
    },
    {
      key: '3-2',
      label: <AdvanceUserSettings />,
      onClick: () => setVisible(false), // Close dropdown on click
    },
    checkPermissionsModel(AUDIT_CENTER_PAGE_M) && {
      key: '3-3',
      label: <Link to='/audit_center'>{t('Auditing.1')}</Link>,
      onClick: () => setVisible(false), // Close dropdown on click
    },
    checkPermissionsModel(CUSTOM_FORM_STYLE_M) && {
      key: '3-4',
      label: <Link to='/custom-form-styles'>{t('Custom_form_styles.1')}</Link>,
      onClick: () => setVisible(false), // Close dropdown on click
    },
  ].filter(Boolean); // Remove falsy values

  // Define menu items with Settings as a submenu
  const menuItems = [
    {
      key: '1',
      label: <UserProfile setVisible={setVisible} />,
    },
    {
      key: '3',
      label: t('Manage_users.Settings'),
      children: settingsMenuItems, // Add Settings submenu items
    },
    checkPermissionsModel(USERS_PAGE_M) && {
      key: '2',
      label: <Link to='/users'>{t('Manage_users.1')}</Link>,
    },
    checkPermissionsModel(BACKUP_PAGE_M) && {
      key: '4',
      label: <Link to='/backup'>{t('Company.Backup')}</Link>,
    },
    {
      key: '5',
      label: t('Manage_users.Sign_out'),
      icon: <LogoutIcon />,
      danger: true,
      onClick: showLogoutModal,
    },
  ].filter(Boolean); // Remove falsy values

  const bordered = mode === 'dark' ? true : false;
  const inputClassName = `Input__${mode}--borderLess`;

  // Get languages list
  const languageList = useQuery(
    '/system_setting/language/',
    async () => {
      const result = await axiosInstance.get(`/system_setting/language/`);
      return result.data;
    },
    { cacheTime: 86400000, refetchOnWindowFocus: false },
  );

  const filteredOptions = languageList?.data?.results?.filter(
    (item) => item?.symbol !== data?.user_language?.symbol,
  );

  const changeLanguage = async (value) => {
    await axiosInstance
      .patch(`/user_account/user_profile/${data?.username}/`, value)
      .then(async (res) => {
        await i18n.changeLanguage(value.user_language);
        if (value?.user_language === 'en') {
          // moment.locale("en");
        } else {
          // moment.locale("fa");
        }
        queryClient.invalidateQueries(`/user_account/user_profile/`);
        message.success({
          content: t('Message.Language'),
          rtl: true,
        });
      });
  };

  const { mutate: mutateLanguage, isLoading } = useMutation(changeLanguage);

  const handleChangeLanguage = async (value) => {
    mutateLanguage({ user_language: value?.value });
  };

  // Change theme
  const handleChangeTheme = async (value) => {
    return await axiosInstance.patch(
      `/user_account/user_profile/${data?.username}/`,
      value,
    );
  };

  const { mutate: mutateChangeTheme } = useMutation(handleChangeTheme, {
    onSuccess: (values) => {
      queryClient.invalidateQueries(`/user_account/user_profile/`);
    },
    onMutate: async (value) => {
      await queryClient.cancelQueries('/user_account/user_profile/');
      const previousValue = queryClient.getQueryData([
        '/user_account/user_profile/',
        { id: data?.username },
      ]);

      queryClient.setQueryData(
        [`/user_account/user_profile/`, { id: data?.username }],
        (prev) => {
          return {
            ...prev,
            user_theme: { ...prev?.user_theme, id: value?.user_theme },
          };
        },
      );

      setMode(value?.user_theme === 1 ? 'dark' : 'light');

      window.less.modifyVars(
        value?.user_theme === 1 ? lessVars.dark : lessVars.light,
      );

      return previousValue;
    },
    onError: (error) => {
      manageErrors(error);
      queryClient.invalidateQueries(`/user_account/user_profile/`);
    },
    onSettled: () => {
      queryClient.invalidateQueries(`/user_account/user_profile/`);
    },
  });

  const handleClickTheme = () => {
    mutateChangeTheme({ user_theme: data?.user_theme?.id === 2 ? 1 : 2 });
  };

  const handleSelectedFunction = (data) => {
    const filterData = createOption(t)?.filter((item) => {
      return item.options?.[0].value === data;
    });
    history(filterData?.[0]?.options?.[0]?.link);
  };

  return (
    <Row
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Col xl={'auto'} xs={isMobile ? 12 : 14}>
        <Space align='center' size='middle' style={styles.header}>
          {isMiniTablet ? (
            <MobileNav />
          ) : isTablet ? (
            ''
          ) : collapsed ? (
            t('Dir') === 'ltr' ? (
              <ExpandIcon
                onClick={handleClickCollapse}
                style={{ fontSize: 20 }}
              />
            ) : (
              <CollapseIcon
                onClick={handleClickCollapse}
                style={{ fontSize: 20 }}
              />
            )
          ) : t('Dir') === 'ltr' ? (
            <CollapseIcon
              onClick={handleClickCollapse}
              style={{ fontSize: 20 }}
            />
          ) : (
            <ExpandIcon onClick={handleClickCollapse} />
          )}
          <AutoComplete
            style={styles.search}
            options={createOption(t)}
            className={inputClassName}
            placeholder={t('Form.Search')}
            variant={bordered}
            onSelect={handleSelectedFunction}
            prefix={<SearchOutlined style={{ color: Colors.borderColor }} />}
            filterOption={(inputValue, option) => {
              if (option?.options?.length > 0) {
                return (
                  option?.options?.[0]?.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                );
              } else
                return (
                  option?.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                );
            }}
          />
        </Space>
      </Col>

      <Col xl={'auto'} xs={isMobile ? 12 : 10} style={styles.spaceParent}>
        <Row
          justify='space-between'
          style={{ width: 'fit-content' }}
          align='middle'
        >
          <Col style={{ margin: '0 10px' }}>
            <Select
              className={inputClassName}
              variant={bordered}
              popupMatchSelectWidth={false}
              loading={isLoading}
              onChange={handleChangeLanguage}
              notFoundContent={
                languageList?.isFetched || languageList?.isLoading ? (
                  <CenteredSpin size='small' />
                ) : undefined
              }
              labelInValue
              value={{
                value: data?.user_language?.symbol,
                label: data?.user_language?.name,
              }}
              style={styles.languageSelect}
            >
              {filteredOptions?.map((item) => (
                <Select.Option value={item?.symbol} key={item?.symbol}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col style={styles.iconCl}>
            <Popover
              content={<New />}
              trigger='click'
              open={newVisible}
              onOpenChange={handleVisibleChange1}
            >
              <Button
                type='primary'
                style={{ ...styles.plusButton }}
                icon={<PlusCircleOutlined style={{ fontSize: '20px' }} />}
              />
            </Popover>

            <ThemeButton onClick={handleClickTheme} />
          </Col>

          <Col>
            <Dropdown
              menu={{ items: menuItems }}
              trigger={'click'}
              onOpenChange={handleVisibleChange}
              open={visible}
              overlayStyle={styles.drop}
            >
              <Avatar
                src={`${data?.photo}`}
                size={{ xs: 35, sm: 32, md: 32, lg: 34, xl: 35, xxl: 37 }}
                className='header-img'
                style={styles.avatar}
                gap={10}
              >
                {data?.username?.[0]?.toUpperCase()}
                {data?.username?.[1]}
              </Avatar>
            </Dropdown>
          </Col>
          <Modal
            open={logoutModalVisible}
            title={
              <Space>
                <ExclamationCircleOutlined style={{ color: 'orange' }} />
                {t('Manage_users.Sign_out_message')}
              </Space>
            }
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            okText={t('Manage_users.Yes')}
            cancelText={t('Manage_users.No')}
            zIndex={2000}
            styles={{ direction: t('Dir') }}
            confirmLoading={loading}
          />
        </Row>
      </Col>
    </Row>
  );
}

const styles = {
  drop: { zIndex: 100 },
  spaceParent: {
    textAlign: 'end',
    paddingInlineEnd: '15px',
    justifyContent: 'end',
    display: 'flex',
  },
  iconCl: {
    display: 'flex',
    width: 'fit-content',
    gap: '15px',
    alignItems: 'center',
    margin: '0 10px 0 10px',
  },
  plusButton: {
    backgroundColor: Colors.primaryColor,
    color: Colors.white,
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { backgroundColor: Colors.primaryColor, verticalAlign: 'middle' },
  bellButton: { paddingBottom: '0px' },
  languageSelect: { borderRadius: '6px' },
  search: {
    width: '300px',
    borderRadius: '100px',
  },
  header: { marginInlineStart: '10px' },
  margin: { margin: '10px 0' },
};
