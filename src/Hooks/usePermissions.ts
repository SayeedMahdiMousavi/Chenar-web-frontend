import { useContext } from 'react';
import {
  Permissions,
  PermissionsContext,
} from '../context/PermissionsProvider';

export const usePermissions = () => {
  const [permissions, setPermissions] =
    useContext<Permissions>(PermissionsContext);

  // if (permissions) {
  return [permissions, setPermissions] as const;
  // }
  // throw Error("You are out of permission provider");
};
