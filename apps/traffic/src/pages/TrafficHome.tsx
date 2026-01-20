import { useState } from "react";
import { useAccount } from "platform/account";
import { invalidateQuery, getCacheInfo, type CacheQueryInfo } from "../services/cacheService";
import { useTrafficData, getTrafficQueryKey } from "../services/trafficService";

export function TrafficHome() {
  const { data: account, isLoading: isAccountLoading } = useAccount();
  const { data: trafficData, isLoading: isTrafficLoading, refetch } = useTrafficData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<CacheQueryInfo[] | null>(null);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    // Invalidate traffic data cache using the query key from service
    await invalidateQuery(getTrafficQueryKey());
    await refetch();
    setIsRefreshing(false);
  };

  const handleShowCacheInfo = () => {
    const info = getCacheInfo();
    setCacheInfo(info);
  };

  const isLoading = isAccountLoading || isTrafficLoading;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-800">
            Traffic Analytics
          </h1>
          {isAccountLoading ? (
            <div className="w-32 h-6 bg-slate-200 animate-pulse rounded" />
          ) : (
            <span className="text-sm text-slate-500">
              Welcome, <span className="font-medium text-slate-700">{account?.name}</span>
            </span>
          )}
        </div>
        <p className="text-slate-600">
          Track your website traffic data in real-time.
        </p>
      </div>

      {/* QueryClient Usage Example */}
      <div className="bg-red-500  rounded-xl p-6 text-red-500 mb-8">
        <h2 className="text-lg font-semibold mb-3">🔧 Cache Service Example</h2>
        <p className="text-indigo-100 text-sm mb-4">
          Using <code className="bg-white/20 px-2 py-0.5 rounded">cacheService</code> and{" "}
          <code className="bg-white/20 px-2 py-0.5 rounded">trafficService</code> for data fetching
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRefreshing ? (
              <>
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Traffic Data
              </>
            )}
          </button>
          <button
            onClick={handleShowCacheInfo}
            className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
          >
            Show Cache Info
          </button>
        </div>
        {cacheInfo && (
          <pre className="mt-4 p-3 bg-black/20 rounded-lg text-xs overflow-auto max-h-40">
            {JSON.stringify(cacheInfo, null, 2)}
          </pre>
        )}
      </div>

      {/* Stats Grid - Data from trafficService */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isTrafficLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="w-20 h-4 bg-slate-200 animate-pulse rounded mb-2" />
              <div className="w-24 h-8 bg-slate-200 animate-pulse rounded mb-2" />
              <div className="w-16 h-4 bg-slate-200 animate-pulse rounded" />
            </div>
          ))
        ) : (
          trafficData?.stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 mb-2">{stat.value}</p>
              <span
                className={`text-sm font-medium ${
                  stat.positive ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Last Updated Info */}
      {trafficData?.lastUpdated && (
        <div className="mb-8 text-sm text-slate-500 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Last updated: {new Date(trafficData.lastUpdated).toLocaleTimeString()}
        </div>
      )}

      {/* Traffic Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Last 7 Days Traffic Chart
        </h2>
        <div className="h-64 from-emerald-50 to-sky-50 rounded-lg flex items-center justify-center border border-dashed border-slate-300">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-emerald-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <p className="text-slate-500">Chart Component</p>
          </div>
        </div>
      </div>

      {/* Recent Visitors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Visitors
          </h2>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Page
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Visitor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Source
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {[
              { page: "/home", visitor: "Turkey", duration: "2m 15s", source: "Google" },
              { page: "/products", visitor: "Germany", duration: "4m 32s", source: "Direct" },
              { page: "/contact", visitor: "USA", duration: "1m 08s", source: "Twitter" },
              { page: "/blog/article-1", visitor: "UK", duration: "6m 45s", source: "LinkedIn" },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-800">{row.page}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{row.visitor}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{row.duration}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{row.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
