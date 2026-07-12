import { Newsreader } from 'next/font/google';
import RestoContent from './RestoContent';
import './resto.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

export const metadata = {
  title: 'Websites voor restaurants — Noshinto',
  description:
    "Een website op het niveau van uw keuken: eigen design, standaard in drie talen, en een systeem waarmee u zelf uw menu en foto's beheert.",
};

/**
 * Standalone offer page at /resto. Renders without the site chrome
 * (Nav and MobileMenu both skip this route) and deliberately has no
 * navigation back into the main site.
 */
export default function RestoPage() {
  return (
    <div className={`resto ${newsreader.variable}`}>
      <RestoContent />
    </div>
  );
}
