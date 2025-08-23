import { Spin } from 'antd';
import React, { useState } from 'react';
import { connect } from 'react-redux';

// import { useMutation, useQueryClient, useQuery } from "react-query";
// import axiosInstance from "../ApiBaseUrl";
import { Redirect, Route } from 'react-router-dom';
const PrivateRouteContent = React.lazy(() => import('./PrivateRouteContent'));
// import {
//   Layout,
//   Row,
//   Col,
//   ConfigProvider,
//   Menu,
//   Dropdown,
//   Button,
//   message,
//   Space,
//   Alert,
// } from "antd";
// import Heade from "../Header";
// import { useTranslation } from "react-i18next";
// import { Detector } from "react-detect-offline";
// import jalaliday from "jalaliday";
// import dayjs from "dayjs";
// import { CalendarOutlined, GifOutlined } from "@ant-design/icons";
// import { dark } from "../../vars";
// import enUS from "antd/lib/locale/en_US";
// import fa_IR from "antd/lib/locale/fa_IR";
// import moment from "moment";
// import "moment/locale/fa";
// import Sidebar from "./Sidebar";
// import { useDarkMode } from "../../Hooks/useDarkMode";
// dayjs.extend(jalaliday);
// dayjs.calendar("jalali");
// moment.locale("en");
// const { Header, Content } = Layout;
export const PrivateRoute = ({ component: Component, ltr, ...rest }) => {
  const [token, setToken] = useState(() =>
    window.localStorage.getItem('refresh_token'),
  );
  // const [mode, setMode] = useDarkMode();
  // const { t, i18n } = useTranslation();
  // // const [collapsed, setCollapsed] = useState(false);

  // // const [visible, setVisible] = useState(false);
  // // const [userTheme, setUserTheme] = useState(2);
  // // const [width, setWidth] = useState(80);
  // // const [login, setLogin] = useState(true);
  // // const [book, setBook] = useState("lg");
  // // const isTabletBased = useMediaQuery("(max-width: 768px)");
  // // const isMobileBased = useMediaQuery("(max-width: 576px)");
  // // const [loading, setLoading] = useState(true);
  // // const [permit, setPermit] = useState(
  // //   JSON.parse(localStorage.getItem("user_permit"))
  // // );
  // // const permit = {};
  // // permission &&
  // //   permission.forEach((data) => {
  // //     permit[data.codename] = data;
  // //   });
  // // const url = permission?.data?.user_permit?.[0]?.codename.toLowerCase();

  // // const toggle = (type) => {
  // //   setCollapsed(!collapsed);
  // // };
  // // const onBreakpoint = (broken) => {
  // //   if (broken) {
  // //     setCollapsed(true);
  // //   }
  // // };
  // //

  // const id = localStorage.getItem("user_id");
  // // React.useEffect(() => {
  // //   (async () => {
  // //     const { data } = await axiosInstance.get(
  // //       `/user_account/users/${id}/user_profile/?fields=user_theme&expand=*`
  // //     );

  // //     setUserTheme(data?.user_theme?.id);
  // //   })();
  // // }, [id, setUserTheme]);

  // const { data, refetch } = useQuery(
  //   "/user_account/user_profile/theme/calender/",
  //   async () => {
  //     const result = await axiosInstance.get(
  //       `/user_account/users/${id}/user_profile/?expand=*`
  //     );
  //     return result.data;
  //   },
  //   { enabled: false, cacheTime: 86400000 }
  // );
  // //

  // const changeTheme = async (value) => {
  //   await axiosInstance
  //     .patch(`/user_account/users/${id}/user_profile/`, value)
  //     .then(async (res) => {
  //       //
  //       refetch();
  //       // setUserTheme(value.user_theme.toString());
  //       // message.success("Successfully change theme");
  //       setMode(value?.user_theme === "1" ? "dark" : "light");
  //       window.less.modifyVars(value?.user_theme === "1" ? dark : {});
  //       // if (value?.user_theme === "1") {
  //       //   window.less.modifyVars(dark);
  //       // } else if (value?.user_theme === "2") {
  //       //   window.less
  //       //     .modifyVars({})
  //       //     .then(() => {
  //       //       // message.success(`Theme updated successfully`);
  //       //       // this.setState({ vars });
  //       //       // localStorage.setItem("app-theme", JSON.stringify(initialValue));
  //       //     })
  //       //     .catch((error) => {
  //       //       // message.error(error);
  //       //     });
  //       // }
  //       // message.success({
  //       //   content: `${t("Message.Language")}`,
  //       //   rtl: true,
  //       // });
  //     })
  //     .catch((error) => {
  //       // message.error(error?.response?.data?.message);
  //
  //     });
  // };

  // const { mutate: mutateChangeTheme,isLoading} = useMutation(changeTheme, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(
  //       `/user_account/user_profile/theme/calender/`
  //     );
  //     queryClient.invalidateQueries(`/user_account/user_profile/theme/`);
  //     queryClient.invalidateQueries(`/user_account/user_profile/`);
  //   },
  // });

  // const onChangeTheme = async ({ item, key }) => {
  //   if (data?.user_theme?.id === parseInt(key)) {
  //   } else {
  //     mutateChangeTheme({ user_theme: key });
  //   }
  // };

  // const handleChangeCalender = async (value) => {
  //   await axiosInstance
  //     .patch(
  //       `/user_account/users/${id}/user_profile/?expand=user_calender`,
  //       value
  //     )
  //     .then(async (res) => {
  //       refetch();
  //     })
  //     .catch((error) => {
  //       // message.error(error?.response?.data?.message);
  //       //
  //     });
  // };

  // const { mutate: mutateChangeCalender,isLoading} = useMutation(handleChangeCalender, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(`/user_account/user_profile/calender/`);
  //     queryClient.invalidateQueries(
  //       `/user_account/user_profile/theme/calender/`
  //     );
  //     queryClient.invalidateQueries(`/user_account/user_profile/`);
  //   },
  // });

  // const onChangeCalender = async ({ item, key }) => {
  //   if (data?.user_calender?.id === parseInt(key)) {
  //   } else {
  //     mutateChangeCalender({ user_calender: key });
  //   }
  // };
  // // const onOpenChange = (flag) => {
  // //   setVisible(flag);
  // // };
  // const getTheme = useQuery(
  //   "/system_setting/theme/",
  //   async () => {
  //     const result = await axiosInstance.get(`/system_setting/theme/`);

  //     return result.data;
  //   },
  //   { enabled: false, cacheTime: 86400000 }
  // );

  // const getCalenders = useQuery(
  //   "/system_setting/calender/",
  //   async () => {
  //     const result = await axiosInstance.get(`/system_setting/calender/`);
  //     return result.data;
  //   },
  //   { enabled: false, cacheTime: 86400000 }
  // );

  // const themRefetch = getTheme.refetch;
  // const calenderRefetch = getCalenders.refetch;
  // React.useEffect(() => {
  //   themRefetch();
  //   refetch();
  //   calenderRefetch();
  // }, [calenderRefetch, themRefetch, refetch]);

  // const action = (
  //   <Menu
  //     onClick={onChangeTheme}
  //     selectedKeys={[`${data?.user_theme?.id}`]}
  //     selectable
  //     // theme={"l"}
  //     style={{ width: "130px" }}
  //   >
  //     {getTheme?.data?.results?.map((item) => (
  //       <Menu.Item key={item?.id}>{item?.name}</Menu.Item>
  //     ))}
  //   </Menu>
  // );

  // const calenders = (
  //   <Menu
  //     onClick={onChangeCalender}
  //     selectedKeys={[`${data?.user_calender?.id}`]}
  //     selectable
  //     // theme={"l"}
  //     style={{ width: "130px" }}
  //   >
  //     {getCalenders?.data?.results?.map((item) => (
  //       <Menu.Item key={item?.id}>{item?.name}</Menu.Item>
  //     ))}
  //   </Menu>
  // );

  return (
    <Route
      // saveScrollPosition={true}
      // unmount={false}
      {...rest}
      component={(props) => (
        // props.rtl ? (
        //   <div className='spin'>
        //     <Spin size='large' />
        //   </div>
        // ) :
        <React.Suspense
          fallback={
            <div className='spin'>
              <Spin size='large' />
            </div>
          }
        >
          {token ? (
            <PrivateRouteContent component={<Component {...props} />} />
          ) : (
            // <ConfigProvider
            //   direction={i18n.language === "en" ? "ltr" : "rtl"}
            //   locale={i18n.language === "en" ? enUS : fa_IR}
            // >
            //   <Detector
            //     render={({ online }) => (
            //       <Row>
            //         <Col span={24}>
            //           {/* {window.navigator.online ? (
            //       <div>njk</div>
            //     ) : ( */}
            //           <div style={{ width: "100%" }}>
            //             {online ? null : (
            //               <Alert
            //                 type="error"
            //                 message={
            //                   <span className="internet_error">
            //                     {t("Internet.No_internet_message")}
            //                   </span>
            //                 }
            //                 // banner
            //                 style={{
            //                   width: "100%",
            //                   height: "30px",
            //                   fontSize: "11px",
            //                   fontWeight: "bold",
            //                 }}
            //                 banner
            //               />
            //             )}
            //           </div>

            //           <Layout
            //             hasSider={true}
            //             style={!online ? styles.offlineStyle : styles.layout}
            //           >
            //             <Sidebar />
            //             {/* <Sider
            //               breakpoint="lg"
            //               collapsedWidth={isMobileBased ? 0 : 80}
            //               width={205}
            //               onBreakpoint={onBreakpoint}
            //               trigger={null}
            //               collapsible
            //               collapsed={collapsed}
            //               style={styles.sider}
            //             >
            //               <Navlink toggle={collapsed} />
            //             </Sider> */}
            //             <Layout style={styles.layout1}>
            //               <Header
            //                 style={
            //                   mode === "dark"
            //                     ? { padding: "0 15px" }
            //                     : styles.header
            //                 }
            //                 // className='dashboard_header'
            //                 className="site-layout-background"
            //               >
            //                 <Heade
            //                 // toggle={toggle}
            //                 // md={isTabletBased}
            //                 // sm={isMobileBased}
            //                 // collapsed={collapsed}
            //                 />
            //               </Header>
            //               <Content>
            //                 {/* <PrivateComponent
            //                   // props={props}
            //                   Component={<Component {...props} />}
            //                   collapsed={collapsed}
            //                 /> */}
            //                 <Component {...props} />
            //                 <Space
            //                   style={
            //                     i18n.language === "en"
            //                       ? styles.themeIcon1
            //                       : styles.themeIcon
            //                   }
            //                   size={15}
            //                 >
            //                   <Dropdown
            //                     overlay={action}
            //                     // open={visible}
            //                     // onOpenChange={onOpenChange}
            //                     overlayClassName="Router-Container__language"
            //                     trigger={["click"]}
            //                     // onClick={() => {
            //                     //   getTheme.refetch();
            //                     //   refetch();
            //                     // }}
            //                   >
            //                     <a
            //                       className="ant-dropdown-link"
            //                       onClick={(e) => e.preventDefault()}
            //                     >
            //                       <Button
            //                         icon={<GifOutlined />}
            //                         alt="theme log"
            //                         shape="circle"
            //                         type="primary"
            //                         size="large"
            //                         style={{ zIndex: 500 }}
            //                       ></Button>
            //                     </a>
            //                   </Dropdown>
            //                   <Dropdown
            //                     overlay={calenders}
            //                     // open={visible}
            //                     // onOpenChange={onOpenChange}
            //                     overlayClassName="Router-Container__language"
            //                     trigger={["click"]}
            //                     // onClick={() => {
            //                     //   getTheme.refetch();
            //                     //   refetch();
            //                     // }}
            //                   >
            //                     <a
            //                       className="ant-dropdown-link"
            //                       onClick={(e) => e.preventDefault()}
            //                     >
            //                       <Button
            //                         icon={<CalendarOutlined />}
            //                         alt="calender log"
            //                         shape="circle"
            //                         type="primary"
            //                         size="large"
            //                         style={{ zIndex: 500 }}
            //                       ></Button>
            //                     </a>
            //                   </Dropdown>
            //                 </Space>
            //               </Content>
            //             </Layout>
            //           </Layout>

            //           {/* )} */}
            //         </Col>
            //       </Row>
            //     )}
            //   />
            // </ConfigProvider>
            <Redirect to='/' />
          )}
        </React.Suspense>
      )}
    />
  );
};
const styles = {
  // layout: { height: `calc(100vh - 30px)`, overflow: "hidden" },
  offlineStyle: { height: `calc(100vh - 30px)`, overflow: 'hidden' },
  layout: { height: `100vh`, overflow: 'hidden' },
  layout1: { overflow: 'hidden' },
  sider: {
    // boxShadow: "2px 2px 2px rgba(1 10, 110, 110, 0.452)",
  },

  header: {
    padding: '0 15px',
    background: '#fff',
    // height: "10vh",
  },
  themeIcon: {
    position: 'absolute',
    left: '30px',
    bottom: '30px',
  },
  themeIcon1: {
    position: 'absolute',
    right: '30px',
    bottom: '30px',
  },
};
const mapStateToProps = (state) => {
  return {
    rtl: state.direction.rtl,
    ltr: state.direction.ltr,
  };
};

export default connect(mapStateToProps)(PrivateRoute);
