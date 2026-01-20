declare module "platform/account" {
  export interface Account {
    id: string;
    name: string;
    email: string;
  }

  export function useAccount(): {
    data: Account | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  export function prefetchAccount(): Promise<void>;
}

declare module "platform/queryClient" {
  import { QueryClient } from "@tanstack/react-query";
  export function getQueryClient(): QueryClient;
}
