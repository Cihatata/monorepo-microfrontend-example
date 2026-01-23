import { useQuery } from "@tanstack/react-query";

// GitHub API Types
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  license: {
    name: string;
    spdx_id: string;
  } | null;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
  draft: boolean;
  author: {
    login: string;
    avatar_url: string;
  };
}

export interface RepoReport {
  repo: GitHubRepo;
  languages: GitHubLanguages;
  releases: GitHubRelease[];
  languagePercentages: { name: string; percentage: number; bytes: number }[];
  totalBytes: number;
}

// Query Keys
const GITHUB_REPO_KEY = ["github", "repo"];
const GITHUB_LANGUAGES_KEY = ["github", "languages"];
const GITHUB_RELEASES_KEY = ["github", "releases"];
const GITHUB_REPO_REPORT_KEY = ["github", "repo-report"];

// GitHub API Base URL
const GITHUB_API_BASE = "https://api.github.com";

// Default repository
const DEFAULT_OWNER = "microsoft";
const DEFAULT_REPO = "typescript";

/**
 * Fetch repository details
 */
async function fetchGitHubRepo(
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO
): Promise<GitHubRepo> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch repository languages
 */
async function fetchGitHubLanguages(
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO
): Promise<GitHubLanguages> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch repository releases
 */
async function fetchGitHubReleases(
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO,
  perPage = 10
): Promise<GitHubRelease[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/releases?per_page=${perPage}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch combined repo report
 */
async function fetchRepoReport(
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO
): Promise<RepoReport> {
  const [repoData, languages, releases] = await Promise.all([
    fetchGitHubRepo(owner, repo),
    fetchGitHubLanguages(owner, repo),
    fetchGitHubReleases(owner, repo, 10),
  ]);

  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

  const languagePercentages = Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 100 * 10) / 10,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  return {
    repo: repoData,
    languages,
    releases,
    languagePercentages,
    totalBytes,
  };
}

/**
 * Hook: Get repository details
 */
export function useGitHubRepo(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return useQuery({
    queryKey: [...GITHUB_REPO_KEY, owner, repo],
    queryFn: () => fetchGitHubRepo(owner, repo),
  });
}

/**
 * Hook: Get repository languages
 */
export function useGitHubLanguages(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return useQuery({
    queryKey: [...GITHUB_LANGUAGES_KEY, owner, repo],
    queryFn: () => fetchGitHubLanguages(owner, repo),
  });
}

/**
 * Hook: Get repository releases
 */
export function useGitHubReleases(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return useQuery({
    queryKey: [...GITHUB_RELEASES_KEY, owner, repo],
    queryFn: () => fetchGitHubReleases(owner, repo),
  });
}

/**
 * Hook: Get combined repo report
 */
export function useGitHubRepoReport(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return useQuery({
    queryKey: [...GITHUB_REPO_REPORT_KEY, owner, repo],
    queryFn: () => fetchRepoReport(owner, repo),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get query keys for cache operations
 */
export function getGitHubRepoReportQueryKey(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return [...GITHUB_REPO_REPORT_KEY, owner, repo];
}

/**
 * Helper: Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }
  if (bytes >= 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  }
  return bytes + " B";
}

/**
 * Helper: Format large numbers
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

/**
 * Helper: Get language color
 */
export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    Ruby: "#701516",
    PHP: "#4F5D95",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#178600",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Scala: "#c22d40",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Makefile: "#427819",
  };
  return colors[language] || "#6e7681";
}

/**
 * Helper: Format date
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
