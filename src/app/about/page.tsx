export const metadata = { title: 'About — Noshinto' };

export default function AboutPage() {
  return (
    <main className="grid-layout pt-[50vh] pb-24">
      <div className="col-span-full lg:col-start-4 lg:col-span-6 text-16">
        <p>
          Everybody has the next big &lsquo;idea&rsquo;... Ideas are worthless. Magic happens when you make them come alive in the most efficient way with vigorous impact. It is never good enough, always room for improvement. The creation of B&ocirc;tan Distillery was a dream in so many levels. I designed a non-existent product that exactly fits the needs of the current population, but especially the future generations. My expertise encompasses the lifecycle of a product: from recipe creation to supply chain, from brand identity to brand manifesto, from data analysis to strategic actions. I connect all variables in a vertically aligned integrated business model to assure the desired position of the brand.
        </p>

        <details className="collapsible mt-14 border-t border-current/15">
          <summary className="flex items-baseline justify-between pt-4">
            <span>Experience</span>
            <span aria-hidden className="toggle opacity-60">+</span>
          </summary>

          <div className="pt-6 space-y-3">
            <details className="collapsible border-t border-current/10">
              <summary className="flex items-baseline justify-between pt-3">
                <span>B&ocirc;tan Distillery: Founder &amp; Chief Marketing Officer</span>
                <span aria-hidden className="toggle opacity-60">+</span>
              </summary>
              <div className="pt-4 space-y-6">
                <p className="copy-sm opacity-60">Botan bv &middot; 2019 &ndash; 2023</p>

                <div className="space-y-2">
                  <h3 className="text-16">R&amp;D, Product Development and Innovation Leadership</h3>
                  <p className="copy-sm opacity-75">
                    Commencing with my commitment to unprocessed food, I founded B&ocirc;tan Distillery, a vibrant production company, product, and brand. I seized the opportunity to elevate product innovation by crafting recipes for ready-to-drink alternatives to spirits, cocktails and wines using clean ingredients, devoid of artificial flavors, aromas and preservatives. This innovative approach marked a revolution in the current landscape.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-16">Brand Development and Brand Management</h3>
                  <p className="copy-sm opacity-75">
                    In this project, I aspired to build a (true) Community Brand. Transforming the challenge of being a startup with limited financial resources into an opportunity, I harnessed the resources of our supply chain to fuel our marketing content. I engineered the brand to breathe authenticity, creating and implementing delicate yet high-end content that seamlessly blended realness with desire and luxury.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-16">Digital Performance Marketing</h3>
                  <p className="copy-sm opacity-75">
                    In the era of rapid content consumption, I champion a return to authenticity. I strongly believe that information is the new luxury and understanding the origins of one&rsquo;s food has become paramount. Analysing sales channels and client behavior in digital domains, I enhanced our website, resulting in increased sales driven by higher conversion rates, increased average order value (AOV) and elevated brand engagement.
                  </p>
                </div>
              </div>
            </details>

            <details className="collapsible border-t border-current/10">
              <summary className="flex items-baseline justify-between pt-3">
                <span>Other Work Experience</span>
                <span aria-hidden className="toggle opacity-60">+</span>
              </summary>
              <div className="pt-4 space-y-4 copy-sm opacity-75">
                <p>Graphic Design &amp; Art Direction at Coming Soon &middot; 2016 &ndash; 2018</p>
                <div className="space-y-1">
                  <p>For Flavor Festival &middot; 2010 &mdash; 2015</p>
                  <p className="opacity-90">
                    I organised the festival, from concept creation to the actual organization and implementation of logistics and strategy, serving as the driving force behind the event.
                  </p>
                </div>
                <p>Internship at Bagaar &middot; 2014</p>
                <p>Student work Production plant at Swinkels Family Breweries &middot; 2008 &mdash; 2012</p>
              </div>
            </details>
          </div>
        </details>
      </div>
    </main>
  );
}
