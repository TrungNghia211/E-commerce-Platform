"use client";

import { useState } from "react";

import { clientSessionToken } from "@/lib/http";

export default function AppProvider({
  children,
  initialSessionToken = "",
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
}) {
  useState(() => {
    if (typeof window !== "undefined")
      clientSessionToken.value = initialSessionToken;
  });

  return <>{children}</>;
}
