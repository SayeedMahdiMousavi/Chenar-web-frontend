import { useState, Suspense } from 'react';
import { Result, Spin } from 'antd';
import { Navigate } from 'react-router-dom';
import PrivateRouteContent from './PrivateRouteContent';
import { useTranslation } from 'react-i18next';
import { checkPermissions, checkPermissionsModel } from '../../Functions';

export const PrivateRoute = ({ element: Component, model, permission }) => {
  const [token] = useState(() => window.localStorage.getItem('refresh_token'));
  const { t } = useTranslation();

  // Check permissions
  if (
    !checkPermissionsModel(model) ||
    (permission && !checkPermissions(permission))
  ) {
    return (
      <div className='notFound__body'>
        <Result
          status='403'
          title='403'
          subTitle={t('Authorization_message')}
        />
      </div>
    );
  }

  // Check if token exists
  if (!token) {
    return <Navigate to='/' replace />;
  }

  return (
    <Suspense
      fallback={
        <div className='spin'>
          <Spin size='large' />
        </div>
      }
    >
      <PrivateRouteContent component={<Component />} />
    </Suspense>
  );
};

export default PrivateRoute;
