import React from "react";
// import Heade1 from "../Header";
import { Layout, Button } from "antd";
import AddCompany from "../Company/Addcompany";
const { Content } = Layout;

export default function Apps() {
  return (
    <Layout>
      {/* <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          padding: "0 0px"
          // background: "white"
        }}
        className='dashboard-header'
      >
        <Heade1 title='' />
      </Header> */}
      <Content>
        <Button>
          <AddCompany />
        </Button>
      </Content>
    </Layout>
  );
}
