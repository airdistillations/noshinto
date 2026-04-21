export const metadata = { title: 'About — Noshinto' };

export default function AboutPage() {
  return (
    <main className="grid-layout pt-[50vh] pb-24">
      <div className="col-span-full lg:col-start-4 lg:col-span-6 text-16">
        <p className="whitespace-pre-line">
          Replace this text with a short bio. Keep it spare &mdash; a paragraph or two.
          What you do, who you work with, where you&rsquo;re based.
        </p>
        <p className="pt-6 whitespace-pre-line opacity-80">
          A second paragraph about approach or recent work. The tone here is quiet and direct.
        </p>
      </div>
    </main>
  );
}
