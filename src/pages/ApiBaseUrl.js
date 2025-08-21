import i18n from 'i18next';
import axios from 'axios';
import { manageNetworkError } from '../Functions/manageNetworkError';
import { queryClient } from '../App';
import { handleClearLocalStorageLogout } from '../Functions';
import { lightThemeVars } from '../vars';

const baseURL = 'https://api.chenar.x9f4a7.onten.io/api/v1';


const axiosInstance = axios.create({
  baseURL: baseURL,
 
  timeout: 5000,
  withCredentials: true,

  headers: {
    Authorization: localStorage.getItem('access_token')
    
      ? 'Bearer ' + localStorage.getItem('access_token')
      : null,

  },
});


const handleLogout = () => {
  handleClearLocalStorageLogout();
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
  queryClient.clear();
  window.less.modifyVars(lightThemeVars);
};

axiosInstance.interceptors.request.use(
  function (config) {
    //
    config.headers.common = {
      ...config.headers.common,
      'Accept-Language': i18n.language,
    };


    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error?.config?.method !== 'get') {
      manageNetworkError(error);
      return Promise.reject(error);
    }


    if (
      error?.response?.status === 403 &&
      error?.response?.data?.code === 'token_not_valid' &&
      originalRequest.url === baseURL + '/user_account/tokens/refresh/'
    ) {

      return Promise.reject(error);
    }
    //
    if (
      error?.response?.data?.detail === 'User not found' &&
      error?.response?.data?.code === 'user_not_found'
    ) {
      handleLogout();
    }

    if (
      error?.response?.data?.code === 'token_not_valid' &&
      error?.response?.status === 403 &&
      error?.response?.statusText === 'Forbidden'
    ) {
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);
        //

        if (tokenParts.exp > now) {
          //
          try {
            const response = await axiosInstance.post(
              '/user_account/tokens/refresh/',
              { refresh: refreshToken }
            );

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            axiosInstance.defaults.headers['Authorization'] =
              'Bearer ' + response.data.access;
            originalRequest.headers['Authorization'] =
              'Bearer ' + response.data.access;
            return await axiosInstance(originalRequest);
          } catch (err) {
            console.log(err);
            
          }
        } else {
          //
          handleLogout();
        }
      } else {
        //
        handleLogout();
      }
    }
    // const lang = localStorage.getItem("lang");
    //
    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export default axiosInstance;
