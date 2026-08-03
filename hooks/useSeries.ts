import useSWR from "swr";

import fetcher from "@/libs/fetcher";
import { SeriesInterface } from "@/types";

const useSeries = (seriesId?: string) => {
  const { data, error, isLoading, mutate } = useSWR<SeriesInterface>(
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
