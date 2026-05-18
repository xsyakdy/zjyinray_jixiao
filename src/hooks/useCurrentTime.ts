import { useEffect, useState } from 'react';

const formatCurrentTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(() => formatCurrentTime(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(formatCurrentTime(new Date()));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return currentTime;
};
