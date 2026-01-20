import { useQuery } from "@tanstack/react-query";
import { getQueryClient } from "./queryClient";

export interface Account {
  id: string;
  name: string;
  email: string;
}

const ACCOUNT_QUERY_KEY = ["account"];

// Simulated API call - replace with real API in production
async function fetchAccount(): Promise<Account> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return mock account data
  return {
    id: "user-001",
    name: "John Smith1",
    email: "john@example.com",
  };
}

export function useAccount() {
  return useQuery({
    queryKey: ACCOUNT_QUERY_KEY,
    queryFn: fetchAccount,
  });
}

export async function prefetchAccount(): Promise<void> {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ACCOUNT_QUERY_KEY,
    queryFn: fetchAccount,
  });
}
