import React, { useState } from "react";
import { useQuery } from "react-query";
import axiosInstance from "../../ApiBaseUrl";
import EditCompanyInfo from "./Company/EditCompanyInfo";
import { useTranslation } from 'react-i18next';

export default function Company() {
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState(0);
   const { t } = useTranslation();

  const { data, status } = useQuery("/company/company_info/", async () => {
    const { data } = await axiosInstance
      .get(`/company/company_info/`)
      .then((res) => {
        setError(res.status);

        return res;
      });
    return data;
  },{
    refetchOnWindowFocus:false
  });

  const mobile = data?.mobile?.mobile_list?.map((item) => {
    return { mobile: item };
  });

  const socialMedia = data?.social_media?.social_media_list?.map((item) => {
    return item.fa_name;
  });

  const socialMediaList = [
    {
      value: t("Company.Telegram"),
    },
    {
      value: t("Company.Instagram"),
    },
    {
      value: t("Company.Facebook"),
    },
  ];
  return (
    <div>
      <EditCompanyInfo
        data={data}
        openForm={openForm}
        setOpenForm={setOpenForm}
        // setAddress={setAddress}
        error={error}
        setError={setError}
        status={status}
        // addressList={addressList}
        mobile={mobile}
        socialMediaList={socialMediaList}
        socialMedia={socialMedia}
      />

      {/* <EditCompanyType
        data={data}
        type={type}
        setName={setName}
        setAddress={setAddress}
        setInfo={setInfo}
        setType={setType}
      />

      <EditContactInfo
        data={data}
        info={info}
        setName={setName}
        setAddress={setAddress}
        setInfo={setInfo}
        setType={setType}
      /> */}

      {/* <EditCompanyAddress
        data={data}
        address={address}
        setAddress={setAddress}
        error={error}
        setError={setError}
        status={status}
      /> */}
      {/* 
      <Row
        className={
          theme?.data?.user_theme?.type === "dark"
            ? "account_setting_drawer_hover_dark account_setting_drawer_name"
            : "account_setting_drawer_hover account_setting_drawer_name"
        }
        gutter={10}
      >
        <Col xl={5} lg={7} sm={9} xs={11}>
          {" "}
          <Text strong={true}>{t("Company.Communications_with_intuit")}</Text>
        </Col>
        <Col xl={19} lg={17} sm={15} xs={13}>
          <a href="#">{t("Company.View_privacy_statement")}</a>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={styles.privacy}>
          <Text>
            {t("Form.Privacy")} | {t("Form.Security")}|{" "}
            {t("Form.Terms_of_service")}
          </Text>
        </Col>
      </Row> */}
    </div>
  );
}