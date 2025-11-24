"use client";

import { CookiesProvider } from "react-cookie";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return <CookiesProvider>{children}</CookiesProvider>;
}
