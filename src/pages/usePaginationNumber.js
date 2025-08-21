import { useState, useEffect } from "react";

export function usePaginationNumber(resolvedData, page, pageSize) {
  const [allData, setAllData] = useState([]);
  const result = resolvedData?.results;
  // const listLength = resolvedData?.results?.length;
  useEffect(() => {
    const allData = result?.map((item, index) => {
      return { ...item, serial: (page - 1) * pageSize + index + 1 };
    });
    setAllData(allData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, page, pageSize]);

  return allData;
}
