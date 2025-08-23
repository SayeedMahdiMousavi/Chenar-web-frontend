import { useContext, useState } from 'react';
import { Layout, Image, Space, Typography } from 'antd';
import Navlink from '../Router/Navlink';
import {
  SidebarCollapseContext,
  SidebarSetCollapseContext,
} from '../../context/CollapseSidebarProvider';
import { useMediaQuery } from '../MediaQurey';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../../Hooks/useDarkMode';
import { useGetCompanyInfo } from '../../Hooks';
import { DefaultLogo } from '../../components';
import { Colors } from '../colors';

const inEffect = `
@keyframes react-fade-in {
  0%   { opacity: 0; }
  20%  { opacity: 0; }
  40%  { opacity: 0; }
  60%  { opacity: 0.2; }
  80%  { opacity: 0.5; }
  80%  { opacity: 0.9; }
  100% { opacity: 1; }
}
`;

const outEffect = `
@keyframes react-fade-out {
  0%   { opacity: 0; }
  20%  { opacity: 0.2; }
  40%  { opacity: 0.4; }
  60%  { opacity: 0.6; }
  80%  { opacity: 0.8; }
  100% { opacity: 1; }
}
`;

const { Sider } = Layout;
export default function Sidebar() {
  const { i18n } = useTranslation();
  const [elipsis, setElipsis] = useState(false);
  const [mode] = useDarkMode();
  const collapsed = useContext(SidebarCollapseContext);
  const setCollapsed = useContext(SidebarSetCollapseContext);
  const isMobileBased = useMediaQuery('(max-width: 576px)');

  const { data } = useGetCompanyInfo();

  const onBreakpoint = (broken) => {
    if (broken) {
      setCollapsed(true);
    }
  };
  const handleChangeElipssis = (value) => {
    setElipsis(value);
  };
  return (
    <Sider
      breakpoint='lg'
      collapsedWidth={66}
      width={isMobileBased ? 0 : i18n?.language === 'en' ? 227 : 220}
      onBreakpoint={onBreakpoint}
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={
        mode === 'light'
          ? {
              backgroundColor: 'white',
              // borderInlineEnd: "1px solid #70707033",
              overflowY: 'auto',
              overflowX: 'hidden',
              height: '100vh',
              position: 'relative',
            }
          : {
              backgroundColor: Colors.primaryDarkBackground,
              overflowY: 'auto',
              height: '100vh',
              position: 'relative',
              overflowX: 'hidden',
            }
      }
    >
      <Space
        align='center'
        className='logo'
        style={collapsed ? { margin: '10px' } : {}}
        size={collapsed ? 0 : undefined}
      >
        {data?.logo ? (
          <Image
            width={data?.logo ? (collapsed ? 45 : 45) : 45}
            style={{ maxHeight: '60px', borderRadius: '5px' }}
            preview={false}
            src={data?.logo}
            fallback='data:image/png;base64,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'
          ></Image>
        ) : (
          <DefaultLogo />
        )}
        <Typography.Paragraph
          ellipsis={{
            rows: 2,
            tooltip: elipsis ? data?.fa_name : '',
            onEllipsis: handleChangeElipssis,
          }}
          style={{ marginBottom: '0px' }}
        >
          {collapsed ? '' : data?.fa_name}
        </Typography.Paragraph>
      </Space>

      <Navlink collapsed={collapsed} />
      <div style={{ height: '80px' }}></div>
      <style itemScope={collapsed ? outEffect : inEffect} />
      {/* <div
        style={{
          animationDuration: `${0.8}s`,
          animationIterationCount: 1,
          animationName: `react-fade-${collapsed ? "out" : "in"}`,
          animationTimingFunction: collapsed ? "ease-out" : "ease-in",
        }}
      >
        <SidebarUserList collapsed={collapsed} />
      </div> */}
    </Sider>
  );
}
