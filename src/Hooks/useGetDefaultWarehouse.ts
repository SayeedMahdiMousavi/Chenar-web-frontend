import useGetOneItem from "./useGetOneItem";

export default function useGetDefaultWarehouse() {
  //get default warehouse
  const defaultWarehouse = useGetOneItem(
    "/inventory/warehouse/",
    "106001/?fields=id,name"
  );

  return defaultWarehouse;
}
