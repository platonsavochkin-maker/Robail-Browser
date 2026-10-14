import React, { useState, useEffect } from 'react';
import {
  Search,
  Star,
  GitFork,
  CircleDot,
  BookMarked,
  Folder,
  FileCode,
  ExternalLink,
  Code2,
  RefreshCw,
  Eye,
  GitBranch,
} from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  updated_at: string;
}

const DEFAULT_REPOS: Repo[] = [
  {
    id: 10270250,
    name: 'react',
    full_name: 'facebook/react',
    description: 'The library for web and native user interfaces.',
    stargazers_count: 228000,
    forks_count: 45000,
    open_issues_count: 1200,
    language: 'JavaScript',
    html_url: 'https://github.com/facebook/react',
    owner: {
      login: 'facebook',
      avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
    },
    updated_at: '2026-03-15T00:00:00Z',
  },
  {
    id: 2325298,
    name: 'linux',
    full_name: 'torvalds/linux',
    description: 'Linux kernel source tree by Linus Torvalds.',
    stargazers_count: 178000,
    forks_count: 53000,
    open_issues_count: 320,
    language: 'C',
    html_url: 'https://github.com/torvalds/linux',
    owner: {
      login: 'torvalds',
      avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    },
    updated_at: '2026-03-20T00:00:00Z',
  },
  {
    id: 10639145,
    name: 'tailwindcss',
    full_name: 'tailwindlabs/tailwindcss',
    description: 'A utility-first CSS framework for rapid UI development.',
    stargazers_count: 82000,
    forks_count: 4100,
    open_issues_count: 85,
    language: 'TypeScript',
    html_url: 'https://github.com/tailwindlabs/tailwindcss',
    owner: {
      login: 'tailwindlabs',
      avatar_url: 'https://avatars.githubusercontent.com/u/67104415?v=4',
    },
    updated_at: '2026-03-22T00:00:00Z',
  },
  {
    id: 41881900,
    name: 'vscode',
    full_name: 'microsoft/vscode',
    description: 'Visual Studio Code: Code editing. Redefined.',
    stargazers_count: 161000,
    forks_count: 31000,
    open_issues_count: 5400,
    language: 'TypeScript',
    html_url: 'https://github.com/microsoft/vscode',
    owner: {
      login: 'microsoft',
      avatar_url: 'https://avatars.githubusercontent.com/u/6154722?v=4',
    },
    updated_at: '2026-03-24T00:00:00Z',
  },
];

export const GitHubView: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>(DEFAULT_REPOS);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);

  const searchGithub = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&per_page=12`);
      const data = await res.json();
      if (data.items) {
        setRepos(data.items);
      }
    } catch {
      // Keep existing
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchGithub(query);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#0d1117] text-[#c9d1d9] select-none font-sans">
      {/* GitHub Top Nav */}
      <header className="sticky top-0 z-30 bg-[#161b22] border-b border-[#30363d] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg height="28" viewBox="0 0 16 16" version="1.1" width="28" fill="white">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
          <span className="font-semibold text-white text-sm">GitHub</span>
          <span className="text-xs text-[#8b949e]">/</span>
          <span className="text-xs text-white font-medium">Explore & Repositories</span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-6">
          <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-lg px-2.5 py-1.5 focus-within:border-[#58a6ff]">
            <Search className="w-3.5 h-3.5 text-[#8b949e] mr-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search GitHub repositories..."
              className="bg-transparent text-xs text-white outline-none flex-1 placeholder-[#8b949e] select-text"
            />
            {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#58a6ff]" />}
          </div>
        </form>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold">
            New Repo
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#30363d]">
          <div>
            <h1 className="text-lg font-bold text-white">Popular Open-Source Repositories</h1>
            <p className="text-xs text-[#8b949e]">Top starred repositories on the open web</p>
          </div>
          <span className="text-xs text-[#8b949e] font-mono">{repos.length} Repositories</span>
        </div>

        {/* Repos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <div
              key={repo.id}
              onClick={() => setSelectedRepo(repo)}
              className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={repo.owner.avatar_url}
                    alt={repo.owner.login}
                    className="w-5 h-5 rounded-md object-cover"
                  />
                  <BookMarked className="w-4 h-4 text-[#8b949e]" />
                  <span className="text-xs font-bold text-[#58a6ff] hover:underline truncate">
                    {repo.full_name}
                  </span>
                </div>

                <p className="text-xs text-[#8b949e] line-clamp-2 leading-relaxed mb-4 select-text">
                  {repo.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#8b949e] pt-2 border-t border-[#30363d]/60">
                {repo.language && (
                  <span className="flex items-center gap-1.5 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f1e05a]" />
                    <span>{repo.language}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 hover:text-[#58a6ff]">
                  <Star className="w-3.5 h-3.5" />
                  <span>{repo.stargazers_count.toLocaleString()}</span>
                </span>
                <span className="flex items-center gap-1 hover:text-[#58a6ff]">
                  <GitFork className="w-3.5 h-3.5" />
                  <span>{repo.forks_count.toLocaleString()}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Repo Modal / Drawer */}
        {selectedRepo && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-xl w-full p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedRepo.owner.avatar_url}
                    alt={selectedRepo.owner.login}
                    className="w-10 h-10 rounded-lg"
                  />
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedRepo.full_name}</h2>
                    <span className="text-xs text-[#58a6ff]">{selectedRepo.language}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRepo(null)}
                  className="text-[#8b949e] hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-[#c9d1d9] leading-relaxed mb-6 select-text">
                {selectedRepo.description}
              </p>

              <div className="grid grid-cols-3 gap-2 p-3 bg-[#0d1117] rounded-xl border border-[#30363d] text-center mb-6">
                <div>
                  <div className="text-[10px] text-[#8b949e]">STARS</div>
                  <div className="text-sm font-bold text-white">{selectedRepo.stargazers_count.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8b949e]">FORKS</div>
                  <div className="text-sm font-bold text-white">{selectedRepo.forks_count.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8b949e]">ISSUES</div>
                  <div className="text-sm font-bold text-white">{selectedRepo.open_issues_count.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedRepo(null)}
                  className="px-4 py-1.5 rounded-lg text-xs bg-[#21262d] text-white hover:bg-[#30363d]"
                >
                  Close
                </button>
                <a
                  href={selectedRepo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs bg-[#238636] text-white font-semibold hover:bg-[#2ea043]"
                >
                  <span>Open on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
