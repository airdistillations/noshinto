export const metadata = { title: 'Contact — Noshinto' };

const EMAIL = 'hello@noshinto.com';

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 md:px-10 pt-10 md:pt-20 pb-20">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight max-w-3xl">
        For projects, collaborations, or a quiet hello.
      </h1>

      <div className="mt-12 md:mt-16 grid md:grid-cols-[1.2fr,1fr] gap-10 md:gap-20 border-t border-line pt-10 md:pt-16">
        <div>
          <p className="eyebrow">Email</p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-3 block font-serif text-3xl md:text-5xl tracking-tight hover:opacity-60 transition-opacity break-all"
          >
            {EMAIL}
          </a>

          <p className="mt-10 eyebrow">Based in</p>
          <p className="mt-3 font-serif text-xl md:text-2xl">Your city, Country</p>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-3 flex flex-col gap-2 font-serif text-xl md:text-2xl">
              <li>
                <a className="hover:opacity-60" href="https://instagram.com/" target="_blank" rel="noreferrer">
                  Instagram ↗
                </a>
              </li>
              <li>
                <a className="hover:opacity-60" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-8 md:mt-auto text-sm text-muted max-w-sm">
            Please include a short brief, timing, and any reference material when
            reaching out.
          </div>
        </div>
      </div>
    </div>
  );
}
