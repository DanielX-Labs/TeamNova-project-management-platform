import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnMount: false,
  });
  return query;
};

export default useAuth;
