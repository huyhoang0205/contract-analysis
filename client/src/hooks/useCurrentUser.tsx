import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const {
    isLoading,
    error,
    data: user,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const response = await api.get("/auth/current-user");
        return response.data;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
  });
  return {
    isLoading,
    error,
    user,
  };
};
