import { useState } from "react";
import { useAccount } from "platform/account";
import { invalidateQuery, getCacheInfo, type CacheQueryInfo } from "../services/cacheService";
import {
  useGitHubTrafficStats,
  getGitHubTrafficStatsQueryKey,
  formatEventType,
  getEventColorClass,
} from "../services/githubService";

export function TrafficHome() {
  const { data: account, isLoading: isAccountLoading } = useAccount();
  const [owner] = useState("facebook");
  const [repo] = useState("react");
  
  const { 
    data: trafficStats, 
    isLoading: isTrafficLoading, 
    refetch,
    error 
  } = useGitHubTrafficStats(owner, repo);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<CacheQueryInfo[] | null>(null);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await invalidateQuery(getGitHubTrafficStatsQueryKey(owner, repo));
    await refetch();
    setIsRefreshing(false);
  };

  const handleShowCacheInfo = () => {
    const info = getCacheInfo();
    setCacheInfo(info);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-800">
            GitHub Activity Tracker
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
          Real-time activity tracking for <code className="bg-slate-100 px-2 py-0.5 rounded">{owner}/{repo}</code>
        </p>
      </div>

      {/* QueryClient Usage Example */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-8">
        <h2 className="text-lg font-semibold mb-3">🔧 GitHub API + QueryClient Demo</h2>
        <p className="text-indigo-100 text-sm mb-4">
          Using <code className="bg-white/20 px-2 py-0.5 rounded">platform/queryClient</code> to fetch from{" "}
          <code className="bg-white/20 px-2 py-0.5 rounded">api.github.com</code>
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
                Refresh Data
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

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          <p className="text-red-700 text-sm">
            GitHub API Error: {(error as Error).message}. Rate limit may be exceeded.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isTrafficLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="w-20 h-4 bg-slate-200 animate-pulse rounded mb-2" />
              <div className="w-24 h-8 bg-slate-200 animate-pulse rounded mb-2" />
              <div className="w-16 h-4 bg-slate-200 animate-pulse rounded" />
            </div>
          ))
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <p className="text-sm text-slate-500 mb-1">Recent Commits</p>
              <p className="text-2xl font-bold text-slate-800 mb-2">{trafficStats?.totalCommits || 0}</p>
              <span className="text-sm font-medium text-emerald-600">from API</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <p className="text-sm text-slate-500 mb-1">Recent Events</p>
              <p className="text-2xl font-bold text-slate-800 mb-2">{trafficStats?.totalEvents || 0}</p>
              <span className="text-sm font-medium text-blue-600">push, PR, issues</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <p className="text-sm text-slate-500 mb-1">Contributors</p>
              <p className="text-2xl font-bold text-slate-800 mb-2">{trafficStats?.uniqueContributors || 0}</p>
              <span className="text-sm font-medium text-purple-600">unique authors</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <p className="text-sm text-slate-500 mb-1">Last Activity</p>
              <p className="text-2xl font-bold text-slate-800 mb-2">
                {trafficStats?.lastActivity ? formatTimeAgo(trafficStats.lastActivity) : "N/A"}
              </p>
              <span className="text-sm font-medium text-amber-600">latest commit</span>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Commits */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Recent Commits
            </h2>
          </div>
          <div className="divide-y divide-slate-100 max-h-96 overflow-auto">
            {isTrafficLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                    <div className="flex-1">
                      <div className="w-3/4 h-4 bg-slate-200 animate-pulse rounded mb-2" />
                      <div className="w-1/2 h-3 bg-slate-200 animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              trafficStats?.recentCommits.map((commit) => (
                <a
                  key={commit.sha}
                  href={commit.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {commit.author ? (
                      <img
                        src={commit.author.avatar_url}
                        alt={commit.author.login}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
                        <span className="text-xs text-slate-600">?</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 font-medium truncate">
                        {commit.commit.message.split("\n")[0]}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        <span className="font-medium">{commit.author?.login || commit.commit.author.name}</span>
                        {" · "}
                        {formatTimeAgo(commit.commit.author.date)}
                        {" · "}
                        <code className="text-xs bg-slate-100 px-1 rounded">{commit.sha.slice(0, 7)}</code>
                      </p>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Recent Events
            </h2>
          </div>
          <div className="divide-y divide-slate-100 max-h-96 overflow-auto">
            {isTrafficLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
                    <div className="flex-1">
                      <div className="w-3/4 h-4 bg-slate-200 animate-pulse rounded mb-2" />
                      <div className="w-1/2 h-3 bg-slate-200 animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              trafficStats?.recentEvents.map((event) => (
                <div key={event.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <img
                      src={event.actor.avatar_url}
                      alt={event.actor.login}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getEventColorClass(event.type)}`}>
                          {formatEventType(event.type)}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatTimeAgo(event.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800">
                        <span className="font-medium">{event.actor.login}</span>
                        {" "}
                        {event.payload.action || "performed"} on{" "}
                        <span className="text-slate-500">{event.repo.name}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
