import useSWR from "swr";
import fetcher from "@/libs/fetcher";

const useImageSeriesList = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/image-series",
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return {
    data: data || [],
    error,
    isLoading,
    mutate,
  };
};

export default useImageSeriesList;
