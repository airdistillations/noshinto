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
      </body>
    </html>
  );
}
