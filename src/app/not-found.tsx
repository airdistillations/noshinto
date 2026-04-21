import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[800px] px-6 md:px-10 py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-serif text-4xl md:text-6xl">Not found.</h1>
      <Link href="/" className="mt-8 inline-block eyebrow hover:opacity-60">← Back to work</Link>
    </div>
  );
}
