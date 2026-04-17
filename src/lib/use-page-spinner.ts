"use client";

import { useEffect, useState } from "react";

export const PAGE_SPINNER_DURATION_MS = 1000;

export function usePageSpinner() {
  const [isSpinnerActive, setIsSpinnerActive] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsSpinnerActive(false);
    }, PAGE_SPINNER_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return isSpinnerActive;
}
