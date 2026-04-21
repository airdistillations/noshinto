import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import ThemeBoot from '@/components/ThemeBoot';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: 'Noshinto',
  description: 'Selected work.',
  icons: {
    icon: [
      { url: `${basePath}/logo.svg`, type: 'image/svg+xml' },
    ],
    shortcut: `${basePath}/logo.svg`,
    apple: `${basePath}/logo.svg`,
  },
};

// Prevent theme flash: set data-theme before paint from localStorage / prefers-color-scheme.
const themeBootScript = `
(function(){try{
  var t = localStorage.getItem('theme');
  if(!t){ t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  document.documentElement.setAttribute('data-theme', t);
}catch(e){}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen">
        <ThemeBoot />
        <Nav />
        {children}

        {/* Reusable SVG filters: liquid-glass dispersion/refraction for .glass-btn */}
        <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
          <defs>
            {/*
              Liquid lens: radial refraction that pulls pixels toward the
              element's centre, like looking through a water droplet.
              The displacement map is an inline-SVG encoded as a data URI:
                - Red channel: 1 at the left edge, 0 at the right → positive
                  displacement on the left, negative on the right → both sides
                  sample from closer to the centre.
                - Green channel: same axis vertically.
                - plus-lighter blend keeps the two channels independent.
            */}
            <filter id="liquid-lens" x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="objectBoundingBox">
              <feImage
                href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><defs><linearGradient id='x' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='%23f00'/><stop offset='1' stop-color='%23000'/></linearGradient><linearGradient id='y' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='%2300ff00'/><stop offset='1' stop-color='%23000'/></linearGradient></defs><rect width='100' height='100' fill='url(%23x)'/><rect width='100' height='100' fill='url(%23y)' style='mix-blend-mode:plus-lighter'/></svg>"
                x="0" y="0" width="1" height="1"
                preserveAspectRatio="none"
                result="lensMap"
              />
              <feDisplacementMap in="SourceGraphic" in2="lensMap" scale="0.6" xChannelSelector="R" yChannelSelector="G" />
            </filter>

            {/* Kept for reference; still used as a fallback in some places. */}
            <filter id="glass-disperse" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.008 0.011" numOctaves="2" seed="11" result="noise" />
              <feGaussianBlur in="noise" stdDeviation="2" result="noiseSoft" />
              <feDisplacementMap in="SourceGraphic" in2="noiseSoft" scale="48" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
      </body>
    </html>
  );
}
