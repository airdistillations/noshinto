import Link from 'next/link';
import Collapsible from '@/components/Collapsible';
import GlassHomeButton from '@/components/GlassHomeButton';
import LocalClock from '@/components/LocalClock';
import { getAbout, getContact, type AboutEntry } from '@/lib/pages';

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
  const contact = getContact();

  return (
    <main className="grid-layout pt-24 lg:pt-[50vh] pb-24">
      <div className="col-span-full lg:col-start-4 lg:col-span-6 text-16 relative z-20">
        {/* Mobile: same nav-links row as the project pages. */}
        <p className="lg:hidden pb-16 flex items-baseline gap-8 text-[1.3rem] uppercase tracking-[0.18em]">
          <Link href="/" className="link-hover"><span className="arrow-drift" aria-hidden>←</span> Back to work</Link>
          <Link href="/about/" className="link-hover">about</Link>
        </p>

        <Paragraphs text={about.intro} />

        {about.experience.length > 0 && (
          <section className="mt-32">
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

        {/* Contact — merged from the former /contact/ page. */}
        <section className="mt-32 mb-24">
          <h2 className="eyebrow uppercase tracking-wider">Contact</h2>

          <div className="mt-10">
            {contact.bio && <Paragraphs text={contact.bio} />}

            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              <div>
                {contact.email && (
                  <>
                    <p className="copy-sm opacity-60">E-mail</p>
                    <p className="pt-1">
                      <a href={`mailto:${contact.email}`} className="link-hover break-all">
                        {contact.email}
                      </a>
                    </p>
                  </>
                )}

                {contact.location && (
                  <>
                    <p className="pt-8 copy-sm opacity-60">Based in</p>
                    <p className="pt-1">{contact.location}</p>
                  </>
                )}

                {contact.city && contact.timezone && (
                  <>
                    <p className="pt-8 copy-sm opacity-60">Local time</p>
                    <LocalClock city={contact.city} timeZone={contact.timezone} className="pt-1" />
                  </>
                )}
              </div>

              <div>
                {contact.socials.length > 0 && (
                  <>
                    <p className="copy-sm opacity-60">Socials</p>
                    <ul className="pt-1 flex flex-wrap gap-x-4 gap-y-1">
                      {contact.socials.map((s, i) => (
                        <li key={`${s.href}-${i}`} className="inline-flex">
                          <a className="link-hover" href={s.href} target="_blank" rel="noreferrer">
                            {s.label}
                          </a>
                          {i < contact.socials.length - 1 && <span aria-hidden>,</span>}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile: fixed glass dot button → straight back to the work grid. */}
      <GlassHomeButton />
    </main>
  );
}
