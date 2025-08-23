import {
  USER_MODEL_LS,
  USER_PERMISSIONS_LS,
  USER_TYPE,
} from '../constants/localStorageVars';
import axiosInstance from '../pages/ApiBaseUrl';
import {
  PAY_ACCESS_TOKEN,
  PAY_REFRESH_TOKEN,
} from '../pages/LocalStorageVariables';

export function handleClearLocalStorageLogout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_permit');
  localStorage.removeItem('user_id');
  localStorage.removeItem(PAY_REFRESH_TOKEN);
  localStorage.removeItem(PAY_ACCESS_TOKEN);
  localStorage.removeItem(USER_TYPE);
  localStorage.removeItem(USER_PERMISSIONS_LS);
  localStorage.removeItem(USER_MODEL_LS);
  axiosInstance.defaults.headers['Authorization'] = null;
}
