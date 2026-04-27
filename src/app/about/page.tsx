import Collapsible from '@/components/Collapsible';
import { getAbout, type AboutEntry } from '@/lib/pages';

export const metadata = { title: 'About — Noshinto' };

function Paragraphs({ text, className = '' }: { text: string; className?: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => (
        <p key={i} className={`whitespace-pre-line ${i > 0 ? 'pt-4' : ''} ${className}`}>
          {block}
        </p>
      ))}
    </>
  );
}

function ExperienceBody({ entry }: { entry: AboutEntry }) {
  const hasSections = entry.sections && entry.sections.length > 0;
  return (
    <div className="pb-10 space-y-6">
      {entry.meta && <p className="copy-sm opacity-60">{entry.meta}</p>}
      {hasSections && (
        <div className="space-y-6">
          {entry.sections!.map((s, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-16">{s.heading}</h3>
              <p className="copy-sm whitespace-pre-line opacity-75">{s.body}</p>
            </div>
          ))}
        </div>
      )}
      {entry.body && (
        <div className="copy-sm opacity-75">
          <Paragraphs text={entry.body} />
        </div>
      )}
    </div>
  );
}

export default function AboutPage() {
  const about = getAbout();

  return (
    <main className="grid-layout pt-[50vh] pb-24">
      <div className="col-span-full lg:col-start-4 lg:col-span-6 text-16">
        <Paragraphs text={about.intro} />

        {about.experience.length > 0 && (
          <section className="mt-32 mb-40">
            <h2 className="eyebrow uppercase tracking-wider">{about.experienceTitle}</h2>

            <div className="mt-10">
              {about.experience.map((entry, i) => (
                <Collapsible key={i} title={entry.title}>
                  <ExperienceBody entry={entry} />
                </Collapsible>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
