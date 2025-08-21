import useGetOneItem from "./useGetOneItem";

export default function useGetDefaultSupplier() {
  //get default supplier
  const defaultSupplier = useGetOneItem(
    "/supplier_account/supplier/",
    "201001/?fields=id,full_name"
  );

  return defaultSupplier;
}
