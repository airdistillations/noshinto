/**
 * Renders a comma-separated string (e.g. a project's `role` field) as a
 * row of outlined pill elements — one per trimmed item. Each pill carries
 * a data-tag attribute so future filtering can target individual tags.
 */
export default function TagPills({
  value,
  className = '',
}: {
  value?: string;
  className?: string;
}) {
  const tags = (value || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  if (tags.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, i) => (
        <li key={`${tag}-${i}`} className="tag-pill" data-tag={tag}>
          {tag}
        </li>
      ))}
    </ul>
  );
}
