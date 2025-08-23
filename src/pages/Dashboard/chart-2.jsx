import React from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import Details from './Details';
import { useMediaQuery } from '../MediaQurey';
const data = [
  {
    name: 'Page A',
    uv: 4000,
  },
  {
    name: 'Page B',
    uv: 3000,
  },
  {
    name: 'Page C',
    uv: 2000,
  },
  {
    name: 'Page D',
    uv: 2780,
  },
  {
    name: 'Page E',
    uv: 1890,
  },
  {
    name: 'Page F',
    uv: 2290,
  },
  {
    name: 'Page G',
    uv: 2000,
  },
  {
    name: 'Page B',
    uv: 2500,
  },
  {
    name: 'Page C',
    uv: 1000,
  },
];

const Chart_2 = () => {
  // render() {
  const isMobileBased = useMediaQuery('(max-width: 425px)');
  return (
    <div className='container-1' style={styles.chart(isMobileBased)}>
      <Details income='1000' week='30%' />
      <ResponsiveContainer>
        <AreaChart
          // width={381}
          // height={210}
          data={data}
          margin={{
            top: 82,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id='colorone' x1='0' y1='0' x2='.8' y2='1'>
              <stop offset='5%' stopColor='#4388F5' stopOpacity={1} />
              <stop offset='95%' stopColor='#4388F5' stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}

          <Tooltip />

          <Area
            type='monotone'
            dataKey='uv'
            stroke='#4387F4'
            fill='url(#colorone)'
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
// }
const styles = {
  chart: (isMobileBased) => ({
    width: '100%',
    height: isMobileBased ? 178 : 210,
  }),
};
export default Chart_2;
