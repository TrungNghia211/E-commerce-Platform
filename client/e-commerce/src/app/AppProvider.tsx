"use client";

import { useLayoutEffect } from "react";

import { clientSessionToken } from "@/lib/http";

export default function AppProvider({
  children,
  initialSessionToken = "",
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
}) {
  useLayoutEffect(() => {
    if (typeof window !== "undefined")
      clientSessionToken.value = initialSessionToken;
  }, [initialSessionToken]);

  return <>{children}</>;
}
