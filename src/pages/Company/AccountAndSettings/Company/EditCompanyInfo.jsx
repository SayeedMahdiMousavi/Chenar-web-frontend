import React, { useState } from 'react';
import { useMediaQuery } from '../../../MediaQurey';
import { useQueryClient, useMutation } from 'react-query';
import axiosInstance from '../../../ApiBaseUrl';
import { Colors } from '../../../colors';
import { Skeleton, Form, App, Row, Col } from 'antd';
import { addMessage, manageErrors, updateMessage } from '../../../../Functions';
import CompanyInfo from './CompanyInfo';
import EditCompanyForm from './EditCompanyForm';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function EditCompanyInfo(props) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const isTablet = useMediaQuery('(max-width: 575px)');
  const isMobile = useMediaQuery('(max-width: 425px)');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [file, setFile] = useState();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const onClickName = () => {
    props.setOpenForm(true);
    setFileList(
      props.data?.logo
        ? [
            {
              status: 'done',
              uid: '-1',
              url: `${props.data?.logo}`,
            },
          ]
        : [],
    );

    form.setFieldsValue({
      name: props?.data?.fa_name,
      type: props.data?.type,
      email: props.data?.email,
      phone: props?.data?.mobile?.phone,
      website: props?.data?.website,
      businessIdNo: props?.data?.business_number,
      mobiles: props?.mobile,
      addresses: props?.data?.address?.address_list,
      socialMedia: props?.data?.social_media?.social_media_list,
      slogan: props?.data?.slogan,
      upload: props.data?.logo
        ? [
            {
              status: 'done',
              uid: '-1',
              url: `${props.data?.logo}`,
            },
          ]
        : [],
    });
  };

  const addCompanyInfo = async (value) => {
    console.log('value of form', value);

    await axiosInstance.post(`/company/company_info/`, value, { timeout: 0 });
  };

  const { mutate: mutateAddCompanyInfo, reset } = useMutation(addCompanyInfo, {
    onSuccess: (values) => {
      addMessage(values?.data?.fa_name);
      queryClient.invalidateQueries('/company/company_info/');
      setLoading(false);
      props.setOpenForm(false);
      props.setError(0);
      setFileList([]);
      form.resetFields();
    },
    onError: (error) => {
      setLoading(false);
      manageErrors(error);
      message.error(error?.response);
    },
  });

  const editCompanyInfo = async (value) => {
    console.log('value of form', value);

    await axiosInstance.patch('/company/company_info/1/', value, {
      processData: false,
      timeout: 0,
    });
  };

  const { mutate: mutateEditCompany, reset: editReset } = useMutation(
    editCompanyInfo,
    {
      onSuccess: (values) => {
        setLoading(false);
        props.setError(0);
        setFileList([]);
        form.resetFields();
        updateMessage(values?.data?.fa_name);
        queryClient.invalidateQueries('/company/company_info/');
        props.setOpenForm(false);
      },
      onError: (error) => {
        setLoading(false);
        manageErrors(error);
        message.error(error?.response?.data?.message);
      },
    },
  );

  const cancel = () => {
    props.setOpenForm(false);
    reset();
    editReset();
  };

  if (props.status === 'loading') {
    return (
      <Row justify='space-around'>
        <Col span={23} className='product_table_skeleton banner'>
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
      {props.openForm ? (
        <EditCompanyForm
          form={form}
          isTablet={isTablet}
          isMobile={isMobile}
          file={file}
          setFile={setFile}
          fileList={fileList}
          setFileList={setFileList}
          previewVisible={previewVisible}
          setPreviewVisible={setPreviewVisible}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          loading={loading}
          setLoading={setLoading}
          mutateAddCompanyInfo={mutateAddCompanyInfo}
          mutateEditCompany={mutateEditCompany}
          error={props.error}
          cancel={cancel}
          socialMediaList={props.socialMediaList}
        />
      ) : (
        <CompanyInfo onClickName={onClickName} data={props.data} />
      )}
    </div>
  );
}

const styles = {
  margin: { margin: '0rem' },
  cancel: { margin: '10px 10px' },
  prefix: { width: 50 },
  rowEdit: { paddingTop: '15px' },
  title: (isTablet) => ({
    textAlign: isTablet ? 'center' : '',
    padding: isTablet ? '23px 0px 23px 0px' : '',
  }),
  closeIcon: { color: `${Colors.primaryColor}` },
  modal1: {
    padding: '0px',
    height: '80vh',
  },
  upload1: { width: '100px' },
};
