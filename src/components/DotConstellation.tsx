/**
 * The dot-constellation glyph used for the menu / home buttons.
 * fill inherits currentColor so it follows the surrounding text colour.
 */
export default function DotConstellation({
  size = 40,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240.9 240.9"
      fill="currentColor"
      width={size}
      height={size}
      aria-hidden
      className={className}
    >
      <circle cx="119.9" cy="120.5" r="16" />
      <circle cx="162.1" cy="120.5" r="13.4" />
      <circle cx="199.1" cy="120.5" r="10.9" />
      <circle cx="193.3" cy="90.6" r="10.9" />
      <circle cx="150.1" cy="47.2" r="10.9" />
      <circle cx="89.1" cy="47.5" r="10.9" />
      <circle cx="46.7" cy="90.3" r="10.9" />
      <circle cx="47.3" cy="152.1" r="10.9" />
      <circle cx="89.6" cy="193.6" r="10.9" />
      <circle cx="150.8" cy="193.4" r="10.9" />
      <circle cx="192.9" cy="151.4" r="10.9" />
      <circle cx="230.1" cy="120.5" r="7.4" />
      <circle cx="149.8" cy="90.7" r="13.4" />
      <circle cx="175.9" cy="64.5" r="10.9" />
      <circle cx="197.9" cy="42.6" r="7.4" />
      <circle cx="162.3" cy="18.7" r="7.4" />
      <circle cx="76.3" cy="19.3" r="7.4" />
      <circle cx="18.4" cy="77.6" r="7.4" />
      <circle cx="18" cy="162.3" r="7.4" />
      <circle cx="76.9" cy="221.9" r="7.4" />
      <circle cx="161" cy="222.7" r="7.4" />
      <circle cx="220.9" cy="164.6" r="7.4" />
      <circle cx="222" cy="79" r="7.4" />
      <circle cx="119.9" cy="78.3" r="13.4" />
      <circle cx="119.9" cy="41.3" r="10.9" />
      <circle cx="119.9" cy="10.3" r="7.4" />
      <circle cx="90.1" cy="90.7" r="13.4" />
      <circle cx="63.9" cy="64.5" r="10.9" />
      <circle cx="42" cy="42.6" r="7.4" />
      <circle cx="77.8" cy="120.5" r="13.4" />
      <circle cx="40.7" cy="120.5" r="10.9" />
      <circle cx="9.7" cy="120.5" r="7.4" />
      <circle cx="90.1" cy="150.3" r="13.4" />
      <circle cx="63.9" cy="176.5" r="10.9" />
      <circle cx="42" cy="198.4" r="7.4" />
      <circle cx="119.9" cy="162.6" r="13.4" />
      <circle cx="119.9" cy="199.7" r="10.9" />
      <circle cx="119.9" cy="230.7" r="7.4" />
      <circle cx="149.8" cy="150.3" r="13.4" />
      <circle cx="175.9" cy="176.5" r="10.9" />
      <circle cx="197.9" cy="198.4" r="7.4" />
    </svg>
  );
}
