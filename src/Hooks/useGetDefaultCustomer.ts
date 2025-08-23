import useGetOneItem from './useGetOneItem';

export default function useGetDefaultCustomer() {
  //get default customer
  const defaultCustomer = useGetOneItem(
    '/customer_account/customer/',
    '103001/?fields=id,full_name',
  );
  return defaultCustomer;
}
