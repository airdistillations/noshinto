'use client';

import { useEffect, useState } from 'react';

export default function BerlinClock({ className = '' }: { className?: string }) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Europe/Berlin',
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <p className={className}>Berlin, {time || '--:--:--'}</p>;
}
