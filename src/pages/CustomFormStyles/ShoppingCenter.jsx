import React, { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { SketchPicker } from "react-color";
// import ImgCrop from "antd-img-crop";
// import Print from "./SalesRecipe/Print";
// import Email from "./SalesRecipe/Email";
import {
  // Layout,
  Drawer,
  // Form,
  // Button,
  Col,
  Row,
  // Input,
  // Select,
  // Avatar,
  // Radio,
  // Popover,
  // Checkbox,
  // message,
  // Typography,
  // Space,
  // AutoComplete,
  // Divider,
  // Dropdown,
  // Collapse,
} from "antd";

import { connect } from "react-redux";
// import Design from "./SalesRecipe/Design";
// import {
//   BankTwoTone,
//   PlusCircleOutlined,
//   UploadOutlined,
//   LoadingOutlined,
//   PlusOutlined,
//   CaretRightOutlined,
// } from "@ant-design/icons";
// import Logos from "./SalesRecipe/Logos";
// import Content from "./SalesRecipe/Content";

// const { Panel } = Collapse;
// const { Option } = Select;
// const { Text, Title, Paragraph } = Typography;

const ShippingCenter = (props) => {
  // const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [current, setCurrent] = useState(0);
  // const [fileList, setFileList] = useState();
  // const [fileUrl, setFileUrl] = useState("");
  // const [disabled, setdisabled] = useState(true);
  //   const isTablitBased = useMediaQuery("(max-width: 576px)");
  //   const isMobileBased = useMediaQuery("(max-width: 320px)");
  //   const isMiddleMobile = useMediaQuery("(max-width: 375px)");
  const showDrawer = () => {
    setVisible(true);
  };
  // const normFile = (e) => {
  //   
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e && e.fileList;
  // };
  // //steps
  // const next = () => {
  //   const curren = current + 1;
  //   setCurrent(curren);
  // };

  // const prev = () => {
  //   const curren = current - 1;
  //   setCurrent(curren);
  // };

  const onClose = () => {
    setVisible(false);
  };
  const prop = {
    showUploadList: false,
    accept: ".csv,.xls,xlsx",
    action: "//jsonplaceholder.typicode.com/posts/",
    name: "file",

    previewFile(file) {
      

      // Your process logic. Here we just mock to the same file
      return fetch("https://next.json-generator.com/api/json/get/4ytyBoLK8", {
        method: "POST",
        body: file,
      })
        .then((res) => res.json())
        .then(({ thumbnail }) => thumbnail);
    },
    // fileList:{1},
    listType: "picture",
    // onChange(info) {
    //   setFileList(info.fileList.slice()); // Note: A new object must be used here!!!
    //   setLoading(true);
    //   if (info.file.status === "done") {
    //     message.success(`${info.file.name} file uploaded successfully`);
    //     setFileUrl(info.file.name);
    //     setLoading(false);
    //     setdisabled(false);
    //   } else if (info.file.status === "error") {
    //     message.error(`${info.file.name} file upload failed.`);
    //     setLoading(false);
    //     setdisabled(false);
    //   }
    // },
    // showUploadList: {
    //   showDownloadIcon: true,
    //   downloadIcon: <DownloadOutlined />,
    //   showRemoveIcon: true,
    // },
  };
  return (
    <div>
      {/* <Button type='primary' shape='round' > */}
      <span onClick={showDrawer}>Shopping center</span>
      {/* </Button> */}
      <Drawer
        maskClosable={false}
        mask={true}
        title="Shipping center"
        height="100%"
        onClose={onClose}
        open={visible}
        placement="top"
        bodyStyle={{ paddingBottom: 10 }}
        // footer={
        //   <div className='import__footer'>
        //     <div>
        //       <Button onClick={onClose} shape='round'>
        //         {t("Form.Cancel")}
        //       </Button>
        //     </div>
        //     <div>
        //       {current > 0 && (
        //         <Button
        //           style={{ margin: "0 8px" }}
        //           shape='round'
        //           onClick={() => prev()}
        //         >
        //           {t("Step.Previous")}
        //         </Button>
        //       )}
        //       {current < steps.length - 1 && (
        //         <Button type='primary' shape='round' onClick={() => next()}>
        //           {t("Step.Next")}
        //         </Button>
        //       )}
        //       {current === steps.length - 1 && (
        //         <Button
        //           type='primary'
        //           shape='round'
        //           onClick={() => message.success("Processing complete!")}
        //         >
        //           {t("Step.Done")}
        //         </Button>
        //       )}
        //     </div>
        //   </div>
        // }
      >
        <Row>
          <Col></Col>
        </Row>
      </Drawer>
    </div>
  );
};
// const styles = {
//   nav: (isMobileBased) => ({ height: isMobileBased ? "7vh" : "5vh" }),
//   upload: { marginTop: "4rem" },
// };
const mapStateToProps = (state) => {
  return {
    rtl: state.direction.rtl,
    ltr: state.direction.ltr,
  };
};

export default connect(mapStateToProps)(ShippingCenter);
