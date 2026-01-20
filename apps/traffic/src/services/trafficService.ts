import { useQuery } from "@tanstack/react-query";

export interface TrafficStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface TrafficData {
  stats: TrafficStat[];
  totalPageViews: number;
  totalVisitors: number;
  lastUpdated: string;
}

const TRAFFIC_QUERY_KEY = ["traffic", "stats"];

/**
 * Simulated API call to fetch traffic data
 */
async function fetchTrafficData(): Promise<TrafficData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Return mock traffic data (in real app, this would be an API call)
  return {
    stats: [
      { label: "Page Views", value: "124,892", change: "+12.5%", positive: true },
      { label: "Unique Visitors", value: "45,231", change: "+8.2%", positive: true },
      { label: "Avg. Duration", value: "4m 32s", change: "-2.1%", positive: false },
      { label: "Bounce Rate", value: "32.4%", change: "-5.3%", positive: true },
    ],
    totalPageViews: 124892,
    totalVisitors: 45231,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * React Query hook to fetch traffic data
 */
export function useTrafficData() {
  return useQuery({
    queryKey: TRAFFIC_QUERY_KEY,
    queryFn: fetchTrafficData,
  });
}

/**
 * Get the traffic query key for cache operations
 */
export function getTrafficQueryKey(): string[] {
  return TRAFFIC_QUERY_KEY;
}

