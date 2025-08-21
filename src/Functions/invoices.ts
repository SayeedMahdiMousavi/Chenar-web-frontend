export const handleFindUnitConversionRate = (
  unitConversions: any[],
  unit: number,
  productUnits: any[]
) => {
  
  const baseUnitId = productUnits?.find((item: any) => item?.base_unit === true) ?.unit?.id;
  if (baseUnitId === unit) {
    return 1;
  } else {
    const conversionRatio = unitConversions?.find(
      (item: any) => item?.from_unit?.id === unit
    )?.ratio;
    return conversionRatio;
  }
};
