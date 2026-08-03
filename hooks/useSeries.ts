import useSWR from "swr";

import fetcher from "@/libs/fetcher";

const useSeries = (seriesId?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    seriesId ? `/api/series/${seriesId}` : null,
    fetcher,
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useSeries;
