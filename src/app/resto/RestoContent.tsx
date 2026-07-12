'use client';

import { useEffect } from 'react';
import { asset } from '@/lib/asset';

/**
 * Standalone /resto page body. Deliberately no links to the rest of the
 * site — the wordmark is plain text and there is no nav. The scroll
 * reveal mirrors the artifact's IntersectionObserver.
 */
export default function RestoContent() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll('.resto .reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header>
        {/* Same continuously spinning logo as the main site; the white
            SVG is inverted to ink for this light page. Decorative only —
            deliberately not a link. */}
        <span className="logo-spin" aria-label="Noshinto">
          <img src={asset('/logo.svg')} alt="" className="spin-slow" draggable={false} />
        </span>
      </header>

      <main>
        {/* HERO */}
        <div className="hero reveal">
          <p className="eyebrow">Aanpak &amp; prijzen</p>
          <h1>Websites voor restaurants</h1>
          <p>
            Een website op het niveau van uw keuken: eigen design, standaard in drie talen, en een
            systeem waarmee u zelf uw menu en foto&rsquo;s beheert.
          </p>
        </div>

        {/* AANPAK */}
        <section id="aanpak" className="reveal">
          <h2>De aanpak in 5 stappen</h2>
          <div className="section-body">
            <ol className="steps">
              <li>
                <span className="num">01</span>
                <div>
                  <h3>Intake bij u ter plaatse (±90 min)</h3>
                  <p>
                    We bespreken visie, verwachtingen en huisstijl. U ontvangt een korte brief van
                    één pagina die we samen goedkeuren; die vormt de leidraad van het hele project.
                  </p>
                </div>
              </li>
              <li>
                <span className="num">02</span>
                <div>
                  <h3>Design &amp; bouw</h3>
                  <p>
                    Uw website in uw huisstijl, drietalig (NL/FR/EN), geoptimaliseerd voor
                    smartphone. U krijgt twee feedbackrondes op het design.
                  </p>
                </div>
              </li>
              <li>
                <span className="num">03</span>
                <div>
                  <h3>Fotografie (optioneel)</h3>
                  <p>
                    Uw website is ontworpen rond sterke beelden. Kies voor de basisshoot of een
                    uitgebreide shoot (zie modules).
                  </p>
                </div>
              </li>
              <li>
                <span className="num">04</span>
                <div>
                  <h3>Content &amp; CMS</h3>
                  <p>
                    Wij plaatsen alle inhoud. U krijgt een eigen, beveiligde login waarmee u zelf
                    menu, foto&rsquo;s en openingsuren aanpast, plus een uur opleiding.
                  </p>
                </div>
              </li>
              <li>
                <span className="num">05</span>
                <div>
                  <h3>Lancering</h3>
                  <p>
                    Koppeling van uw domeinnaam, Google Bedrijfsprofiel en vindbaarheidsbasis
                    inbegrepen. 30 dagen nazorg na livegang.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* SETUP */}
        <section id="setup" className="reveal">
          <h2>Eenmalige setup</h2>
          <p className="section-note">Prijzen excl. btw.</p>

          <div className="menu-card">
            <p className="menu-heading">Pakketten</p>
            <div className="menu-row">
              <span className="item">
                <strong>Website</strong>
              </span>
              <span className="leader" aria-hidden="true"></span>
              <span className="price">€ 1.500</span>
            </div>
            <div className="menu-row">
              <span className="item">
                <strong>Website + basis fotoshoot</strong>
                <span className="desc">
                  ±15 professioneel bewerkte beelden van interieur, gerechten en team — ook
                  bruikbaar voor uw social media.
                </span>
              </span>
              <span className="leader" aria-hidden="true"></span>
              <span className="price">€ 1.950</span>
            </div>
          </div>

          <div className="included">
            <h3>Inbegrepen in beide pakketten</h3>
            <ul>
              <li>Intake op locatie + goedgekeurde projectbrief</li>
              <li>Webdesign afgestemd op uw identiteit</li>
              <li>7 pagina&rsquo;s: home · menu · over ons · galerij · praktisch · contact · vacatures</li>
              <li>Drietalig NL/FR/EN (u levert de teksten in de drie talen aan)</li>
              <li>Menukaart als doorzoekbare tekst (beter vindbaar in Google dan een PDF)</li>
              <li>Integratie van uw reservatiesysteem</li>
              <li>Eigen CMS-login + 1 uur opleiding</li>
              <li>Koppeling van uw bestaande domeinnaam, Google Bedrijfsprofiel en basis-SEO</li>
              <li>2 feedbackrondes + lanceringscheck, 30 dagen nazorg</li>
            </ul>
          </div>

          <div className="included">
            <h3>Optionele modules</h3>
          </div>
          <div className="menu-card">
            <div className="menu-row">
              <span className="item">
                Mini-brandkit
                <span className="desc">
                  Logo opgeschoond &amp; gevectoriseerd, kleurenpalet, typografie, favicon &amp;
                  social avatars.
                </span>
              </span>
              <span className="leader" aria-hidden="true"></span>
              <span className="price">€ 480</span>
            </div>
            <div className="menu-row">
              <span className="item">Halve dag fotoshoot</span>
              <span className="leader" aria-hidden="true"></span>
              <span className="price">€ 500</span>
            </div>
            <div className="menu-row">
              <span className="item">Halve dag video</span>
              <span className="leader" aria-hidden="true"></span>
              <span className="price">€ 950</span>
            </div>
            <div className="menu-row">
              <span className="item">Combinatie foto + video</span>
              <span className="leader" aria-hidden="true"></span>
              <span className="price">€ 1.200</span>
            </div>
            <div className="menu-row">
              <span className="item">Extra taal (bovenop NL/FR/EN)</span>
              <span className="leader" aria-hidden="true"></span>
              <span className="price">€ 350</span>
            </div>
            <div className="menu-row">
              <span className="item">Vertaling van uw teksten</span>
              <span className="leader" aria-hidden="true"></span>
              <span className="price">op offerte</span>
            </div>
          </div>
        </section>

        {/* BEHEER */}
        <section id="beheer" className="reveal">
          <h2>Maandelijks websitebeheer</h2>
          <p className="section-note">Eerste 12 maanden vast, daarna maandelijks opzegbaar.</p>
          <div className="plans">
            <div className="plan">
              <h3>Standaard beheer</h3>
              <p className="price">€ 24</p>
              <p className="per">per maand, excl. btw</p>
              <ul>
                <li>
                  <span className="mark">✓</span>
                  <span>Hosting, SSL, dagelijkse back-ups &amp; updates</span>
                </li>
                <li>
                  <span className="mark">✓</span>
                  <span>CMS-toegang &amp; support via e-mail</span>
                </li>
                <li className="absent">
                  <span className="mark">—</span>
                  <span>Wij voeren uw wijzigingen door</span>
                </li>
              </ul>
            </div>
            <div className="plan">
              <h3>Comfort beheer</h3>
              <p className="price">€ 69</p>
              <p className="per">per maand, excl. btw</p>
              <ul>
                <li>
                  <span className="mark">✓</span>
                  <span>Hosting, SSL, dagelijkse back-ups &amp; updates</span>
                </li>
                <li>
                  <span className="mark">✓</span>
                  <span>CMS-toegang &amp; support via e-mail</span>
                </li>
                <li>
                  <span className="mark">✓</span>
                  <span>Wij voeren uw wijzigingen door (menu binnen 48u, tot 2u/mnd)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* UITGANGSPUNTEN */}
        <section id="uitgangspunten" className="reveal">
          <h2>Uitgangspunten</h2>
          <div className="section-body">
            <ul className="terms">
              <li>
                U beschikt over een <strong>eigen domeinnaam</strong> en toegang tot het beheer
                ervan. Het ontwarren of overdragen van domeinen die vastzitten in pakketten bij
                derden gebeurt in regie (€ 75/u, steeds na akkoord).
              </li>
              <li>
                Uw <strong>e-mail</strong> draait bij uw bestaande provider (Google Workspace of
                Microsoft 365). Het opzetten of migreren van een nieuwe e-mailomgeving valt buiten
                dit aanbod en wordt apart geoffreerd.
              </li>
              <li>
                Teksten worden door u aangeleverd in NL, FR en EN; vertaling is mogelijk als extra
                module.
              </li>
            </ul>
          </div>
        </section>

        {/* PRAKTISCH */}
        <section id="praktisch" className="reveal">
          <h2>Praktisch</h2>
          <div className="section-body">
            <ul className="terms">
              <li>50% voorschot bij start, saldo bij lancering.</li>
              <li>Alle prijzen excl. 21% btw.</li>
              <li>U blijft steeds eigenaar van uw domeinnaam en inhoud.</li>
            </ul>
          </div>
        </section>

        {/* VOORGAANDE PROJECTEN */}
        <section id="projecten" className="reveal">
          <h2>Voorgaande projecten</h2>
          <div className="section-body">
            <ul className="projects">
              <li>
                <a href="https://www.airdistillations.com/" target="_blank" rel="noopener">
                  <span className="name">A.I.R. Distillations</span>
                  <span className="url">airdistillations.com</span>
                </a>
              </li>
              <li>
                <a href="https://www.lassohospitality.be/" target="_blank" rel="noopener">
                  <span className="name">Lasso Hospitality</span>
                  <span className="url">lassohospitality.be</span>
                </a>
              </li>
              <li>
                <a href="https://alter-cuvee.com/nl-be" target="_blank" rel="noopener">
                  <span className="name">Alter Cuvée</span>
                  <span className="url">alter-cuvee.com</span>
                </a>
              </li>
              <li>
                <a href="https://www.goodgift.be/" target="_blank" rel="noopener">
                  <span className="name">Goodgift</span>
                  <span className="url">goodgift.be</span>
                </a>
              </li>
              <li>
                <a href="https://bike-inn.be/" target="_blank" rel="noopener">
                  <span className="name">Bike Inn</span>
                  <span className="url">bike-inn.be</span>
                </a>
              </li>
              <li>
                <a href="https://noshinto.com/" target="_blank" rel="noopener">
                  <span className="name">Noshinto</span>
                  <span className="url">noshinto.com</span>
                </a>
              </li>
              <li>
                <a href="https://zonbreker.be/" target="_blank" rel="noopener">
                  <span className="name">Zonbreker</span>
                  <span className="url">zonbreker.be</span>
                </a>
              </li>
              <li>
                <a href="https://schaduwbordenshop.be/" target="_blank" rel="noopener">
                  <span className="name">Schaduwbordenshop</span>
                  <span className="url">schaduwbordenshop.be</span>
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="reveal contact">
          <h2>Zin om samen te werken?</h2>
          <p>Vertel kort over uw zaak, dan plannen we een intake ter plaatse.</p>
          <a className="btn" href="mailto:hi@noshinto.com">
            Plan een intake
          </a>
        </section>
      </main>

      <footer>
        <span>© Noshinto</span>
        <a href="mailto:hi@noshinto.com">hi@noshinto.com</a>
      </footer>
    </>
  );
}
