export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-xs tracking-wide-xl uppercase text-muted">
        <span>&copy; {year} noshinto</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}
