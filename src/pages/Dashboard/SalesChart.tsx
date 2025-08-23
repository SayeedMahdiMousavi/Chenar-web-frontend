import React from 'react';
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

// import { useMediaQuery } from "../MediaQurey";
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../../Hooks/useDarkMode';
import { Colors } from '../colors';
import { theme } from 'antd';


const data = [
  {
    date: 'Page A',
    total: 0,
  },
  {
    date: 'Page B',
    total: 0,
  },
  {
    date: 'Page C',
    total: 0,
  },
  {
    date: 'Page D',
    total: 0,
  },
  {
    date: 'Page E',
    total: 0,
  },
  {
    date: 'Page F',
    total: 0,
  },
  {
    date: 'Page G',
    total: 0,
  },
  {
    date: 'Page H',
    total: 0,
  },
  {
    date: 'Page I',
    total: 0,
  },
  {
    date: 'Page J',
    total: 0,
  },
];

const SalesChart = (props: any) => {
  const { i18n, t } = useTranslation();
  const [mode] = useDarkMode();

  const { token } = theme.useToken();
  // const isMobileBased = useMediaQuery("(max-width: 425px)");
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'grid',
        color: mode === 'dark' ? Colors.white : 'black',
      }}
    >
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <AreaChart
          data={props?.data}
          style={{ direction: t('Dir'), color: mode === 'dark' ? Colors.white : 'black', }}
          // data={data}
          margin={{
            top: 82,
            right: t('Dir') === 'rtl' ? 0 : 15,
            left: t('Dir') === 'rtl' ? 15 : 0,
            bottom: 0,
          }}
          // stackOffset='sign'
        >
          {/* // <div className="container-1" style={styles.chart(isMobileBased)}> */}
          <defs>
            <linearGradient id='color' x1='0' y1='0' x2='.8' y2='1'>
              <stop offset='5%' stopColor={token.colorPrimary} stopOpacity={0.6} />
              <stop offset='95%' stopColor={token.colorPrimary} stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray='4 1 2' vertical={false} />

          <Tooltip payload={[{ name: '05-01', value: 12, unit: 'kg' }]} />
          <XAxis
            dataKey='date'
            tickLine={false}
            axisLine={false}
            reversed={t('Dir') === 'rtl' ? true : false}
            tick={{ fill: mode === 'dark' ? Colors.white : 'black' }}
          />
          <YAxis
            unit='AFN'
            orientation={t('Dir') === 'rtl' ? 'right' : 'left'}
            width={i18n?.language === 'en' ? 75 : 70}
            tickCount={6}
            //@ts-ignore
            tickMargin={i18n?.language === 'en' ? 17 : 56}
            tickLine={false}
            axisLine={false}
            tick={{ fill: mode === 'dark' ? Colors.white : 'black' }}
          />
          <Area
            type='monotone'
            dataKey='total'
            stroke={token.colorPrimary}
            fill='url(#color)'
            strokeWidth={2}
            unit='AFN'
            name='Total'
            isAnimationActive={true}
            fillOpacity={1}
            
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
