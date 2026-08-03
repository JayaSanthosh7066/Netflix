import useSWR from "swr";

import fetcher from "@/libs/fetcher";
import { SeriesInterface } from "@/types";

const useSeriesList = () => {
  const { data, error, isLoading, mutate } = useSWR<SeriesInterface[]>(
    "/api/series/list",
    fetcher,
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useSeriesList;
