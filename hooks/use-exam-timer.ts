"use client";

import { useEffect, useMemo, useState } from "react";

export function useExamTimer(durationMinutes: number, onTimeout: () => void) {
  const durationSeconds = useMemo(() => durationMinutes * 60, [durationMinutes]);
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);

  useEffect(() => {
    setRemainingSeconds(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      onTimeout();
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [onTimeout, remainingSeconds]);

  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");

  return {
    remainingSeconds,
    formatted: `${minutes}:${seconds}`,
  };
}
