import useSWR from "swr";

import fetcher from "@/libs/fetcher";

const useSeriesList = () => {
  const { data, error, isLoading, mutate } = useSWR(
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
