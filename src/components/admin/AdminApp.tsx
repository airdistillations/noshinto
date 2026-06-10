'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type RepoConfig,
  deleteFile,
  listDir,
  putBinary,
  putText,
  readText,
  testAuth,
} from '@/lib/github-client';
import { resizeAndEncode, blobToObjectURL, slugify } from '@/lib/image-client';
import { parse, serialize, type ProjectDoc, type ProjectImage } from '@/lib/yaml-client';
import AboutEditor from './AboutEditor';
import ContactEditor from './ContactEditor';

const OWNER = process.env.NEXT_PUBLIC_REPO_OWNER || '';
const REPO = process.env.NEXT_PUBLIC_REPO_NAME || '';
const BRANCH = process.env.NEXT_PUBLIC_REPO_BRANCH || 'main';

const PAT_KEY = 'noshinto_admin_pat';

type View =
  | { kind: 'setup' }
  | { kind: 'list' }
  | { kind: 'edit'; slug: string | null }
  | { kind: 'pages' }
  | { kind: 'edit-about' }
  | { kind: 'edit-contact' };

type ProjectSummary = {
  slug: string;
  title: string;
  order: number;
  coverUrl?: string;
};

function rawContentUrl(cfg: RepoConfig, path: string) {
  return `https://raw.githubusercontent.com/${cfg.owner}/${cfg.repo}/${cfg.branch}/${path}`;
}

export default function AdminApp() {
  const cfg = useMemo<RepoConfig>(() => ({ owner: OWNER, repo: REPO, branch: BRANCH }), []);
  const [pat, setPat] = useState<string>('');
  const [view, setView] = useState<View>({ kind: 'setup' });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PAT_KEY);
      if (saved) {
        setPat(saved);
        setView({ kind: 'list' });
      }
    } catch {}
  }, []);

  if (!OWNER || !REPO) {
    return (
      <Shell>
        <p className="copy-sm opacity-70">
          Admin is not configured. Env vars NEXT_PUBLIC_REPO_OWNER and NEXT_PUBLIC_REPO_NAME must be set at build time.
          This happens automatically on GitHub Actions; for local dev set them in <code>.env.local</code>.
        </p>
      </Shell>
    );
  }

  function signOut() {
    try { localStorage.removeItem(PAT_KEY); } catch {}
    setPat('');
    setView({ kind: 'setup' });
  }

  // Top-level tabs are visible whenever a token is set (i.e. not in setup).
  const showTabs = view.kind !== 'setup';
  const activeTab: 'projects' | 'pages' =
    view.kind === 'pages' || view.kind === 'edit-about' || view.kind === 'edit-contact'
      ? 'pages'
      : 'projects';

  return (
    <Shell
      pat={pat}
      onSignOut={signOut}
      tabs={
        showTabs ? (
          <nav className="flex gap-6 copy-sm">
            <button
              onClick={() => setView({ kind: 'list' })}
              className={`link-hover ${activeTab === 'projects' ? '' : 'opacity-50'}`}
            >
              Projects
            </button>
            <button
              onClick={() => setView({ kind: 'pages' })}
              className={`link-hover ${activeTab === 'pages' ? '' : 'opacity-50'}`}
            >
              Pages
            </button>
          </nav>
        ) : null
      }
    >
      {error && <p className="copy-sm text-[color:var(--color-preview-red)] pb-6">{error}</p>}
      {view.kind === 'setup' && (
        <Setup
          cfg={cfg}
          onSaved={(token) => {
            setPat(token);
            setError('');
            setView({ kind: 'list' });
          }}
          onError={setError}
        />
      )}
      {view.kind === 'list' && (
        <ProjectList
          cfg={cfg}
          pat={pat}
          onNew={() => setView({ kind: 'edit', slug: null })}
          onEdit={(slug) => setView({ kind: 'edit', slug })}
          onError={setError}
        />
      )}
      {view.kind === 'edit' && (
        <ProjectEditor
          cfg={cfg}
          pat={pat}
          slug={view.slug}
          onDone={() => { setError(''); setView({ kind: 'list' }); }}
          onError={setError}
        />
      )}
      {view.kind === 'pages' && (
        <PagesList
          onEditAbout={() => setView({ kind: 'edit-about' })}
          onEditContact={() => setView({ kind: 'edit-contact' })}
        />
      )}
      {view.kind === 'edit-about' && (
        <AboutEditor
          cfg={cfg}
          pat={pat}
          onDone={() => { setError(''); setView({ kind: 'pages' }); }}
          onError={setError}
        />
      )}
      {view.kind === 'edit-contact' && (
        <ContactEditor
          cfg={cfg}
          pat={pat}
          onDone={() => { setError(''); setView({ kind: 'pages' }); }}
          onError={setError}
        />
      )}
    </Shell>
  );
}

function Shell({
  children,
  pat,
  onSignOut,
  tabs,
}: {
  children: React.ReactNode;
  pat?: string;
  onSignOut?: () => void;
  tabs?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen pt-24 pb-24 px-5 lg:px-8">
      <div className="max-w-[900px] mx-auto">
        <header className="flex items-baseline justify-between pb-4">
          <h1 className="text-16">Admin</h1>
          {pat && onSignOut && (
            <button onClick={onSignOut} className="copy-sm link-hover underline underline-offset-4">
              Sign out
            </button>
          )}
        </header>
        {tabs && <div className="pb-10 border-b border-current/15 mb-10">{tabs}</div>}
        {children}
      </div>
    </main>
  );
}

/* ---------------- Pages list ---------------- */

function PagesList({
  onEditAbout,
  onEditContact,
}: {
  onEditAbout: () => void;
  onEditContact: () => void;
}) {
  return (
    <div>
      <p className="copy-sm opacity-60 pb-6">Static pages with editable content.</p>
      <ul className="space-y-3">
        <li className="flex items-center gap-4 border border-current/15 p-4">
          <div className="flex-1 min-w-0">
            <p className="text-16">About</p>
            <p className="copy-sm opacity-50">/about/ · intro paragraph + experience entries</p>
          </div>
          <button onClick={onEditAbout} className="copy-sm link-hover underline underline-offset-4">
            Edit
          </button>
        </li>
        <li className="flex items-center gap-4 border border-current/15 p-4">
          <div className="flex-1 min-w-0">
            <p className="text-16">Contact</p>
            <p className="copy-sm opacity-50">shown on /about/ · bio, e-mail, location, clock, socials</p>
          </div>
          <button onClick={onEditContact} className="copy-sm link-hover underline underline-offset-4">
            Edit
          </button>
        </li>
      </ul>
    </div>
  );
}

/* ---------------- Setup ---------------- */

function Setup({
  cfg,
  onSaved,
  onError,
}: {
  cfg: RepoConfig;
  onSaved: (pat: string) => void;
  onError: (s: string) => void;
}) {
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    onError('');
    try {
      const me = await testAuth(token.trim(), cfg);
      try { localStorage.setItem(PAT_KEY, token.trim()); } catch {}
      onSaved(token.trim());
      void me;
    } catch (e: any) {
      onError(`Couldn't authenticate: ${e.message || e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="text-16">
      <p className="pb-6 opacity-80">
        One-time setup. Paste a GitHub Personal Access Token with <strong>Contents: Read and write</strong> permission on <code>{cfg.owner}/{cfg.repo}</code>.
      </p>
      <ol className="copy-sm opacity-75 list-decimal pl-5 space-y-2 pb-6">
        <li>Go to <a className="link-hover underline underline-offset-4" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">github.com/settings/personal-access-tokens/new</a></li>
        <li>Under <strong>Repository access</strong>, pick <em>Only select repositories</em> → <code>{cfg.owner}/{cfg.repo}</code></li>
        <li>Under <strong>Repository permissions</strong>, set <em>Contents</em> to <strong>Read and write</strong></li>
        <li>Pick an expiration (e.g. 1 year), generate, copy the token, paste below</li>
      </ol>
      <label className="block">
        <span className="copy-sm opacity-60">Token</span>
        <input
          type="password"
          autoComplete="off"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="github_pat_..."
          className="mt-2 w-full bg-transparent border-b border-current/30 py-2 outline-none focus:border-current"
        />
      </label>
      <div className="pt-6 flex gap-4">
        <button
          onClick={save}
          disabled={!token.trim() || busy}
          className="text-16 border border-current px-4 py-2 link-hover disabled:opacity-40"
        >
          {busy ? 'Checking…' : 'Save'}
        </button>
      </div>
      <p className="pt-8 copy-sm opacity-50">
        The token is stored in this browser&rsquo;s localStorage and sent only to api.github.com.
      </p>
    </div>
  );
}

/* ---------------- Project list ---------------- */

function ProjectList({
  cfg,
  pat,
  onNew,
  onEdit,
  onError,
}: {
  cfg: RepoConfig;
  pat: string;
  onNew: () => void;
  onEdit: (slug: string) => void;
  onError: (s: string) => void;
}) {
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);

  const load = useCallback(async () => {
    onError('');
    try {
      const dirs = (await listDir(pat, cfg, 'public/work')).filter((e) => e.type === 'dir');
      const loaded = await Promise.all(
        dirs.map(async (d): Promise<ProjectSummary> => {
          const mdPath = `public/work/${d.name}/project.md`;
          const file = await readText(pat, cfg, mdPath);
          let title = d.name.replace(/-/g, ' ');
          let order = 999;
          let cover: string | undefined;
          if (file) {
            const doc = parse(file.content);
            title = doc.title || title;
            order = doc.order;
            const coverFile = doc.cover || doc.images[0]?.src;
            if (coverFile) cover = rawContentUrl(cfg, `public/work/${d.name}/${coverFile}`);
          }
          return { slug: d.name, title, order, coverUrl: cover };
        }),
      );
      loaded.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
      setProjects(loaded);
    } catch (e: any) {
      onError(e.message || String(e));
    }
  }, [cfg, pat, onError]);

  useEffect(() => { void load(); }, [load]);

  if (projects === null) return <p className="copy-sm opacity-60">Loading…</p>;

  return (
    <div>
      <div className="flex items-baseline justify-between pb-6">
        <p className="copy-sm opacity-60">{projects.length} {projects.length === 1 ? 'project' : 'projects'}</p>
        <button onClick={onNew} className="text-16 border border-current px-4 py-2 link-hover">
          + New project
        </button>
      </div>
      {projects.length === 0 ? (
        <p className="copy-sm opacity-60">No projects yet.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li key={p.slug} className="flex items-center gap-4 border border-current/15 p-3">
              <div className="w-16 h-20 bg-[var(--color-gray)]/15 overflow-hidden shrink-0">
                {p.coverUrl && <img src={p.coverUrl} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-16 truncate">{p.title}</p>
                <p className="copy-sm opacity-50 truncate">{p.slug} · order {p.order}</p>
              </div>
              <button onClick={() => onEdit(p.slug)} className="copy-sm link-hover underline underline-offset-4">
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Project editor ---------------- */

type EditorImage = ProjectImage & {
  sha?: string;
  previewUrl?: string;
  pending?: { blob: Blob; base64: string }; // new image, not yet committed
};

function emptyDoc(): ProjectDoc {
  return { title: '', order: 10, images: [], body: '' };
}

function ProjectEditor({
  cfg,
  pat,
  slug: initialSlug,
  onDone,
  onError,
}: {
  cfg: RepoConfig;
  pat: string;
  slug: string | null;
  onDone: () => void;
  onError: (s: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>(initialSlug || '');
  const [doc, setDoc] = useState<ProjectDoc>(emptyDoc());
  const [mdSha, setMdSha] = useState<string | undefined>(undefined);
  const [editorImages, setEditorImages] = useState<EditorImage[]>([]);
  const [existingFilesSha, setExistingFilesSha] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [publishStatus, setPublishStatus] = useState<string>('');

  // Load existing project, if editing
  useEffect(() => {
    (async () => {
      onError('');
      if (!initialSlug) {
        setLoading(false);
        return;
      }
      try {
        const mdPath = `public/work/${initialSlug}/project.md`;
        const file = await readText(pat, cfg, mdPath);
        if (file) {
          const parsed = parse(file.content);
          setDoc(parsed);
          setMdSha(file.sha);
        }
        // Also list all files in the dir for image SHAs (needed to overwrite/delete)
        const entries = await listDir(pat, cfg, `public/work/${initialSlug}`);
        const shaMap: Record<string, string> = {};
        for (const e of entries) if (e.type === 'file') shaMap[e.name] = e.sha;
        setExistingFilesSha(shaMap);

        // Build editor images list from doc + resolve existing URLs
        const imgs: EditorImage[] = (file ? parse(file.content).images : []).map((img) => ({
          ...img,
          sha: shaMap[img.src],
          previewUrl: rawContentUrl(cfg, `public/work/${initialSlug}/${img.src}`),
        }));
        setEditorImages(imgs);
      } catch (e: any) {
        onError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [cfg, pat, initialSlug, onError]);

  // Auto-generate slug from title when creating a new project
  useEffect(() => {
    if (initialSlug) return;
    if (!doc.title) return;
    setSlug(slugify(doc.title));
  }, [doc.title, initialSlug]);

  function update<K extends keyof ProjectDoc>(k: K, v: ProjectDoc[K]) {
    setDoc((d) => ({ ...d, [k]: v }));
  }

  async function addImages(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    for (const f of arr) {
      try {
        const { blob, base64, filename } = await resizeAndEncode(f);
        // Unique filename: add numeric suffix if conflict
        const used = new Set(editorImages.map((i) => i.src));
        let final = filename;
        let n = 1;
        while (used.has(final)) {
          final = filename.replace(/\.jpg$/, `-${n}.jpg`);
          n++;
        }
        setEditorImages((list) => [
          ...list,
          {
            src: final,
            alt: '',
            previewUrl: blobToObjectURL(blob),
            pending: { blob, base64 },
          },
        ]);
      } catch (e: any) {
        onError(`Image failed: ${e.message || e}`);
      }
    }
  }

  function moveImage(i: number, dir: -1 | 1) {
    setEditorImages((list) => {
      const next = list.slice();
      const j = i + dir;
      if (j < 0 || j >= next.length) return list;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function removeImage(i: number) {
    setEditorImages((list) => list.filter((_, idx) => idx !== i));
  }

  function updateImageAlt(i: number, alt: string) {
    setEditorImages((list) => list.map((img, idx) => (idx === i ? { ...img, alt } : img)));
  }

  async function publish() {
    onError('');
    setPublishStatus('');
    const finalSlug = slug.trim();
    if (!finalSlug) return onError('Slug is required.');
    if (!doc.title.trim()) return onError('Title is required.');

    setBusy(true);
    try {
      // 1) Upload new images
      for (let i = 0; i < editorImages.length; i++) {
        const img = editorImages[i];
        if (img.pending) {
          setPublishStatus(`Uploading ${img.src} (${i + 1}/${editorImages.length})…`);
          await putBinary(
            pat,
            cfg,
            `public/work/${finalSlug}/${img.src}`,
            img.pending.base64,
            `admin: upload ${img.src}`,
          );
        }
      }

      // 2) Delete images removed from the list (editing existing project only)
      if (initialSlug) {
        const keepSet = new Set(editorImages.map((i) => i.src));
        for (const [name, sha] of Object.entries(existingFilesSha)) {
          if (name === 'project.md') continue;
          if (!keepSet.has(name)) {
            setPublishStatus(`Removing ${name}…`);
            try {
              await deleteFile(pat, cfg, `public/work/${initialSlug}/${name}`, sha, `admin: remove ${name}`);
            } catch (e) {
              // non-fatal; continue
              console.warn('delete failed', name, e);
            }
          }
        }
      }

      // 3) If slug changed on an existing project: write everything under new slug, delete old
      // (skip v1 — keep slug immutable after creation)
      if (initialSlug && finalSlug !== initialSlug) {
        throw new Error('Changing the slug is not supported yet. Delete and recreate if you need to rename.');
      }

      // 4) Write project.md
      const finalDoc: ProjectDoc = {
        ...doc,
        images: editorImages.map((i) => ({ src: i.src, alt: i.alt })),
        cover: doc.cover || editorImages[0]?.src,
      };
      const yaml = serialize(finalDoc);
      setPublishStatus('Publishing project.md…');
      await putText(
        pat,
        cfg,
        `public/work/${finalSlug}/project.md`,
        yaml,
        `admin: ${initialSlug ? 'update' : 'create'} ${finalSlug}`,
        mdSha,
      );

      setPublishStatus('Done. Site will rebuild in ~1 minute.');
      setTimeout(onDone, 800);
    } catch (e: any) {
      onError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function deleteProject() {
    if (!initialSlug) return;
    if (!confirm(`Delete project "${doc.title || initialSlug}"? This cannot be undone from here.`)) return;
    setBusy(true);
    onError('');
    try {
      // Delete every file in the dir
      const entries = await listDir(pat, cfg, `public/work/${initialSlug}`);
      for (const e of entries) {
        if (e.type === 'file') {
          setPublishStatus(`Deleting ${e.name}…`);
          await deleteFile(pat, cfg, e.path, e.sha, `admin: delete ${initialSlug}`);
        }
      }
      setPublishStatus('Deleted.');
      setTimeout(onDone, 600);
    } catch (e: any) {
      onError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="copy-sm opacity-60">Loading…</p>;

  return (
    <div className="text-16 pb-20">
      <div className="flex items-baseline justify-between pb-6">
        <button onClick={onDone} className="copy-sm link-hover underline underline-offset-4">← Back</button>
        <span className="copy-sm opacity-50">{initialSlug ? 'Edit' : 'New project'}</span>
      </div>

      <div className="grid gap-6 pb-8">
        <Field label="Title">
          <input
            type="text"
            value={doc.title}
            onChange={(e) => update('title', e.target.value)}
            className="input"
            placeholder="Atelier No. 1"
          />
        </Field>

        <Field label="Slug (URL)">
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            disabled={!!initialSlug}
            className="input disabled:opacity-50"
            placeholder="atelier-no-1"
          />
          <p className="copy-sm opacity-50 pt-1">
            {slug && `Becomes /work/${slug}/ · `}
            {initialSlug ? 'locked on existing projects' : 'auto-filled from title'}
          </p>
        </Field>

        <div className="grid grid-cols-2 gap-6">
          <Field label="Year">
            <input
              type="text"
              value={String(doc.year ?? '')}
              onChange={(e) => update('year', e.target.value)}
              className="input"
              placeholder="2025"
            />
          </Field>
          <Field label="Order">
            <input
              type="number"
              value={doc.order}
              onChange={(e) => update('order', Number(e.target.value) || 0)}
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Field label="Role">
            <input
              type="text"
              value={doc.role || ''}
              onChange={(e) => update('role', e.target.value)}
              className="input"
              placeholder="Photography"
            />
          </Field>
          <Field label="Location">
            <input
              type="text"
              value={doc.location || ''}
              onChange={(e) => update('location', e.target.value)}
              className="input"
              placeholder="Paris"
            />
          </Field>
        </div>

        <Field label="Description (appears on home + detail)">
          <textarea
            value={doc.description || ''}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
            className="input resize-y"
            placeholder={'A quiet study of\nmaterial and light.'}
          />
          <p className="copy-sm opacity-50 pt-1">Line breaks are kept as written.</p>
        </Field>

        <Field label="Long body (optional, below the images)">
          <textarea
            value={doc.body || ''}
            onChange={(e) => update('body', e.target.value)}
            rows={4}
            className="input resize-y"
          />
        </Field>
      </div>

      <ImageDrop onAdd={addImages}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {editorImages.map((img, i) => (
            <div key={`${img.src}-${i}`} className="relative group border border-current/15">
              <div className="aspect-[3/4] bg-[var(--color-gray)]/15">
                {img.previewUrl && <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />}
              </div>
              <input
                type="text"
                placeholder="alt text"
                value={img.alt}
                onChange={(e) => updateImageAlt(i, e.target.value)}
                className="input text-[1.2rem] py-1 border-0 border-t border-current/15"
              />
              <div className="flex justify-between px-2 py-1 copy-sm">
                <div className="flex gap-2">
                  <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="link-hover disabled:opacity-30">↑</button>
                  <button type="button" onClick={() => moveImage(i, 1)} disabled={i === editorImages.length - 1} className="link-hover disabled:opacity-30">↓</button>
                </div>
                <button type="button" onClick={() => removeImage(i)} className="link-hover opacity-70 hover:opacity-100">
                  Remove
                </button>
              </div>
              {i === 0 && <span className="absolute top-1 left-1 copy-sm px-1 bg-current text-[var(--color-bg)]">cover</span>}
            </div>
          ))}
        </div>
      </ImageDrop>

      <div className="pt-8 flex items-center justify-between gap-4">
        <div className="copy-sm opacity-60 min-h-[1.2em]">{publishStatus}</div>
        <div className="flex gap-3">
          {initialSlug && (
            <button
              onClick={deleteProject}
              disabled={busy}
              className="text-16 border border-current/30 px-4 py-2 link-hover opacity-70"
            >
              Delete
            </button>
          )}
          <button
            onClick={publish}
            disabled={busy}
            className="text-16 border border-current px-5 py-2 link-hover disabled:opacity-40"
          >
            {busy ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="copy-sm opacity-60">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

/* ---------------- Image drop zone ---------------- */

function ImageDrop({
  onAdd,
  children,
}: {
  onAdd: (files: FileList | File[]) => void;
  children?: React.ReactNode;
}) {
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (e.dataTransfer.files?.length) onAdd(e.dataTransfer.files);
      }}
      className={`border border-dashed ${over ? 'border-current' : 'border-current/25'} p-4`}
    >
      <div className="flex items-center justify-between pb-4">
        <span className="copy-sm opacity-70">Drag photos here, or</span>
        <label className="copy-sm underline underline-offset-4 cursor-pointer link-hover">
          choose files
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && onAdd(e.target.files)}
          />
        </label>
      </div>
      {children}
    </div>
  );
}
