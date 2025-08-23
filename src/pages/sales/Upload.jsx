import React, { useState } from 'react';
import { Upload, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import compressThisFile from './compressFile';
import ImgCrop from 'antd-img-crop';
import 'antd/es/modal/style';
import 'antd/es/slider/style';
import { useDarkMode } from '../../Hooks/useDarkMode';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const Upload1 = (props) => {
  const { t } = useTranslation();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [mode] = useDarkMode();

  const handleVisibleChange = () => setPreviewVisible(false);

  const prop = {
    onRemove: (file) => {
      const index = props.fileList.indexOf(file);
      const newFileList = props.fileList.slice();
      newFileList.splice(index, 1);
      setTimeout(() => {
        props.setFileList(newFileList);
      }, 50);

      props.setError(false);
      props.setFile();
    },
    onPreview: async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewVisible(true);
    },
    beforeUpload: (file) => {
      props.setFileList([file]);

      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        props.setError(true);

        return false;
      } else {
        props.setError(false);
        (async () => {
          try {
            var smallSize = await compressThisFile(file, {
              quality: 0.6,
              width: 500,
              height: 550,
            });
            props.setFile(smallSize);
          } catch (e) {
            console.log(e);
          }
        })();
        return true;
      }
    },
    fileList: props.fileList,
  };

  const handelStopPropagation = (e) => {
    e.stopPropagation();
  };
  return (
    <div className='clearfix' onClick={handelStopPropagation}>
      <ImgCrop
        rotate
        grid
        modalTitle={t('Upload.Edit_image')}
        fillColor={mode === 'dark' ? 'black' : 'white'}
        quality={0.6}
        modalCancel={t('Form.Cancel')}
        modalOk={t('Form.Save')}
        maxZoom={5}
      >
        <Upload
          name='logo'
          listType='picture-card'
          {...prop}
          maxCount={1}
          accept='image/*'
          customRequest={({ file, onError, onSuccess, onProgress }) => {
            onSuccess();
          }}
          onChange={props.onChange}
        >
          {props.fileList?.length >= 1 ? null : props.name}
        </Upload>
      </ImgCrop>
      <div className='hide-print-component'>
        <Image
          width={200}
          preview={{
            src: previewImage,
            visible: previewVisible,
            onOpenChange: handleVisibleChange,
          }}
        />
      </div>

      {/*       <Modal
        maskClosable={false}
        open={previewVisible}
        footer={null}
        centered
        onCancel={handleCancel}
        closeIcon={<CloseOutlined style={styles.closeIcon} />}
        bodyStyle={styles.modal1}
      >
        <img
          alt="example"
          style={styles.img}
          className="num"
          src={previewImage}
        />
      </Modal> */}
    </div>
  );
};

export default Upload1;
