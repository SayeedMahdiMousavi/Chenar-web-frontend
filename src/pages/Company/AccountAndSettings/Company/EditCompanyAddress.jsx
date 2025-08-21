import React, { useState } from "react";
import { useMediaQuery } from "../../../MediaQurey";
import { useTranslation } from "react-i18next";
import { useQueryClient, useMutation } from "react-query";
import axiosInstance from "../../../ApiBaseUrl";
import {
  Skeleton,
  Form,
  Button,
  Col,
  Row,
  Input,
  message,
  Typography,
  Checkbox,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { CancelButton, SaveButton } from "../../../../components";

const { Text } = Typography;
export default function EditCompanyAddress(props) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isTablet = useMediaQuery("(max-width: 575px)");
  const isMobile = useMediaQuery("(max-width: 425px)");
  const [facingAddress, setFacingAddress] = useState(true);
  const [legalAddress, setLegalAddress] = useState(true);
  const addresses = {};

  props?.data?.company_address &&
    props.data.company_address.forEach((data) => {
      addresses[data.address_type] = data;
    });
  const onChangeFacingAddress = () => {
    setFacingAddress(!facingAddress);
  };
  const onChangeLegalAddress = () => {
    setLegalAddress(!legalAddress);
  };
  const onAddressClick = () => {
    props.setAddress(false);

    props.setAddress(true);
    form.setFieldsValue({
      address: addresses.company_address,
      facing: addresses.customer_address,
      legal: addresses.legal_address,
    });
  };
  const cancel = () => {
    props.setAddress(false);
  };
  const addCompanyAddress = async (value) => {
    await axiosInstance
      .post(`/company/company_address/`, value)
      .then((res) => {
        setLoading(false);
        props.setAddress(false);
        props.setError(0);
        message.success(`${t("Message.Add")} `);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const { mutate: mutateAddCompanyAddress } = useMutation(
    addCompanyAddress,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("/company/company_info/");
      },
    }
  );
  const editCompanyAddress = async (value) => {
    await axiosInstance
      .put("/company/company_address/company_address/", value)
      .then((res) => {
        // 
        setLoading(false);
        props.setError(0);
        props.setAddress(false);
        message.success(`${t("Message.Update")} `);
      })
      .catch((error) => {
        // 
        setLoading(false);
        message.error(`${t("Company.Smtp_add_error")}`);
      });
  };
  const { mutate: mutateEditCompanyAddress } = useMutation(
    editCompanyAddress,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("/company/company_info/");
      },
    }
  );
  const addCompanyFacingAddress = async (value) => {
    await axiosInstance
      .post(`/company/company_address/`, value)
      .then((res) => {
        setLoading(false);
        props.setAddress(false);
      })
      .catch(() => {
        setLoading(false);
        message.error(`${t("Company.Smtp_add_error")}`);
      });
  };
  const { mutate: mutateAddCompanyFacingAddress } = useMutation(
    addCompanyFacingAddress,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("/company/company_info/");
      },
    }
  );
  const editCompanyFacingAddress = async (value) => {
    await axiosInstance
      .put("/company/company_address/customer_address/", value)
      .then((res) => {
        setLoading(false);

        props.setAddress(false);
      })
      .catch((error) => {
        // 
        setLoading(false);
        message.error(`${t("Company.Smtp_add_error")}`);
      });
  };
  const addCompanyLegalAddress = async (value) => {
    await axiosInstance
      .post(`/company/company_address/`, value)
      .then((res) => {
        setLoading(false);
        props.setAddress(false);
      })
      .catch(() => {
        setLoading(false);

        message.error(`${t("Company.Smtp_add_error")}`);
      });
  };
  const { mutate: mutateAddCompanyLegalAddress } = useMutation(
    addCompanyLegalAddress,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("/company/company_info/");
      },
    }
  );
  const editCompanyLegalAddress = async (value) => {
    await axiosInstance
      .put("/company/company_address/legal_address/", value)
      .then((res) => {
        // 
        setLoading(false);

        props.setAddress(false);
      })
      .catch((error) => {
        
        setLoading(false);
        message.error(`${t("Company.Smtp_add_error")}`);
      });
  };
  const { mutate: mutateEditCompanyLegalAddress, isLoading } = useMutation(
    editCompanyLegalAddress,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("/company/company_info/");
      },
    }
  );
  const onFinish = async (values) => {
    // 
    if (props.error === 204) {
      message.error(`${t("Company.Address_error")}`);
      return;
    } else {
      if (!addresses.company_address) {
        setLoading(true);
        const allData = { ...values.address, address_type: "company_address" };
        mutateAddCompanyAddress(allData, {
          onSuccess: () => {},
        });
        const allData1 = { ...values.facing, address_type: "customer_address" };
        const allData2 = {
          ...values.address,
          address_type: "customer_address",
        };
        mutateAddCompanyFacingAddress(
          values.isFacing === true ? allData2 : allData1,
          {
            onSuccess: () => {},
          }
        );
        const allData3 = { ...values.legal, address_type: "legal_address" };
        const allData4 = { ...values.address, address_type: "legal_address" };
        mutateAddCompanyLegalAddress(
          values.isLegal === true ? allData4 : allData3,
          {
            onSuccess: () => {},
          }
        );

        return;
      } else {
        setLoading(true);
        const allData = { ...values.address, address_type: "company_address" };
        mutateEditCompanyAddress(allData, {
          onSuccess: () => {},
        });
        const allData1 = { ...values.facing, address_type: "customer_address" };
        const allData2 = {
          ...values.address,
          address_type: "customer_address",
        };
        await editCompanyFacingAddress(
          values.isFacing === true ? allData2 : allData1,
          {
            onSuccess: () => {},
          }
        );
        const allData3 = { ...values.legal, address_type: "legal_address" };
        const allData4 = { ...values.address, address_type: "legal_address" };
        mutateEditCompanyLegalAddress(
          values.isLegal === true ? allData4 : allData3,
          {
            onSuccess: () => {},
          }
        );
        return;
      }
    }
  };
  if (props.status === "loading") {
    return (
      <Row justify="space-around">
        <Col span={23} className="product_table_skeleton banner">
          <Skeleton
            loading={true}
            paragraph={{ rows: 7 }}
            title={false}
            active
          ></Skeleton>
        </Col>
      </Row>
    );
  }
  return (
    <div>
      {props.address ? (
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{ isLegal: true, isFacing: true }}
        >
          <Row className="account_setting_drawer_name" gutter={[5, 15]}>
            <Col lg={5} sm={6} xs={24} style={styles.title(isTablet)}>
              <Text strong={true}>{t("Form.Address")}</Text>
            </Col>
            <Col lg={7} sm={8} xs={isMobile ? 24 : 10}>
              <Text strong={true}>{t("Company.Company_address")}</Text>
              <br />
              <Text type="secondary">
                {t("Company.Company_address_description")}
              </Text>
            </Col>
            <Col lg={7} sm={10} xs={isMobile ? 24 : 14}>
              <Row gutter={[7, 7]}>
                <Col span={24}>
                  <Form.Item
                    name={["address", "city"]}
                    style={styles.margin}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: `${t("Company.Required_city")}`,
                      },
                    ]}
                  >
                    <Input placeholder={t("Form.City/Town")} />
                  </Form.Item>
                </Col>
                <Col span={14}>
                  <Form.Item
                    name={["address", "street"]}
                    style={styles.margin}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: `${t("Company.Required_full_address")}`,
                      },
                    ]}
                  >
                    <Input placeholder={t("Form.Full_address")} />
                  </Form.Item>
                </Col>
                {/* <Col span={10}>
                  <Form.Item name='state' style={styles.margin}>
                    <Input placeholder={"Form.State"} />
                  </Form.Item>
                </Col> */}
                <Col span={10}>
                  <Form.Item
                    name={["address", "zip"]}
                    style={styles.margin}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: `${t("Company.Required_zip")}`,
                      },
                    ]}
                  >
                    <Input placeholder={t("Form.Zip")} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col lg={5} sm={0} xs={0}></Col>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 0 : 10}>
              <Text strong={true}>{t("Company.Customer-facing_address")}</Text>
              <br />
              <Text type="secondary">
                {t("Company.Customer-facing_address_description")}
              </Text>
            </Col>
            <Col lg={7} sm={10} xs={isMobile ? 24 : 14}>
              <Col span={24}>
                <Form.Item
                  name="isFacing"
                  valuePropName="checked"
                  style={styles.margin}
                >
                  <Checkbox onChange={onChangeFacingAddress}>
                    {t("Company.Same_company_address")}
                  </Checkbox>
                </Form.Item>
              </Col>
              {!facingAddress && (
                <Row gutter={[7, 7]}>
                  <Col span={24}>
                    <Form.Item name={["facing", "city"]} style={styles.margin}>
                      <Input placeholder={t("Form.City/Town")} />
                    </Form.Item>
                  </Col>
                  <Col span={14}>
                    <Form.Item
                      name={["facing", "street"]}
                      style={styles.margin}
                    >
                      <Input placeholder={t("Form.Full_address")} />
                    </Form.Item>
                  </Col>
                  {/* <Col span={10}>
                    <Form.Item name='state' style={styles.margin}>
                      <Input placeholder={"Form.State"} />
                    </Form.Item>
                  </Col> */}
                  <Col span={10}>
                    <Form.Item name={["facing", "zip"]} style={styles.margin}>
                      <Input placeholder={t("Form.Zip")} />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Col>
            <Col lg={5} sm={0} xs={0}></Col>
            <Col lg={5} sm={6} xs={0}></Col>
            <Col lg={7} sm={8} xs={isMobile ? 24 : 10}>
              <Text strong={true}>{t("Company.Legal_address")}</Text>
              <br />
              <Text type="secondary">
                {t("Company.Legal_address_description")}
              </Text>
            </Col>
            <Col lg={7} sm={10} xs={isMobile ? 24 : 14}>
              <Col span={24}>
                <Form.Item
                  name="isLegal"
                  valuePropName="checked"
                  style={styles.margin}
                >
                  <Checkbox onChange={onChangeLegalAddress}>
                    {t("Company.Same_company_address")}
                  </Checkbox>
                </Form.Item>
              </Col>
              {!legalAddress && (
                <Row gutter={[7, 7]}>
                  <Col span={24}>
                    <Form.Item name={["legal", "city"]} style={styles.margin}>
                      <Input placeholder={t("Form.City/Town")} />
                    </Form.Item>
                  </Col>
                  {/* <Col span={10}>
                  <Form.Item name='state' style={styles.margin}>
                    <Input placeholder={"Form.State"} />
                  </Form.Item>
                </Col> */}
                  <Col span={14}>
                    <Form.Item name={["legal", "street"]} style={styles.margin}>
                      <Input placeholder={t("Form.Full_address")} />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item name={["legal", "zip"]} style={styles.margin}>
                      <Input placeholder={t("Form.Zip")} />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Col>
            <Col lg={12} sm={14} xs={isMobile ? 0 : 10}></Col>
            <Col lg={12} sm={10} xs={isMobile ? 24 : 14}>
              <CancelButton onClick={cancel} />
              <SaveButton htmlType="submit" loading={loading} />
            </Col>
          </Row>
        </Form>
      ) : (
        <Row
          className="account_setting_drawer_hover line_height account_setting_drawer_name"
          onClick={onAddressClick}
        >
          <Col lg={5} sm={6} xs={24}>
            <Text strong={true}>{t("Form.Address")}</Text>
          </Col>
          <Col lg={7} sm={8} xs={10}>
            <Text>{t("Company.Company_address")}</Text>
            <br />
            <Text> {t("Company.Customer-facing_address")}</Text>
            <br />
            <Text> {t("Company.Legal_address")}</Text>
          </Col>
          <Col lg={12} sm={10} xs={14}>
            <Row justify="space-between">
              <Col>
                <Text>
                  {addresses?.company_address?.city}
                  {addresses?.company_address?.street && "/"}
                  {addresses?.company_address?.street}
                  {addresses?.company_address?.zip && "/"}
                  {addresses?.company_address?.zip}
                </Text>
                <br />
                {addresses?.company_address === addresses?.customer_address ? (
                  <Text> {t("Company.Same_company_address")}</Text>
                ) : (
                  <Text>
                    {addresses?.customer_address?.city}
                    {addresses?.customer_address?.street && "/"}
                    {addresses?.customer_address?.street}
                    {addresses?.customer_address?.zip && "/"}
                    {addresses?.customer_address?.zip}
                  </Text>
                )}
                <br />
                {addresses?.company_address === addresses?.legal_address ? (
                  <Text> {t("Company.Same_company_address")}</Text>
                ) : (
                  <Text>
                    {addresses?.legal_address?.city}
                    {addresses?.legal_address?.street && "/"}
                    {addresses?.legal_address?.street}
                    {addresses?.legal_address?.zip && "/"}
                    {addresses?.legal_address?.zip}
                  </Text>
                )}
              </Col>
              <Col>
                <EditOutlined className="font" />
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
}
const styles = {
  margin: { margin: "0rem" },
  cancel: { margin: "10px 10px" },
  title: (isTablet) => ({
    textAlign: isTablet ? "center" : "",
    padding: isTablet ? "23px 0px 23px 0px" : "",
  }),
};
