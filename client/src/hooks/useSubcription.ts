import { useState } from "react";
import { useCurrentUser } from "./useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSubcription() {
  const {
    isLoading: isUserLoading,
    error: isUserError,
    user,
  } = useCurrentUser();
  const [loading, setLoading] = useState<boolean>(true);

  const {
    data: subcriptionStatus,
    isLoading: isSubscriptionLoading,
    error: isSubscriptionError,
  } = useQuery({
    queryKey: ["subcriptionStatus"],
    queryFn: fetchSubcriptionStatus,
    enabled: !!user,
  });

  return {
    subcriptionStatus,
    isUserLoading,
    isUserError,
    isSubscriptionLoading,
    isSubscriptionError,
    loading,
    setLoading,
  };
}

async function fetchSubcriptionStatus() {
  const response = await api.get("/payment/membership-status");
  if (response.status !== 200) {
    throw new Error("Failed to fetch subscription status");
  }

  return response.data;
}
