// Minimal YAML frontmatter serialize/parse for our fixed project schema.
// Handles: scalars, quoted strings, numbers, the `description: |` block scalar,
// and an `images:` list of `{ src, alt }` items.

export type ProjectImage = { src: string; alt: string };

export type ProjectDoc = {
  title: string;
  year?: string | number;
  role?: string;
  location?: string;
  description?: string;
  order: number;
  cover?: string;
  images: ProjectImage[];
  body: string;
};

function quote(s: string): string {
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

export function serialize(p: ProjectDoc): string {
  const lines: string[] = ['---'];
  lines.push(`title: ${quote(p.title)}`);
  if (p.year !== undefined && p.year !== '') lines.push(`year: ${p.year}`);
  if (p.role) lines.push(`role: ${quote(p.role)}`);
  if (p.location) lines.push(`location: ${quote(p.location)}`);
  lines.push(`order: ${p.order}`);
  if (p.description) {
    lines.push('description: |');
    for (const l of p.description.split('\n')) lines.push('  ' + l);
  }
  if (p.cover) lines.push(`cover: ${p.cover}`);
  if (p.images && p.images.length) {
    lines.push('images:');
    for (const img of p.images) {
      lines.push(`  - src: ${img.src}`);
      lines.push(`    alt: ${quote(img.alt || '')}`);
    }
  }
  lines.push('---');
  if (p.body && p.body.trim()) {
    lines.push('');
    lines.push(p.body.trim());
    lines.push('');
  }
  return lines.join('\n');
}

function unquote(s: string): string {
  const t = s.trim();
  if (t.startsWith('"') && t.endsWith('"') && t.length >= 2) {
    return t.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (t.startsWith("'") && t.endsWith("'") && t.length >= 2) return t.slice(1, -1);
  return t;
}

export function parse(raw: string): ProjectDoc {
  const m = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  const fm = m ? m[1] : '';
  const body = (m ? m[2] : '').trim();

  const p: ProjectDoc = { title: '', order: 999, images: [], body };
  const lines = fm.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const mm = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!mm) { i++; continue; }
    const key = mm[1];
    const val = mm[2];

    if (key === 'description' && val.trim() === '|') {
      i++;
      const acc: string[] = [];
      while (i < lines.length && (/^  /.test(lines[i]) || lines[i] === '')) {
        acc.push(lines[i].replace(/^ {2}/, ''));
        i++;
      }
      p.description = acc.join('\n').replace(/\s+$/, '');
      continue;
    }

    if (key === 'images' && val.trim() === '') {
      i++;
      const arr: ProjectImage[] = [];
      let cur: ProjectImage | null = null;
      while (i < lines.length && /^ {2}/.test(lines[i])) {
        const il = lines[i];
        const srcMatch = il.match(/^ {2}-\s*src:\s*(.+)$/);
        const altMatch = il.match(/^ {4}alt:\s*(.+)$/);
        const shortStr = il.match(/^ {2}-\s*(["'].+["']|[^\s].*)$/);
        if (srcMatch) {
          if (cur) arr.push(cur);
          cur = { src: unquote(srcMatch[1]), alt: '' };
        } else if (altMatch && cur) {
          cur.alt = unquote(altMatch[1]);
        } else if (shortStr && !srcMatch && !altMatch) {
          if (cur) arr.push(cur);
          cur = { src: unquote(shortStr[1]), alt: '' };
        }
        i++;
      }
      if (cur) arr.push(cur);
      p.images = arr;
      continue;
    }

    const v = unquote(val);
    if (key === 'order') {
      const n = Number(v);
      p.order = Number.isFinite(n) ? n : 999;
    } else if (key === 'year') {
      const n = Number(v);
      p.year = Number.isFinite(n) && /^\d+$/.test(v) ? n : v;
    } else if (key === 'title') p.title = v;
    else if (key === 'role') p.role = v;
    else if (key === 'location') p.location = v;
    else if (key === 'cover') p.cover = v;
    i++;
  }

  return p;
}
