import LocalClock from '@/components/LocalClock';

export const metadata = { title: 'Contact — Noshinto' };

const EMAIL = 'hello@noshinto.com';
const LOCATION = 'Antwerp, Belgium';
const AGENCY = {
  name: '',
  address: '',
  phone: '',
  email: '',
};
const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/noshinto/' },
];

export default function ContactPage() {
  return (
    <main className="relative isolate min-h-svh">
      {/* Animated grain overlay sits on top of the page's theme background
          (var(--color-bg), toggled by the logo). Pointer-events none so
          it never interferes with interaction. */}
      <div aria-hidden className="noise-overlay" />

      <div className="grid-layout pt-[50vh] pb-24">
        {/* Desktop: cols 4-8 = bio/socials, cols 10-12 = agency/contact
            Mobile: single column stack */}
        <div className="col-span-full lg:col-start-4 lg:col-span-5 text-16">
          <p className="whitespace-pre-line">
            Replace this with a short bio. Two or three lines is plenty. What you do,
            who you work with, what you&rsquo;re drawn to.
          </p>
          <p className="pt-6 whitespace-pre-line opacity-80">
            A second paragraph for approach, recent work, or a quiet note about collaboration.
          </p>

          <p className="pt-10 copy-sm opacity-60">Socials</p>
          <ul className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-16">
            {SOCIALS.map((s, i) => (
              <li key={s.href} className="inline-flex">
                <a className="link-hover" href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
                {i < SOCIALS.length - 1 && <span aria-hidden>,</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-full mt-10 lg:mt-0 lg:col-start-10 lg:col-span-3 text-16">
          {AGENCY.name && (
            <>
              <p className="copy-sm opacity-60">Represented by</p>
              <p className="pt-1 whitespace-pre-line">
                {AGENCY.name}
                {AGENCY.address ? `\n${AGENCY.address}` : ''}
              </p>
            </>
          )}
          {AGENCY.phone && <p className="pt-4">{AGENCY.phone}</p>}
          {AGENCY.email && (
            <p className="pt-4">
              <a href={`mailto:${AGENCY.email}`} className="link-hover">{AGENCY.email}</a>
            </p>
          )}

          <p className={`${AGENCY.name ? 'pt-10' : ''} copy-sm opacity-60`}>E-mail</p>
          <p className="pt-1">
            <a href={`mailto:${EMAIL}`} className="link-hover break-all">{EMAIL}</a>
          </p>

          <p className="pt-10 copy-sm opacity-60">Based in</p>
          <p className="pt-1">{LOCATION}</p>

          <p className="pt-10 copy-sm opacity-60">Local time</p>
          <LocalClock city="Antwerp" timeZone="Europe/Brussels" className="pt-1" />
        </div>
      </div>
    </main>
  );
}
