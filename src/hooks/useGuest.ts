"use client";

import { useMemo, useState } from "react";

import { titleCaseName } from "@/lib/text";
import type { ClientGuest } from "@/types/guest";

export function useGuest(initial: ClientGuest) {
  const [customName, setCustomName] = useState("");

  const guest = useMemo((): ClientGuest => {
    if (!initial.isFallback) return initial;
    const name = titleCaseName(customName.trim().slice(0, 60));
    if (!name) return initial;
    return {
      ...initial,
      name,
      displayName: name,
      fullGreeting: `Dear ${name}`,
      isFallback: false,
    };
  }, [initial, customName]);

  return { guest, customName, setCustomName, needsName: initial.isFallback && !customName.trim() };
}
