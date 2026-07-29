import useSWR from "swr";
import fetcher from "@/libs/fetcher";

const useRecent = () => {
  const { data, error, isLoading } = useSWR("/api/recent", fetcher);

  return {
    data,
    error,
    isLoading,
  };
};

export default useRecent;
