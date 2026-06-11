'use client';

import { useRouter } from 'next/navigation';
import { GlassButton } from './ImageZoom';
import DotConstellation from './DotConstellation';

/**
 * Mobile-only fixed glass "home" button — identical to the one in the
 * project pages' zoom cluster, for pages without an ImageZoom cluster
 * (e.g. the about page). One tap navigates straight to the work grid.
 */
export default function GlassHomeButton() {
  const router = useRouter();
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-[95px] z-30 flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <GlassButton
          onClick={() => router.push('/')}
          label="Back to work overview"
          symbol={<DotConstellation size={26} className="spin-slow" />}
          float="float-d"
        />
      </div>
    </div>
  );
}
