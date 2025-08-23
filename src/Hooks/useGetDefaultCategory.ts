import useGetOneItem from './useGetOneItem';

export default function useGetDefaultCategory(baseUrl: string) {
  //get default category
  const defaultCategory = useGetOneItem(baseUrl, '1/?fields=id,name');

  return defaultCategory;
}
