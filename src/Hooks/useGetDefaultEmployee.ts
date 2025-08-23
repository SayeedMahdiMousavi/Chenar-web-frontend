import useGetOneItem from './useGetOneItem';

export default function useGetDefaultEmployee() {
  //get default employee
  const defaultEmployee = useGetOneItem(
    '/staff_account/staff/',
    '203001/?fields=id,full_name',
  );
  return defaultEmployee;
}
