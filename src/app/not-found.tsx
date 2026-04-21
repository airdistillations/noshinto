import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid-layout pt-[50vh] pb-24">
      <div className="col-span-full lg:col-start-4 lg:col-span-6 text-16">
        <p className="copy-sm opacity-60">404</p>
        <p className="pt-2">Not found.</p>
        <p className="pt-6">
          <Link href="/" className="link-hover">← Back to work</Link>
        </p>
      </div>
    </main>
  );
}
