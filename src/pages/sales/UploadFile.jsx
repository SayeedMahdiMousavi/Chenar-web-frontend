import React from "react";
import { Upload, message } from "antd";
import { useTranslation } from "react-i18next";

const Upload1 = (props) => {
  const { t } = useTranslation();

  const prop = {
    onRemove: (file) => {
      props.setError(false);
      props.setFile({});
    },
    maxCount: 1,
    fileList: props?.fileList,
    beforeUpload: (file) => {
      if (props?.fileList?.length > 1) {
        message.error(`${t("Upload.One_file_upload")}`);
        return;
      } else {
        props.setFileList([file]);
        const isLt2M = file.size / 1024 / 1024 < 3;
        if (!isLt2M) {
          props.setError(true);
          return;
        } else {
          props.setError(false);
        }
        props.setFile(file);
      }

      return false;
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <div className="clearfix">
      <Upload.Dragger name="file" {...prop} onChange={props.onChange}>
        <p className="ant-upload-text" style={{ padding: "0px 10px" }}>
          {props.name}
        </p>
      </Upload.Dragger>
    </div>
  );
};

export default Upload1;
