import React from "react";
import { Row, Col, Select, Form, Button } from "antd";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../ApiBaseUrl";
import { CenteredSpin } from "../../SelfComponents/Spin";
import { useQuery } from "react-query";
import { ApplyButton, ResetButton } from "../../../components";

interface IProps {
  setVisible: (value: boolean) => void;
  setFilters: (value: any) => void;
  setPage: (value: number) => void;
}

const getContentTypeList = async ({ queryKey }: any) => {
  const [_key] = queryKey;
  const res = await axiosInstance.get(`${_key}`);

  return res?.data;
};

export default function CrudAuditingFilters(props: IProps) {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();

  const language = i18n?.language;

  const { data, isLoading, isFetching } = useQuery(
    ["/auditing/crud/content_type_list/"],
    getContentTypeList
  );

  const onFinish = async (values: any) => {
    props.setFilters({ contentType: values?.contentType ?? "" });
    props.setVisible(false);
    props.setPage(1);
  };
  const onReset = () => {
    form.resetFields();
    props.setFilters({ contentType: "" });
    props.setPage(1);
    props.setVisible(false);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form} style={styles.form}>
      <Row gutter={[0, 10]}>
        <Col span={24}>
          <Form.Item
            name="contentType"
            label={t("Auditing.Content_type")}
            style={styles.margin}
          >
            <Select
              className="num margin"
              showSearch
              showArrow
              allowClear
              optionFilterProp="label"
              optionLabelProp="label"
              notFoundContent={
                isFetching || isLoading ? (
                  <CenteredSpin size="small" style={styles.spin} />
                ) : undefined
              }
              dropdownRender={(menu) => <div>{menu}</div>}
            >
              {data &&
                data?.map((item: any) => (
                  <Select.Option
                    key={item?.id}
                    value={item?.id}
                    label={language === "en" ? item.model : item?.model_fa}
                  >
                    {language === "en" ? item.model : item?.model_fa}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item style={styles.margin}>
            <Row className="num" justify="space-between">
              <Col>
                <ResetButton htmlType="reset" onClick={onReset} />
              </Col>
              <Col>
                <ApplyButton />
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
const styles = {
  margin: { marginBottom: "8px" },
  form: { width: "230px" },
  spin: { margin: "20px" },
};
