'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Contact has been merged into the About page. This stub keeps the old
 * /contact/ URL alive (static export can't issue server redirects) and
 * forwards visitors client-side.
 */
export default function ContactRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/about/');
  }, [router]);

  return (
    <main className="grid-layout pt-[50vh] pb-24 copy-sm opacity-60">
      <p className="col-span-full lg:col-start-4 lg:col-span-6">
        Contact moved to the About page — taking you there…
      </p>
    </main>
  );
}
