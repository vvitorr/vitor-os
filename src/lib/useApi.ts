"use client";

import { useEffect, useState } from "react";

// undefined = loading, null = not configured / failed
export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, [url]);
  return data;
}
