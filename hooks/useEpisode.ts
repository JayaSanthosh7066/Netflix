import useSwr from "swr";

import fetcher from "@/libs/fetcher";

const useEpisode = (id?: string) => {
  const { data, error, isLoading } = useSwr(
    id ? `/api/episodes/${id}` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    data,
    error,
    isLoading,
  };
};

export default useEpisode;
