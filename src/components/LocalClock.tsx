'use client';

import { useEffect, useState } from 'react';

type Props = {
  city: string;
  timeZone: string;
  className?: string;
};

export default function LocalClock({ city, timeZone, className = '' }: Props) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return <p className={className}>{city}, {time || '--:--:--'}</p>;
}
