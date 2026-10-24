"use client";

import * as React from "react";

const emptySubscribe = () => () => {};

export function CurrentYear({ fallback = "2026" }: { fallback?: string }) {
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) {
    return <span>{fallback}</span>;
  }

  return <span>{new Date().getFullYear()}</span>;
}
