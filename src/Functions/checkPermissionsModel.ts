import {
  USER_MODEL_LS,
  USER_PERMISSIONS_LS,
  USER_TYPE,
} from '../constants/localStorageVars';

export function checkPermissionsModel(permissionModels: string[] | string) {
  const models = JSON?.parse(localStorage.getItem(USER_MODEL_LS) || '[]');
  const userType = localStorage?.getItem(USER_TYPE);
  //
  //
  if (permissionModels === 'dashboard') return true;
  // return true
  if (typeof permissionModels === 'string') {
    return userType === 'admin' ? true : models?.includes(permissionModels);
  } else {
    return userType === 'admin'
      ? true
      : permissionModels?.some((r) => models?.includes(r));
  }
}

export function checkPermissions(permission: string | string[]) {
  const permissions = JSON?.parse(
    localStorage?.getItem(USER_PERMISSIONS_LS) || '[]',
  );

  const userType = localStorage.getItem(USER_TYPE);

  if (typeof permission === 'string') {
    return userType === 'admin' ? true : permissions?.includes(permission);
  } else {
    return userType === 'admin'
      ? true
      : permission?.some((r) => permissions?.includes(r));
  }
}
export function checkActionColumnPermissions(model: string) {
  return checkPermissions([`delete_${model}`, `change_${model}`]);
}
