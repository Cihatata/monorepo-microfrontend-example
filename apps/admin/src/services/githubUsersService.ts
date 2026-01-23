import { useQuery } from "@tanstack/react-query";

// GitHub API Types
export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubOrg {
  login: string;
  id: number;
  avatar_url: string;
  description: string | null;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
}

export interface AdminStats {
  totalContributors: number;
  totalContributions: number;
  topContributors: GitHubContributor[];
  orgInfo: GitHubOrg | null;
}

// Query Keys
const GITHUB_CONTRIBUTORS_KEY = ["github", "contributors"];
const GITHUB_USER_KEY = ["github", "user"];
const GITHUB_ORG_KEY = ["github", "org"];
const GITHUB_ADMIN_STATS_KEY = ["github", "admin-stats"];

// GitHub API Base URL
const GITHUB_API_BASE = "https://api.github.com";

// Default values
const DEFAULT_OWNER = "vercel";
const DEFAULT_REPO = "next.js";

/**
 * Fetch contributors from a GitHub repository
 */
async function fetchGitHubContributors(
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO,
  perPage = 20
): Promise<GitHubContributor[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=${perPage}`,
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
 * Fetch a specific GitHub user
 */
async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
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
 * Fetch a GitHub organization
 */
async function fetchGitHubOrg(org: string): Promise<GitHubOrg> {
  const response = await fetch(`${GITHUB_API_BASE}/orgs/${org}`, {
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
 * Fetch combined admin stats
 */
async function fetchAdminStats(
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO
): Promise<AdminStats> {
  const [contributors, orgInfo] = await Promise.all([
    fetchGitHubContributors(owner, repo, 30),
    fetchGitHubOrg(owner).catch(() => null), // May fail if owner is not an org
  ]);

  const totalContributions = contributors.reduce(
    (sum, c) => sum + c.contributions,
    0
  );

  return {
    totalContributors: contributors.length,
    totalContributions,
    topContributors: contributors.slice(0, 20),
    orgInfo,
  };
}

/**
 * Hook: Get repository contributors
 */
export function useGitHubContributors(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return useQuery({
    queryKey: [...GITHUB_CONTRIBUTORS_KEY, owner, repo],
    queryFn: () => fetchGitHubContributors(owner, repo),
  });
}

/**
 * Hook: Get a specific user
 */
export function useGitHubUser(username: string) {
  return useQuery({
    queryKey: [...GITHUB_USER_KEY, username],
    queryFn: () => fetchGitHubUser(username),
    enabled: !!username,
  });
}

/**
 * Hook: Get organization info
 */
export function useGitHubOrg(org: string) {
  return useQuery({
    queryKey: [...GITHUB_ORG_KEY, org],
    queryFn: () => fetchGitHubOrg(org),
    enabled: !!org,
  });
}

/**
 * Hook: Get combined admin stats
 */
export function useGitHubAdminStats(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return useQuery({
    queryKey: [...GITHUB_ADMIN_STATS_KEY, owner, repo],
    queryFn: () => fetchAdminStats(owner, repo),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get query keys for cache operations
 */
export function getGitHubContributorsQueryKey(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return [...GITHUB_CONTRIBUTORS_KEY, owner, repo];
}

export function getGitHubAdminStatsQueryKey(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return [...GITHUB_ADMIN_STATS_KEY, owner, repo];
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
 * Helper: Get contributor role based on contributions
 */
export function getContributorRole(contributions: number): {
  label: string;
  color: string;
} {
  if (contributions >= 1000) {
    return { label: "Core", color: "bg-purple-100 text-purple-800" };
  }
  if (contributions >= 100) {
    return { label: "Active", color: "bg-emerald-100 text-emerald-800" };
  }
  if (contributions >= 10) {
    return { label: "Regular", color: "bg-blue-100 text-blue-800" };
  }
  return { label: "Contributor", color: "bg-slate-100 text-slate-800" };
}
