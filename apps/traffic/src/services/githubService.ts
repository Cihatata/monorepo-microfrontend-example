import { useQuery } from "@tanstack/react-query";

// GitHub API Types
export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
  html_url: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
  };
  created_at: string;
  payload: {
    action?: string;
    commits?: { message: string }[];
    pull_request?: { title: string };
    issue?: { title: string };
  };
}

export interface TrafficStats {
  totalCommits: number;
  totalEvents: number;
  uniqueContributors: number;
  lastActivity: string;
  recentCommits: GitHubCommit[];
  recentEvents: GitHubEvent[];
}

// Query Keys
const GITHUB_COMMITS_KEY = ["github", "commits"];
const GITHUB_EVENTS_KEY = ["github", "events"];
const GITHUB_TRAFFIC_STATS_KEY = ["github", "traffic-stats"];

// GitHub API Base URL
const GITHUB_API_BASE = "https://api.github.com";

// Default repository to track (facebook/react as example)
const DEFAULT_OWNER = "facebook";
const DEFAULT_REPO = "react";

/**
 * Fetch recent commits from a GitHub repository
 */
async function fetchGitHubCommits(
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO,
  perPage = 10
): Promise<GitHubCommit[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=${perPage}`,
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
 * Fetch recent events from a GitHub repository
 */
async function fetchGitHubEvents(
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO,
  perPage = 10
): Promise<GitHubEvent[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/events?per_page=${perPage}`,
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
 * Fetch combined traffic stats
 */
async function fetchTrafficStats(
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO
): Promise<TrafficStats> {
  const [commits, events] = await Promise.all([
    fetchGitHubCommits(owner, repo, 15),
    fetchGitHubEvents(owner, repo, 20),
  ]);

  const uniqueContributors = new Set(
    commits.filter((c) => c.author).map((c) => c.author!.login)
  ).size;

  return {
    totalCommits: commits.length,
    totalEvents: events.length,
    uniqueContributors,
    lastActivity: commits[0]?.commit.author.date || new Date().toISOString(),
    recentCommits: commits.slice(0, 10),
    recentEvents: events.slice(0, 10),
  };
}

/**
 * Hook: Get recent commits
 */
export function useGitHubCommits(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return useQuery({
    queryKey: [...GITHUB_COMMITS_KEY, owner, repo],
    queryFn: () => fetchGitHubCommits(owner, repo),
  });
}

/**
 * Hook: Get recent events
 */
export function useGitHubEvents(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return useQuery({
    queryKey: [...GITHUB_EVENTS_KEY, owner, repo],
    queryFn: () => fetchGitHubEvents(owner, repo),
  });
}

/**
 * Hook: Get combined traffic stats
 */
export function useGitHubTrafficStats(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return useQuery({
    queryKey: [...GITHUB_TRAFFIC_STATS_KEY, owner, repo],
    queryFn: () => fetchTrafficStats(owner, repo),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get query keys for cache operations
 */
export function getGitHubCommitsQueryKey(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return [...GITHUB_COMMITS_KEY, owner, repo];
}

export function getGitHubEventsQueryKey(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return [...GITHUB_EVENTS_KEY, owner, repo];
}

export function getGitHubTrafficStatsQueryKey(owner = DEFAULT_OWNER, repo = DEFAULT_REPO) {
  return [...GITHUB_TRAFFIC_STATS_KEY, owner, repo];
}

/**
 * Helper: Format event type to human readable
 */
export function formatEventType(type: string): string {
  const eventLabels: Record<string, string> = {
    PushEvent: "Push",
    PullRequestEvent: "Pull Request",
    IssuesEvent: "Issue",
    IssueCommentEvent: "Comment",
    CreateEvent: "Create",
    DeleteEvent: "Delete",
    WatchEvent: "Star",
    ForkEvent: "Fork",
    ReleaseEvent: "Release",
  };
  return eventLabels[type] || type.replace("Event", "");
}

/**
 * Helper: Get event color class
 */
export function getEventColorClass(type: string): string {
  const colors: Record<string, string> = {
    PushEvent: "bg-emerald-100 text-emerald-800",
    PullRequestEvent: "bg-purple-100 text-purple-800",
    IssuesEvent: "bg-red-100 text-red-800",
    IssueCommentEvent: "bg-blue-100 text-blue-800",
    CreateEvent: "bg-green-100 text-green-800",
    WatchEvent: "bg-yellow-100 text-yellow-800",
    ForkEvent: "bg-indigo-100 text-indigo-800",
    ReleaseEvent: "bg-pink-100 text-pink-800",
  };
  return colors[type] || "bg-slate-100 text-slate-800";
}
