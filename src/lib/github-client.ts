// Minimal GitHub Contents API client (browser-only).

const API = 'https://api.github.com';

export type RepoConfig = {
  owner: string;
  repo: string;
  branch: string;
};

async function gh<T = any>(path: string, pat: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body.message) msg += ` — ${body.message}`;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function testAuth(pat: string, cfg: RepoConfig): Promise<{ login: string }> {
  // Probe with a repo fetch (requires Contents: Read permission at minimum).
  await gh(`/repos/${cfg.owner}/${cfg.repo}`, pat);
  const me = await gh<{ login: string }>(`/user`, pat);
  return me;
}

export type DirEntry = { name: string; path: string; type: 'file' | 'dir'; sha: string; size: number };

export async function listDir(pat: string, cfg: RepoConfig, path: string): Promise<DirEntry[]> {
  try {
    const data = await gh<DirEntry[] | DirEntry>(
      `/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURI(path)}?ref=${cfg.branch}`,
      pat,
    );
    return Array.isArray(data) ? data : [data];
  } catch (e: any) {
    if (String(e.message).startsWith('404')) return [];
    throw e;
  }
}

export type FileContent = { content: string; sha: string };

export async function readText(pat: string, cfg: RepoConfig, path: string): Promise<FileContent | null> {
  try {
    const data = await gh<{ content: string; sha: string; encoding: string }>(
      `/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURI(path)}?ref=${cfg.branch}`,
      pat,
    );
    const raw = data.content.replace(/\n/g, '');
    // atob → bytes → decode as UTF-8
    const bin = atob(raw);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const text = new TextDecoder('utf-8').decode(bytes);
    return { content: text, sha: data.sha };
  } catch (e: any) {
    if (String(e.message).startsWith('404')) return null;
    throw e;
  }
}

function utf8ToBase64(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export async function putText(
  pat: string,
  cfg: RepoConfig,
  path: string,
  content: string,
  message: string,
  sha?: string,
) {
  const body: Record<string, unknown> = {
    message,
    content: utf8ToBase64(content),
    branch: cfg.branch,
  };
  if (sha) body.sha = sha;
  return gh(`/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURI(path)}`, pat, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function putBinary(
  pat: string,
  cfg: RepoConfig,
  path: string,
  base64Content: string,
  message: string,
  sha?: string,
) {
  const body: Record<string, unknown> = {
    message,
    content: base64Content,
    branch: cfg.branch,
  };
  if (sha) body.sha = sha;
  return gh(`/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURI(path)}`, pat, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteFile(
  pat: string,
  cfg: RepoConfig,
  path: string,
  sha: string,
  message: string,
) {
  return gh(`/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURI(path)}`, pat, {
    method: 'DELETE',
    body: JSON.stringify({ message, sha, branch: cfg.branch }),
  });
}
