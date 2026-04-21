export const metadata = { title: 'About — Noshinto' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-6 md:px-10 pt-10 md:pt-20 pb-16">
      <p className="eyebrow">About</p>
      <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight">
        A short introduction.
      </h1>
      <div className="mt-10 grid md:grid-cols-[1fr,1fr] gap-10 md:gap-16 text-ink/85 text-base md:text-lg leading-relaxed font-serif">
        <p>
          Replace this text with your bio. Keep it short — a paragraph or two is plenty.
          What you do, who you work with, where you&rsquo;re based.
        </p>
        <p>
          A second paragraph about approach, recent clients, or whatever feels most
          relevant. The tone here is quiet and direct.
        </p>
      </div>
    </div>
  );
}
