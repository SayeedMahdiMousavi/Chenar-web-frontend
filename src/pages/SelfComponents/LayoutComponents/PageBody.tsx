import React, { ReactNode } from "react";
import { Col, Row, Layout } from "antd";
//@ts-ignore
import { Detector } from "react-detect-offline";

interface IProps {
  children: ReactNode;
  navbar?: ReactNode;
}

const { Content } = Layout;
export default function PageBody(props: IProps) {
  return (
    <Detector
      render={({ online }: { online: boolean }) => {
        const minPageClass = online ? "min-page-body" : "min-page-body-offline";
        const maxPageClass = online ? "page-body" : "page-body-offline";
        return (
          <Layout>
            {props.navbar}

            <Content
              className={Boolean(props.navbar) ? minPageClass : maxPageClass}
            >
              {props.children}
            </Content>
          </Layout>
        );
      }}
    />
  );
}
