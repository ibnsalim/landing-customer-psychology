import { useEffect, useState } from "react";

function getTimeLeft() {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const diff = endOfDay.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-3 text-urgency font-inter font-bold text-xl">
      <span className="text-sm font-bangla font-normal mr-1">অফার শেষ হচ্ছে:</span>
      <div className="flex gap-1">
        <span className="bg-card px-2 py-1 rounded">{pad(time.hours)}</span>
        <span>:</span>
        <span className="bg-card px-2 py-1 rounded">{pad(time.minutes)}</span>
        <span>:</span>
        <span className="bg-card px-2 py-1 rounded">{pad(time.seconds)}</span>
      </div>
    </div>
  );
}
