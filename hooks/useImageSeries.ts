import useSWR from "swr";
import fetcher from "@/libs/fetcher";

const useImageSeries = (imageSeriesId?: string) => {
  const { data, error, isLoading } = useSWR(
    imageSeriesId ? `/api/image-series/${imageSeriesId}` : null,
    fetcher,
  );

  return {
    data,
    error,
    isLoading,
  };
};

export default useImageSeries;
