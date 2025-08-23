import React, { createContext, useState, useMemo } from 'react';
import {
  USER_MODEL_LS,
  USER_PERMISSIONS_LS,
} from '../constants/localStorageVars';

export type Permissions = [
  { userPermit: string; models: string },
  (value: string) => void,
];

export const PermissionsContext = createContext<Permissions>(null!);

export const PermissionsProvider = (props: any) => {
  const [permissions, setPermissions] = useState<{
    userPermit: string;
    models: string;
  }>(() => ({
    userPermit: window?.localStorage?.getItem(USER_PERMISSIONS_LS)!,
    models: window?.localStorage?.getItem(USER_MODEL_LS)!,
  }));

  const value = useMemo(
    () => [permissions, setPermissions],
    [permissions, setPermissions],
  );

  return (
    <PermissionsContext.Provider
      // @ts-ignore
      value={value}
    >
      {props.children}
    </PermissionsContext.Provider>
  );
};
