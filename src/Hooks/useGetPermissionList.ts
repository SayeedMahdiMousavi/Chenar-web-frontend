import { useMemo } from 'react';

export default function useGetPermissionList() {
  const permissions = useMemo(() => [], []);

  return permissions;
}
