import { useState } from "react";
import { useAccount } from "platform/account";
import { invalidateQuery, getCacheInfo, type CacheQueryInfo } from "../services/cacheService";
import {
  useGitHubRepoReport,
  getGitHubRepoReportQueryKey,
  formatNumber,
  formatBytes,
  formatDate,
  getLanguageColor,
} from "../services/githubRepoService";

export function ReportsHome() {
  const { data: account, isLoading: isAccountLoading } = useAccount();
  const [owner] = useState("microsoft");
  const [repo] = useState("typescript");

  const {
    data: repoReport,
    isLoading: isReportLoading,
    refetch,
    error,
  } = useGitHubRepoReport(owner, repo);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<CacheQueryInfo[] | null>(null);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await invalidateQuery(getGitHubRepoReportQueryKey(owner, repo));
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
            GitHub Repository Report
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
          Statistics for <code className="bg-slate-100 px-2 py-0.5 rounded">{owner}/{repo}</code>
        </p>
      </div>

      {/* QueryClient Demo */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white mb-8">
        <h2 className="text-lg font-semibold mb-3">🔧 GitHub Repo Stats API + QueryClient Demo</h2>
        <p className="text-blue-100 text-sm mb-4">
          Using <code className="bg-white/20 px-2 py-0.5 rounded">platform/queryClient</code> to fetch repo statistics from{" "}
          <code className="bg-white/20 px-2 py-0.5 rounded">api.github.com</code>
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRefreshing ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Report
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

      {/* Repository Header */}
      {repoReport?.repo && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <img
              src={repoReport.repo.owner.avatar_url}
              alt={repoReport.repo.owner.login}
              className="w-16 h-16 rounded-xl"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-slate-800">
                  {repoReport.repo.full_name}
                </h2>
                {repoReport.repo.license && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {repoReport.repo.license.spdx_id}
                  </span>
                )}
              </div>
              {repoReport.repo.description && (
                <p className="text-slate-600 text-sm mb-3">
                  {repoReport.repo.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {repoReport.repo.topics.slice(0, 6).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {isReportLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="w-16 h-4 bg-slate-200 animate-pulse rounded mb-2" />
              <div className="w-12 h-7 bg-slate-200 animate-pulse rounded" />
            </div>
          ))
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
              <p className="text-sm text-slate-500 mb-1">Stars</p>
              <p className="text-2xl font-bold text-yellow-500">
                ⭐ {formatNumber(repoReport?.repo.stargazers_count || 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
              <p className="text-sm text-slate-500 mb-1">Forks</p>
              <p className="text-2xl font-bold text-blue-600">
                🍴 {formatNumber(repoReport?.repo.forks_count || 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
              <p className="text-sm text-slate-500 mb-1">Open Issues</p>
              <p className="text-2xl font-bold text-red-500">
                🐛 {formatNumber(repoReport?.repo.open_issues_count || 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center">
              <p className="text-sm text-slate-500 mb-1">Size</p>
              <p className="text-2xl font-bold text-slate-700">
                📦 {formatBytes((repoReport?.repo.size || 0) * 1024)}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Language Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Language Breakdown
          </h3>
          {isReportLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 h-4 bg-slate-200 animate-pulse rounded" />
                  <div className="flex-1 h-2 bg-slate-200 animate-pulse rounded-full" />
                  <div className="w-12 h-4 bg-slate-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Language bar */}
              <div className="h-3 rounded-full overflow-hidden flex">
                {repoReport?.languagePercentages.slice(0, 8).map((lang) => (
                  <div
                    key={lang.name}
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: getLanguageColor(lang.name),
                    }}
                    className="h-full"
                    title={`${lang.name}: ${lang.percentage}%`}
                  />
                ))}
              </div>

              {/* Language list */}
              <div className="space-y-2 mt-4">
                {repoReport?.languagePercentages.slice(0, 8).map((lang) => (
                  <div key={lang.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getLanguageColor(lang.name) }}
                      />
                      <span className="text-sm text-slate-700">{lang.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">
                        {formatBytes(lang.bytes)}
                      </span>
                      <span className="text-sm font-medium text-slate-800 w-12 text-right">
                        {lang.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4">
                <p className="text-sm text-slate-500">
                  Total: {formatBytes(repoReport?.totalBytes || 0)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Repository Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Repository Info
          </h3>
          {isReportLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="w-24 h-4 bg-slate-200 animate-pulse rounded" />
                  <div className="w-32 h-4 bg-slate-200 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Primary Language</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getLanguageColor(repoReport?.repo.language || "") }}
                  />
                  {repoReport?.repo.language || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Default Branch</span>
                <span className="text-sm font-medium text-slate-800">
                  {repoReport?.repo.default_branch}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Created</span>
                <span className="text-sm font-medium text-slate-800">
                  {formatDate(repoReport?.repo.created_at || "")}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Last Updated</span>
                <span className="text-sm font-medium text-slate-800">
                  {formatDate(repoReport?.repo.updated_at || "")}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-500">Last Push</span>
                <span className="text-sm font-medium text-slate-800">
                  {formatDate(repoReport?.repo.pushed_at || "")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Releases */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            Recent Releases
          </h3>
        </div>
        <div className="divide-y divide-slate-100 max-h-80 overflow-auto">
          {isReportLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 animate-pulse rounded-full" />
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-slate-200 animate-pulse rounded mb-2" />
                    <div className="w-48 h-3 bg-slate-200 animate-pulse rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : repoReport?.releases.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500">
              No releases found for this repository.
            </div>
          ) : (
            repoReport?.releases.map((release) => (
              <a
                key={release.id}
                href={release.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={release.author.avatar_url}
                    alt={release.author.login}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">
                        {release.tag_name}
                      </span>
                      {release.prerelease && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                          Pre-release
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {release.name || release.tag_name} • Released by{" "}
                      <span className="font-medium">{release.author.login}</span> on{" "}
                      {formatDate(release.published_at)}
                    </p>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
