import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Alert, ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import { Detector } from 'react-detect-offline';
import { DASHBOARD } from '../../constants/routes';

const PublicRoute = ({ element }) => {
  const { t } = useTranslation();
  const [token] = useState(() => window.localStorage.getItem('refresh_token'));

  if (token) {
    return <Navigate to={DASHBOARD} />;
  }

  return (
    <ConfigProvider direction='ltr'>
      <Detector
        render={({ online }) => (
          <>
            {!online && (
              <Alert
                type='error'
                message={
                  <span className='internet_error'>
                    {t('Internet.No_internet_message')}
                  </span>
                }
                style={{
                  width: '100%',
                  height: '30px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}
                banner
              />
            )}
            {element}
          </>
        )}
      />
    </ConfigProvider>
  );
};

export default PublicRoute;
