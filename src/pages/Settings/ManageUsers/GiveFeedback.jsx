import React, { useState } from "react";
import {
  Popover,
  Button,
  Form,
  Input,
  Row,
  Col,
  Typography,
  Upload,
  message,
} from "antd";
import { CameraOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import { useMediaQuery } from "../../MediaQurey";
import { useTranslation } from "react-i18next";
const { Title,   } = Typography;
const GiveFeedback = () => {
  const isMobile = useMediaQuery("(max-width:435px)");
  const [fileList, setFileList] = useState();
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const onClickCamera = () => [setVisible(false)];
  const onClickFeedback = () => {
    setVisible(true);
  };
  const printPDF = () => {
    const domElement = document.getElementById("root");
    html2canvas(domElement, {
      onclone: (document) => {
        document.getElementById("print");
      },
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPdf();
      pdf.addImage(imgData, "JPEG", 10, 10);
      pdf.save(`${new Date().toISOString()}.pdf`);
    });
  };
  //upload
  const prop = {
    showUploadList: false,
    // accept: ".png,.xls",
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
    onChange(info) {
      setFileList(info.fileList.slice()); // Note: A new object must be used here!!!
      setLoading(true);
      if (info.file.status === "done") {
        setStatus("done");
        message.success(`${info.file.name} file uploaded successfully`);
        setFileUrl(info.file.name);
        setLoading(false);
        setVisible(true);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
        setVisible(true);
        setLoading(false);
      }
    },
    // showUploadList: {
    //   showDownloadIcon: true,
    //   downloadIcon: <DownloadOutlined />,
    //   showRemoveIcon: true,
    // },
  };
  const content = (
    <Form className='feedback_form' style={styles.form(visible)} id='print'>
      {visible ? (
        <div>
          <Form.Item name='feedback' style={styles.margin}>
            <Input.TextArea
              className='give_feedback'
              style={{ height: "10rem" }}
              autoSize={{ minRows: 7, maxRows: 7 }}
              placeholder={`${t(
                "Manage_users.Feedback_text_area_placeholder"
              )}`}
            />
          </Form.Item>
          <Row align='middle' style={styles.attach}>
            <Col
              span={23}
              offset={1}
              className='attach_file'
              onClick={onClickCamera}
            >
              {status === "done" ? (
                <span>{fileUrl}</span>
              ) : (
                <span>
                  <CameraOutlined />
                  <p className='attach_p'>
                    {t("Manage_users.Attach_screenshot_file")}
                  </p>
                </span>
              )}
            </Col>
          </Row>
          <Row justify='end'>
            <Col>
              {" "}
              <Button type='primary' shape='round' className='feedback_next'>
                {t("Step.Next")}
              </Button>
            </Col>
          </Row>
        </div>
      ) : (
        <Row justify='space-around' gutter={[0, 10]}>
          <Col style={{ textAlign: "center" }} span={22}>
            <Title level={4}> {t("Manage_users.Attach_file")}</Title>
          </Col>
          <Col span={22}>
            <Button shape='round' onClick={printPDF} className='num'>
              {t("Manage_users.Snap_screenshot")}
            </Button>
          </Col>
          <Col span={22}>
            <Upload {...prop} className='num'>
              <Button shape='round' className='num' loading={loading}>
                {t("Manage_users.Choose_file")}
              </Button>
            </Upload>
          </Col>
          <Col span={22}>
            <Button
              shape='round'
              className='num feedback_cancel'
              onClick={onClickFeedback}
            >
              {t("Form.Cancel")}
            </Button>
          </Col>
        </Row>
      )}
    </Form>
  );
  // const screenshot = () => {
  //   html2canvas(document.body).then(function (canvas) {
  //     document.body.appendChild(canvas);
  //   });
  //   
  // };
  return (
    <div>
      <Popover
        placement={isMobile ? "topLeft" : "leftTop"}
        title={visible ? `${t("Manage_users.Feedback_title")}` : ""}
        content={content}
        trigger='click'
      >
        <Button shape='round' className='num' onClick={onClickFeedback}>
          {t("Manage_users.Feedback_button")}
        </Button>
      </Popover>
    </div>
  );
};
const styles = {
  margin: { marginBottom: "0rem" },
  attach: { height: "30px" },
  form: (visible) => ({ padding: "16px" }),
};
export default GiveFeedback;
