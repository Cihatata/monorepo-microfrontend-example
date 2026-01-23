import { useState } from "react";
import { useAccount } from "platform/account";
import { invalidateQuery, getCacheInfo, type CacheQueryInfo } from "../services/cacheService";
import {
  useGitHubAdminStats,
  getGitHubAdminStatsQueryKey,
  formatNumber,
  getContributorRole,
} from "../services/githubUsersService";

export function AdminHome() {
  const { data: account, isLoading: isAccountLoading } = useAccount();
  const [owner] = useState("vercel");
  const [repo] = useState("next.js");

  const {
    data: adminStats,
    isLoading: isStatsLoading,
    refetch,
    error,
  } = useGitHubAdminStats(owner, repo);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<CacheQueryInfo[] | null>(null);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await invalidateQuery(getGitHubAdminStatsQueryKey(owner, repo));
    await refetch();
    setIsRefreshing(false);
  };

  const handleShowCacheInfo = () => {
    const info = getCacheInfo();
    setCacheInfo(info);
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-800">
            GitHub User Management
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
          Contributors for <code className="bg-slate-100 px-2 py-0.5 rounded">{owner}/{repo}</code>
        </p>
      </div>

      {/* QueryClient Demo */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white mb-8">
        <h2 className="text-lg font-semibold mb-3">🔧 GitHub Users API + QueryClient Demo</h2>
        <p className="text-purple-100 text-sm mb-4">
          Using <code className="bg-white/20 px-2 py-0.5 rounded">platform/queryClient</code> to fetch contributors from{" "}
          <code className="bg-white/20 px-2 py-0.5 rounded">api.github.com</code>
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium text-sm hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRefreshing ? (
              <>
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Contributors
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
            GitHub API Error: {(error as Error).message}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {isStatsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="w-12 h-12 bg-slate-200 animate-pulse rounded-xl mb-3" />
              <div className="w-20 h-4 bg-slate-200 animate-pulse rounded mb-2" />
              <div className="w-16 h-6 bg-slate-200 animate-pulse rounded" />
            </div>
          ))
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Contributors</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatNumber(adminStats?.totalContributors || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Contributions</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatNumber(adminStats?.totalContributions || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Public Repos</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatNumber(adminStats?.orgInfo?.public_repos || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Followers</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatNumber(adminStats?.orgInfo?.followers || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Organization Info */}
      {adminStats?.orgInfo && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <img
              src={adminStats.orgInfo.avatar_url}
              alt={adminStats.orgInfo.login}
              className="w-16 h-16 rounded-xl"
            />
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {adminStats.orgInfo.name || adminStats.orgInfo.login}
              </h2>
              {adminStats.orgInfo.description && (
                <p className="text-slate-600 text-sm mt-1">
                  {adminStats.orgInfo.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                {adminStats.orgInfo.location && (
                  <span className="flex items-center gap-1">
                    📍 {adminStats.orgInfo.location}
                  </span>
                )}
                {adminStats.orgInfo.blog && (
                  <a
                    href={adminStats.orgInfo.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    🔗 Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contributors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Top Contributors
          </h2>
          <span className="text-sm text-slate-500">
            Showing {adminStats?.topContributors.length || 0} contributors
          </span>
        </div>
        <div className="max-h-96 overflow-auto">
          <table className="w-full">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contributor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contributions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Profile
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isStatsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="w-6 h-6 bg-slate-200 animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 animate-pulse rounded-full" />
                        <div className="w-24 h-4 bg-slate-200 animate-pulse rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-5 bg-slate-200 animate-pulse rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-12 h-4 bg-slate-200 animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-12 h-4 bg-slate-200 animate-pulse rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : (
                adminStats?.topContributors.map((contributor, index) => {
                  const role = getContributorRole(contributor.contributions);
                  return (
                    <tr key={contributor.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-800"
                              : index === 1
                              ? "bg-slate-200 text-slate-700"
                              : index === 2
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={contributor.avatar_url}
                            alt={contributor.login}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {contributor.login}
                            </p>
                            <p className="text-xs text-slate-500">
                              {contributor.type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.color}`}
                        >
                          {role.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-800">
                          {formatNumber(contributor.contributions)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href={contributor.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:text-sky-800 text-sm font-medium"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
