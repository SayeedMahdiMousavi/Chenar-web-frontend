import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './less/main.less';
import './index.css';
import { Provider } from 'react-redux';
import store from './Store/store';
import './i18n';

import * as serviceWorker from './serviceWorker';
import { Spin } from 'antd';
import 'antd/dist/reset.css';

import * as Sentry from '@sentry/react';
// import { configureStore } from "@reduxjs/toolkit";

import { CollapseSidebarProvider } from './context/CollapseSidebarProvider';
import { ChangeThem } from './context/ChangeThem';
import { PermissionsProvider } from './context/PermissionsProvider';

//sentry
if (import.meta.env.MODE === 'production') {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
  });
}

// const mockReducer = (state = {}) => state;
// const mockStore = configureStore({ reducer: mockReducer });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <CollapseSidebarProvider>
      <Suspense
        fallback={
          <div className='spin'>
            <Spin size='large' />
          </div>
        }
      >
        <ChangeThem>
          <PermissionsProvider>
            <App />
          </PermissionsProvider>
        </ChangeThem>
      </Suspense>
    </CollapseSidebarProvider>
  </Provider>,
);

serviceWorker.unregister();
