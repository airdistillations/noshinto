'use client';

import { useEffect, useState } from 'react';
import { type RepoConfig, putText, readText } from '@/lib/github-client';
import type { AboutData, AboutEntry, AboutSection } from '@/lib/pages';

const ABOUT_PATH = 'content/about.json';

const EMPTY: AboutData = {
  intro: '',
  experienceTitle: 'Experience',
  experience: [],
};

function newSection(): AboutSection {
  return { heading: '', body: '' };
}

function newEntry(): AboutEntry {
  return { title: '', meta: '', body: '', sections: [] };
}

export default function AboutEditor({
  cfg,
  pat,
  onDone,
  onError,
}: {
  cfg: RepoConfig;
  pat: string;
  onDone: () => void;
  onError: (s: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AboutData>(EMPTY);
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    (async () => {
      onError('');
      try {
        const file = await readText(pat, cfg, ABOUT_PATH);
        if (file) {
          const parsed = JSON.parse(file.content) as Partial<AboutData>;
          setData({
            intro: parsed.intro ?? '',
            experienceTitle: parsed.experienceTitle ?? 'Experience',
            experience: Array.isArray(parsed.experience) ? parsed.experience : [],
          });
          setSha(file.sha);
        }
      } catch (e: any) {
        onError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [cfg, pat, onError]);

  function updateEntry(i: number, patch: Partial<AboutEntry>) {
    setData((d) => ({
      ...d,
      experience: d.experience.map((e, idx) => (idx === i ? { ...e, ...patch } : e)),
    }));
  }

  function addEntry() {
    setData((d) => ({ ...d, experience: [...d.experience, newEntry()] }));
  }

  function removeEntry(i: number) {
    if (!confirm('Remove this experience entry?')) return;
    setData((d) => ({ ...d, experience: d.experience.filter((_, idx) => idx !== i) }));
  }

  function moveEntry(i: number, dir: -1 | 1) {
    setData((d) => {
      const next = d.experience.slice();
      const j = i + dir;
      if (j < 0 || j >= next.length) return d;
      [next[i], next[j]] = [next[j], next[i]];
      return { ...d, experience: next };
    });
  }

  function updateSection(entryIdx: number, secIdx: number, patch: Partial<AboutSection>) {
    setData((d) => ({
      ...d,
      experience: d.experience.map((e, idx) => {
        if (idx !== entryIdx) return e;
        const sections = (e.sections || []).map((s, j) => (j === secIdx ? { ...s, ...patch } : s));
        return { ...e, sections };
      }),
    }));
  }

  function addSection(entryIdx: number) {
    setData((d) => ({
      ...d,
      experience: d.experience.map((e, idx) =>
        idx === entryIdx ? { ...e, sections: [...(e.sections || []), newSection()] } : e,
      ),
    }));
  }

  function removeSection(entryIdx: number, secIdx: number) {
    setData((d) => ({
      ...d,
      experience: d.experience.map((e, idx) => {
        if (idx !== entryIdx) return e;
        const sections = (e.sections || []).filter((_, j) => j !== secIdx);
        return { ...e, sections };
      }),
    }));
  }

  function moveSection(entryIdx: number, secIdx: number, dir: -1 | 1) {
    setData((d) => ({
      ...d,
      experience: d.experience.map((e, idx) => {
        if (idx !== entryIdx) return e;
        const sections = (e.sections || []).slice();
        const j = secIdx + dir;
        if (j < 0 || j >= sections.length) return e;
        [sections[secIdx], sections[j]] = [sections[j], sections[secIdx]];
        return { ...e, sections };
      }),
    }));
  }

  async function publish() {
    onError('');
    setStatus('');
    setBusy(true);
    try {
      // Strip empty sections / fields before serialising so the JSON stays clean.
      const clean: AboutData = {
        intro: data.intro,
        experienceTitle: data.experienceTitle.trim() || 'Experience',
        experience: data.experience.map((e) => {
          const sections = (e.sections || []).filter((s) => s.heading.trim() || s.body.trim());
          const out: AboutEntry = { title: e.title };
          if (e.meta && e.meta.trim()) out.meta = e.meta.trim();
          if (e.body && e.body.trim()) out.body = e.body;
          if (sections.length) out.sections = sections;
          return out;
        }),
      };
      const text = JSON.stringify(clean, null, 2) + '\n';
      setStatus('Publishing about.json…');
      const result = await putText(pat, cfg, ABOUT_PATH, text, 'admin: update about page', sha);
      setSha((result as any)?.content?.sha ?? sha);
      setStatus('Done. Site will rebuild in ~1 minute.');
      setTimeout(onDone, 800);
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
        <span className="copy-sm opacity-50">Edit · About</span>
      </div>

      <div className="grid gap-6 pb-8">
        <Field label="Intro paragraph">
          <textarea
            value={data.intro}
            onChange={(e) => setData((d) => ({ ...d, intro: e.target.value }))}
            rows={6}
            className="input resize-y"
          />
          <p className="copy-sm opacity-50 pt-1">Blank lines create separate paragraphs.</p>
        </Field>

        <Field label="Experience section heading">
          <input
            type="text"
            value={data.experienceTitle}
            onChange={(e) => setData((d) => ({ ...d, experienceTitle: e.target.value }))}
            className="input"
            placeholder="Experience"
          />
        </Field>
      </div>

      <div className="border-t border-current/15 pt-8">
        <div className="flex items-baseline justify-between pb-4">
          <h2 className="text-16">Experience entries ({data.experience.length})</h2>
          <button onClick={addEntry} className="copy-sm link-hover underline underline-offset-4">+ Add entry</button>
        </div>

        <div className="space-y-6">
          {data.experience.map((entry, i) => (
            <div key={i} className="border border-current/15 p-4 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="copy-sm opacity-50">Entry #{i + 1}</span>
                <div className="flex gap-3 copy-sm">
                  <button onClick={() => moveEntry(i, -1)} disabled={i === 0} className="link-hover disabled:opacity-30">↑</button>
                  <button onClick={() => moveEntry(i, 1)} disabled={i === data.experience.length - 1} className="link-hover disabled:opacity-30">↓</button>
                  <button onClick={() => removeEntry(i)} className="link-hover opacity-70 hover:opacity-100">Remove</button>
                </div>
              </div>

              <Field label="Title">
                <input
                  type="text"
                  value={entry.title}
                  onChange={(e) => updateEntry(i, { title: e.target.value })}
                  className="input"
                  placeholder="Role · Company"
                />
              </Field>

              <Field label="Meta line (optional)">
                <input
                  type="text"
                  value={entry.meta || ''}
                  onChange={(e) => updateEntry(i, { meta: e.target.value })}
                  className="input"
                  placeholder="Company · 2019 – 2023"
                />
              </Field>

              <div className="border-t border-current/10 pt-3">
                <div className="flex items-baseline justify-between pb-2">
                  <span className="copy-sm opacity-60">Sub-sections</span>
                  <button onClick={() => addSection(i)} className="copy-sm link-hover underline underline-offset-4">+ Add section</button>
                </div>
                <div className="space-y-3">
                  {(entry.sections || []).map((section, j) => (
                    <div key={j} className="border border-current/10 p-3 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="copy-sm opacity-50">Section #{j + 1}</span>
                        <div className="flex gap-3 copy-sm">
                          <button onClick={() => moveSection(i, j, -1)} disabled={j === 0} className="link-hover disabled:opacity-30">↑</button>
                          <button onClick={() => moveSection(i, j, 1)} disabled={j === (entry.sections?.length || 0) - 1} className="link-hover disabled:opacity-30">↓</button>
                          <button onClick={() => removeSection(i, j)} className="link-hover opacity-70 hover:opacity-100">Remove</button>
                        </div>
                      </div>
                      <Field label="Heading">
                        <input
                          type="text"
                          value={section.heading}
                          onChange={(e) => updateSection(i, j, { heading: e.target.value })}
                          className="input"
                        />
                      </Field>
                      <Field label="Body">
                        <textarea
                          value={section.body}
                          onChange={(e) => updateSection(i, j, { body: e.target.value })}
                          rows={4}
                          className="input resize-y"
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              </div>

              <Field label="Free body text (optional, used when there are no sub-sections)">
                <textarea
                  value={entry.body || ''}
                  onChange={(e) => updateEntry(i, { body: e.target.value })}
                  rows={5}
                  className="input resize-y"
                />
                <p className="copy-sm opacity-50 pt-1">Blank lines create separate paragraphs.</p>
              </Field>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 flex items-center justify-between gap-4">
        <div className="copy-sm opacity-60 min-h-[1.2em]">{status}</div>
        <button
          onClick={publish}
          disabled={busy}
          className="text-16 border border-current px-5 py-2 link-hover disabled:opacity-40"
        >
          {busy ? 'Publishing…' : 'Publish'}
        </button>
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
