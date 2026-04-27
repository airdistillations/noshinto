'use client';

import { useEffect, useState } from 'react';
import { type RepoConfig, putText, readText } from '@/lib/github-client';
import type { ContactData, SocialLink } from '@/lib/pages';

const CONTACT_PATH = 'content/contact.json';

const EMPTY: ContactData = {
  bio: '',
  email: '',
  location: '',
  city: '',
  timezone: 'UTC',
  socials: [],
};

export default function ContactEditor({
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
  const [data, setData] = useState<ContactData>(EMPTY);
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    (async () => {
      onError('');
      try {
        const file = await readText(pat, cfg, CONTACT_PATH);
        if (file) {
          const parsed = JSON.parse(file.content) as Partial<ContactData>;
          setData({
            bio: parsed.bio ?? '',
            email: parsed.email ?? '',
            location: parsed.location ?? '',
            city: parsed.city ?? '',
            timezone: parsed.timezone ?? 'UTC',
            socials: Array.isArray(parsed.socials) ? parsed.socials : [],
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

  function update<K extends keyof ContactData>(k: K, v: ContactData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function updateSocial(i: number, patch: Partial<SocialLink>) {
    setData((d) => ({
      ...d,
      socials: d.socials.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));
  }

  function addSocial() {
    setData((d) => ({ ...d, socials: [...d.socials, { label: '', href: '' }] }));
  }

  function removeSocial(i: number) {
    setData((d) => ({ ...d, socials: d.socials.filter((_, idx) => idx !== i) }));
  }

  function moveSocial(i: number, dir: -1 | 1) {
    setData((d) => {
      const next = d.socials.slice();
      const j = i + dir;
      if (j < 0 || j >= next.length) return d;
      [next[i], next[j]] = [next[j], next[i]];
      return { ...d, socials: next };
    });
  }

  async function publish() {
    onError('');
    setStatus('');
    setBusy(true);
    try {
      const clean: ContactData = {
        bio: data.bio,
        email: data.email.trim(),
        location: data.location.trim(),
        city: data.city.trim(),
        timezone: data.timezone.trim(),
        socials: data.socials
          .filter((s) => s.label.trim() && s.href.trim())
          .map((s) => ({ label: s.label.trim(), href: s.href.trim() })),
      };
      const text = JSON.stringify(clean, null, 2) + '\n';
      setStatus('Publishing contact.json…');
      const result = await putText(pat, cfg, CONTACT_PATH, text, 'admin: update contact page', sha);
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
        <span className="copy-sm opacity-50">Edit · Contact</span>
      </div>

      <div className="grid gap-6 pb-8">
        <Field label="Bio">
          <textarea
            value={data.bio}
            onChange={(e) => update('bio', e.target.value)}
            rows={6}
            className="input resize-y"
          />
          <p className="copy-sm opacity-50 pt-1">Blank lines create separate paragraphs.</p>
        </Field>

        <div className="grid grid-cols-2 gap-6">
          <Field label="E-mail">
            <input
              type="email"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
              className="input"
              placeholder="hi@noshinto.com"
            />
          </Field>
          <Field label="Based in">
            <input
              type="text"
              value={data.location}
              onChange={(e) => update('location', e.target.value)}
              className="input"
              placeholder="Antwerp, Belgium"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Field label="Local clock — city">
            <input
              type="text"
              value={data.city}
              onChange={(e) => update('city', e.target.value)}
              className="input"
              placeholder="Antwerp"
            />
          </Field>
          <Field label="Local clock — IANA timezone">
            <input
              type="text"
              value={data.timezone}
              onChange={(e) => update('timezone', e.target.value)}
              className="input"
              placeholder="Europe/Brussels"
            />
            <p className="copy-sm opacity-50 pt-1">e.g. Europe/Brussels, America/New_York. <a className="link-hover underline underline-offset-4" href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank" rel="noreferrer">Reference list</a></p>
          </Field>
        </div>
      </div>

      <div className="border-t border-current/15 pt-8">
        <div className="flex items-baseline justify-between pb-4">
          <h2 className="text-16">Socials ({data.socials.length})</h2>
          <button onClick={addSocial} className="copy-sm link-hover underline underline-offset-4">+ Add</button>
        </div>

        <div className="space-y-3">
          {data.socials.map((s, i) => (
            <div key={i} className="border border-current/15 p-3 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="copy-sm opacity-50">#{i + 1}</span>
                <div className="flex gap-3 copy-sm">
                  <button onClick={() => moveSocial(i, -1)} disabled={i === 0} className="link-hover disabled:opacity-30">↑</button>
                  <button onClick={() => moveSocial(i, 1)} disabled={i === data.socials.length - 1} className="link-hover disabled:opacity-30">↓</button>
                  <button onClick={() => removeSocial(i)} className="link-hover opacity-70 hover:opacity-100">Remove</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Label">
                  <input
                    type="text"
                    value={s.label}
                    onChange={(e) => updateSocial(i, { label: e.target.value })}
                    className="input"
                    placeholder="Instagram"
                  />
                </Field>
                <Field label="URL">
                  <input
                    type="url"
                    value={s.href}
                    onChange={(e) => updateSocial(i, { href: e.target.value })}
                    className="input"
                    placeholder="https://…"
                  />
                </Field>
              </div>
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
