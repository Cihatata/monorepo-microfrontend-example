import { getQueryClient } from "platform/queryClient";

export interface CacheQueryInfo {
  key: unknown[];
  state: string;
  dataUpdatedAt: string;
}

/**
 * Invalidates queries by key
 */
export async function invalidateQuery(queryKey: unknown[]): Promise<void> {
  const queryClient = getQueryClient();
  await queryClient.invalidateQueries({ queryKey });
}

/**
 * Invalidates all queries in the cache
 */
export async function invalidateAllCache(): Promise<void> {
  const queryClient = getQueryClient();
  await queryClient.invalidateQueries();
}

/**
 * Gets information about all cached queries
 */
export function getCacheInfo(): CacheQueryInfo[] {
  const queryClient = getQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queries = queryCache.getAll();

  return queries.map((q) => ({
    key: q.queryKey as unknown[],
    state: q.state.status,
    dataUpdatedAt: q.state.dataUpdatedAt
      ? new Date(q.state.dataUpdatedAt).toLocaleTimeString()
      : "N/A",
  }));
}

/**
 * Prefetches data for a specific query key
 */
export async function prefetchQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>
): Promise<void> {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
}

/**
 * Gets cached data for a specific query key
 */
export function getQueryData<T>(queryKey: unknown[]): T | undefined {
  const queryClient = getQueryClient();
  return queryClient.getQueryData<T>(queryKey);
}

/**
 * Sets data directly in the cache
 */
export function setQueryData<T>(queryKey: unknown[], data: T): void {
  const queryClient = getQueryClient();
  queryClient.setQueryData(queryKey, data);
}

/**
 * Removes a query from the cache
 */
export function removeQuery(queryKey: unknown[]): void {
  const queryClient = getQueryClient();
  queryClient.removeQueries({ queryKey });
}
