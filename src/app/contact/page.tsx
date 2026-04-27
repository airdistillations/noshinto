import LocalClock from '@/components/LocalClock';
import { getContact } from '@/lib/pages';

export const metadata = { title: 'Contact — Noshinto' };

export default function ContactPage() {
  const contact = getContact();
  const bioParagraphs = contact.bio.split(/\n{2,}/);

  return (
    <main className="relative isolate min-h-svh">
      {/* Animated grain overlay sits on top of the page's theme background
          (var(--color-bg), toggled by the logo). Pointer-events none so
          it never interferes with interaction. */}
      <div aria-hidden className="noise-overlay" />

      <div className="grid-layout pt-[50vh] pb-24">
        <div className="col-span-full lg:col-start-4 lg:col-span-5 text-16">
          {bioParagraphs.map((p, i) => (
            <p
              key={i}
              className={`whitespace-pre-line ${i > 0 ? 'pt-6 opacity-80' : ''}`}
            >
              {p}
            </p>
          ))}

          {contact.socials.length > 0 && (
            <>
              <p className="pt-10 copy-sm opacity-60">Socials</p>
              <ul className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-16">
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

        <div className="col-span-full mt-10 lg:mt-0 lg:col-start-10 lg:col-span-3 text-16">
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
              <p className="pt-10 copy-sm opacity-60">Based in</p>
              <p className="pt-1">{contact.location}</p>
            </>
          )}

          {contact.city && contact.timezone && (
            <>
              <p className="pt-10 copy-sm opacity-60">Local time</p>
              <LocalClock city={contact.city} timeZone={contact.timezone} className="pt-1" />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
