import React from "react";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import Details from "./Details";
import { Row, Col } from "antd";
import { useMediaQuery } from "../MediaQurey";
const data = [
  {
    name: "Page A",
    uv: 4000,
  },
  {
    name: "Page B",
    uv: 3000,
  },
  {
    name: "Page C",
    uv: 2000,
  },
  {
    name: "Page D",
    uv: 2780,
  },
  {
    name: "Page E",
    uv: 1890,
  },
  {
    name: "Page F",
    uv: 2390,
  },
  {
    name: "Page G",
    uv: 2000,
  },
  {
    name: "Page B",
    uv: 3000,
  },
  {
    name: "Page C",
    uv: 2000,
  },
];

const Example = () => {
  // render() {
  const isMobileBased = useMediaQuery("(max-width: 425px)");
  return (
    <Row className="container-1" style={styles.chart(isMobileBased)}>
      <Col span={24}>
        <Details income="3600" week="40%" />
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
              <linearGradient id="colorUv" x1="0" y1="0" x2=".8" y2="1">
                <stop offset="5%" stopColor="#30D3B6" stopOpacity={1} />
                <stop offset="95%" stopColor="#30D3B6" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}

            <Tooltip />

            <Area
              type="monotone"
              dataKey="uv"
              stroke="rgb(28,196,169)"
              strokeWidth={2}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Col>
    </Row>
  );
};
// }

const styles = {
  chart: (isMobileBased) => ({
    width: "100%",
    height: isMobileBased ? 178 : 210,
  }),
};
export default Example;
